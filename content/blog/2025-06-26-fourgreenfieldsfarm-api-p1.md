---
title: New API for Four Green Fields Farm — Part 1
description: How I used TypeORM and routing-controllers to modernize a farm website backend with clean architecture, recurring event logic, and CSV importing.
cover: /images/four-green-fields-api.jpg
category: Backend
tags:
  - TypeScript
  - TypeORM
  - Express
  - routing-controllers
  - CSV Import
  - Backend Architecture
  - Nuxt Integration

date: 2025-06-26
published: true
---

My team at work recently adopted **TypeORM** and **routing-controllers**, and I was immediately drawn to how clean, declarative, and organized the structure felt. It inspired me to revisit a personal project I’d been meaning to overhaul: the website for **Four Green Fields Farm**.

What started as a simple refresh turned into a full rebuild of the backend — with modern tools, cleaner logic, and room to grow.

Let’s walk through how I approached this new API, step by step.

---

## Getting Started

To start fresh, I created a new directory and initialized the project with TypeScript:

```bash
mkdir fourgreenfieldsfarm-api
cd fourgreenfieldsfarm-api
npm init -y
```

### 1. Install Dependencies

Next, I installed the core packages I knew I’d need — Express, TypeORM, routing-controllers, and a few others to support validation, file uploads, environment variables, and PostgreSQL:

```bash
npm install express typeorm pg routing-controllers class-validator class-transformer dotenv reflect-metadata multer csv-parser rrule jsonwebtoken argon2 cors
```

And the development dependencies:

```bash
npm install -D typescript ts-node-dev @types/node @types/express @types/jsonwebtoken @types/multer @types/cors
```

### 2. Add TypeScript Config

I added a basic `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "resolveJsonModule": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

> The key settings for TypeORM and routing-controllers are `emitDecoratorMetadata` and `experimentalDecorators`.

### 3. Create the Folder Structure

I set up the following structure:

```
/src
  /controllers
  /entity
  /middleware
  /routes
  index.ts
  data-source.ts
/scripts
  importEventsFromCsv.ts
```

This keeps everything modular and organized as the app grows.

### 4. Environment Variables

I added a `.env` file for local development:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=youruser
DB_PASS=yourpassword
DB_NAME=fourgreenfieldsfarm
JWT_SECRET=yourjwtsecret
FRONTEND_ORIGIN=http://localhost:3001
NODE_ENV=development
```

You can load these with `dotenv` at the top of `index.ts`:

```ts
import * as dotenv from "dotenv";
dotenv.config();
```
