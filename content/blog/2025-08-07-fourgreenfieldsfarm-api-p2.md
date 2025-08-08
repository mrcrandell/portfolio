---
title: New API for Four Green Fields Farm - Part 2
description: How I built a clean, authenticated CSV import flow for recurring event data using routing-controllers, multer, and date-fns.
image: /img/blog/3-post.jpg
category: Backend
tags:
  - TypeScript
  - TypeORM
  - Express
  - routing-controllers
  - CSV Import
  - Backend Architecture
  - Nuxt Integration
date: 2025-08-07
published: true
---

In [Part 1](/blog/2025-06-26-fourgreenfieldsfarm-api-p1), I walked through setting up a clean backend for Four Green Fields Farm using TypeORM, routing-controllers, and JWT authentication.

Now that we have recurring events and core endpoints wired up, my next job will be getting all the old event data into the new system.

The previous version of the site was built with **Laravel** and used a **MySQL** database. Since we’ve fully modernized the backend with **TypeScript**, **PostgreSQL**, and a clean project structure, we needed a way to move that old data into our new setup without doing everything by hand.

This project is also eventually headed to **Vercel**, and the new PostgreSQL setup fits perfectly with their platform (or with **Supabase**, which also runs PostgreSQL and plays nicely with TypeORM). The goal here was to build something fast, flexible, and portable for future deployments.

---

## The Plan

I had one goal: make it dead simple to import a full season of events into the new system without entering them manually one by one.

We already had event data from the old Laravel/MySQL setup, and I wanted to carry that over into the new PostgreSQL database. Instead of writing a throwaway migration script, I wanted to build something I could keep using during the transition. Until the new site fully launches, we’ll continue managing events on the old site. This import tool lets me sync those updates into the new system with a simple CSV export and upload.

Here’s what I set out to build:

- A secured endpoint for importing events - only authenticated admins should have access.

- Support for MySQL-style timestamps (`2009-10-09 20:00:00`) from legacy exports.

- Smart upsert (I like this word) behavior: if an event with the same `slug` and `startsAt` exists, update it; otherwise, create it.

- Native support for snake_case CSV fields to match the export format from Laravel.

- A clean, scalable implementation using `routing-controllers`, `multer`, and `date-fns`.

The end result is a single route - `POST /api/events/import` - that handles everything. Drop in a file, and the server parses it, transforms the data, and syncs it to the new system. Whether I’m importing 10 events or 300, the experience stays fast and reliable - exactly what I needed during this in-between phase.

---

## Wiring Up the Import Endpoint

Once I had the plan sketched out, the next step was turning it into a proper route.

### Authenticated Uploads with `routing-controllers`

The import lives in a dedicated `EventImportController`, which uses the `@JsonController` and `@Authorized` decorators from `routing-controllers`. This ensures only logged-in admins can access the route.

```ts
@JsonController("/events")
export class EventImportController {
  @Post("/import")
  @Authorized()
  async importCsv(@Req() req: Request, @Res() res: Response) {
    ...
  }
}
```

The `@Authorized()` decorator works hand-in-hand with the `authorizationChecker` I defined in `index.ts`, which verifies JWTs and attaches the admin to the request object.

### File Uploads with Multer

Since the frontend sends the CSV file as a `multipart/form-data` upload, I needed to use `multer` to handle parsing the upload.

Rather than using it globally, I configured `multer.memoryStorage()` inline inside the controller:

```ts
const upload = multer({ storage: multer.memoryStorage() });
```

Then I called `upload.single("file")` manually inside the route handler to keep it fully compatible with `routing-controllers`:

```ts
await new Promise<void>((resolve, reject) => {
  upload.single("file")(req as any, res as any, (err: any) => {
    if (err) reject(err);
    else resolve();
  });
});
```

This gave me access to the uploaded file directly in memory as a `Buffer`, perfect for passing into a streaming CSV parser.

### Parsing CSV with `csv-parser` and `date-fns`

To actually process the uploaded CSV, I piped the buffer into `csv-parser`, which handles parsing each row as a plain JS object:

```ts
const parser = Readable.from(file.buffer).pipe(csv());
```

Each row contains snake_case fields - like `starts_at`, `is_all_day`, etc. I used `date-fns` to convert MySQL-style datetime strings into JavaScript `Date` objects:

```ts
parse(row.starts_at, "yyyy-MM-dd HH:mm:ss", new Date());
```

Then I mapped the fields into the shape expected by my `Event` entity and either created or updated the event in PostgreSQL using TypeORM.

---

## Upserting Events Instead of Blindly Creating

One of the key things I wanted from this import process was **idempotence** - the ability to run the same CSV import multiple times without creating duplicate events. Since I’ll be running this periodically to keep the new PostgreSQL database in sync with the old Laravel/MySQL site until launch, that was non-negotiable.

The solution: **upsert logic** using TypeORM’s repository methods.

### Step 1 - Find the Matching Event

When processing each CSV row, I check if an event already exists in the database with the **same `slug`** and **exact `startsAt`** datetime.
Those two fields together act like a natural unique key for events.

```ts
const existing = await repo.findOneBy({
  slug: row.slug,
  startsAt: parse(row.starts_at, "yyyy-MM-dd HH:mm:ss", new Date()),
});
```

If a match is found, we know this is an update rather than a brand new event.

### Step 2 - Map the Incoming Data

Before saving, the row is mapped into a format that exactly matches the `Event` entity, including converting booleans stored as `"1"` or `"0"` in the CSV:

```ts
const eventData = {
  name: row.name,
  slug: row.slug,
  startsAt: parse(row.starts_at, "yyyy-MM-dd HH:mm:ss", new Date()),
  endsAt: parse(row.ends_at, "yyyy-MM-dd HH:mm:ss", new Date()),
  description: row.description || null,
  isFeatured: row.is_featured === "1",
  isHasEndsAt: row.is_has_ends_at === "1",
  isAllDay: row.is_all_day === "1",
  isActive: row.is_active === "1",
  hauntedBy: row.haunted_by || null,
};
```

This ensures the imported data is in the exact shape expected by TypeORM, with correct types for dates, booleans, and nullable fields.

### Step 3 - Merge or Create

If `existing` is true, we update it in place with TypeORM’s `merge`:

```ts
repo.merge(existing, eventData);
await repo.save(existing);
results.push(`Updated ${row.name} @ ${row.starts_at}`);
```

If not, we create a fresh event record:

```ts
const newEvent = repo.create(eventData);
await repo.save(newEvent);
results.push(`Created ${row.name} @ ${row.starts_at}`);
```

### Why This Matters

By doing it this way:

- The importer can be run over and over without generating duplicates.

- Old events can be updated if details change on the original site.

- It’s safe to keep syncing right up until launch day, knowing the database will always reflect the latest CSV data.

---

## Walking Through a Real CSV Import Example

Let’s say our old Laravel/MySQL site has the following event in its database:

**Pumpkin Festival** - October 9, 2009, 8:00 PM to 11:00 PM

When exporting this to CSV, the row might look something like this:

```csv
name,slug,starts_at,ends_at,description,is_featured,is_has_ends_at,is_all_day,is_active,haunted_by
Pumpkin Festival,pumpkin-festival,2009-10-09 20:00:00,2009-10-09 23:00:00,Annual fall celebration,1,1,0,1,
```

### Step 1 - Parsing the CSV Row

Using `csv-parser`, this comes into our importer as:

```js
{
  name: "Pumpkin Festival",
  slug: "pumpkin-festival",
  starts_at: "2009-10-09 20:00:00",
  ends_at: "2009-10-09 23:00:00",
  description: "Annual fall celebration",
  is_featured: "1",
  is_has_ends_at: "1",
  is_all_day: "0",
  is_active: "1",
  haunted_by: ""
}
```

### Step 2 - Transforming Into Entity Shape

We then transform the raw strings into the correct types for our `Event` entity:

```ts
const eventData = {
  name: "Pumpkin Festival",
  slug: "pumpkin-festival",
  startsAt: parse("2009-10-09 20:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
  endsAt: parse("2009-10-09 23:00:00", "yyyy-MM-dd HH:mm:ss", new Date()),
  description: "Annual fall celebration",
  isFeatured: true,
  isHasEndsAt: true,
  isAllDay: false,
  isActive: true,
  hauntedBy: null,
};
```

- The `parse` function from `date-fns` converts the MySQL-style datetime into a real JavaScript `Date` object.

- All `"1"`/`"0"` string values are converted to booleans.

- Empty strings are replaced with `null` for nullable fields.

### Step 3 - Upsert in PostgreSQL

Now the importer checks if an event already exists with this `slug` and `startsAt`.

- **If it exists:** we call `repo.merge()` to update the existing record with any changed fields (e.g., maybe the description was updated).

- **If it doesn’t exist:** we call `repo.create()` and save it as a new record.

For our example, if the event didn’t exist yet in PostgreSQL, the result would be:

```
Created Pumpkin Festival @ 2009-10-09 20:00:00
```

If we run the same import again without changing the CSV, it would say:

```
Updated Pumpkin Festival @ 2009-10-09 20:00:00
```

### Why This is Handy Before Launch

Because the importer uses this upsert logic, I can re-run it as many times as I want while the new site is in development. This keeps my PostgreSQL data perfectly in sync with the live Laravel/MySQL data, without duplicates, so when launch day comes there’s no frantic “data migration” scramble - it’s already ready.

---

## Wrapping Up Part 2

With this CSV importer in place, keeping the new PostgreSQL database synced with the existing Laravel/MySQL site has been painless. I can run the import as often as needed during development, knowing the upsert logic will handle both new and updated events without creating duplicates.

This means the API is always working with fresh, accurate event data - and when the new site goes live, there’s no last-minute migration panic.

[View the Four Green Fields Farm API on GitHub](https://github.com/mrcrandell/fourgreenfieldsfarm-api)
