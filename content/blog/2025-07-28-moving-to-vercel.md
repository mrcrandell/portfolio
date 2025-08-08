---
title: Why I Switched to Vercel (and Finally Launched My Updated Portfolio)
description: After years of managing a VPS, I migrated my Nuxt 3 site to Vercel for a faster, simpler, and more modern hosting experience-plus cleaner email templating and hybrid SSR.
image: /img/blog/2-post.jpg
category: Architecture and Hosting
tags:
  - Nuxt 3
  - Vercel
  - Serverless
  - SSR
  - Nitro
  - Static Hosting
  - Email Templates
  - Modern Frontend

date: 2025-07-28
published: true
---

For a long time, I ran most of my personal projects on a virtual private server (VPS). It gave me total control-SSH access, crontabs, the works. But over the years, especially as I started dialing back freelancing, that setup started to feel like bringing a toolbox to a dinner party. Way too much overhead for what I actually needed.

And with modern frameworks like Nuxt and the rise of tools like Vercel, Netlify, and Cloudflare Pages, I figured it was time to rethink my approach.

### A Quick Detour Through Cloudflare Workers

At first, Cloudflare Workers caught my eye. I liked the pricing model, and the idea of edge functions felt like the future. But after actually trying to build something real-specifically, a simple contact form using Nuxt 3 and server routes-I hit a wall.

A few things tripped me up:

- No access to the local file system (goodbye to reading email templates from disk)

- Compatibility issues with some NPM libraries (Mailgun, looking at you)

- Just enough friction with my typical tech stack to make me second-guess it

It wasn’t bad, but it just wasn’t what I needed.

So I pivoted.

### Landing on Vercel

After that, I gave Vercel a try. And, holy crap, within a couple hours, I had my portfolio site deployed, email routes working, and server-rendered pages behaving exactly how I expected.

### Getting Set Up on Vercel with Nuxt

Vercel turned out to be a much better fit. It has first-class support for Nuxt and provides a solid hybrid model: I can prerender most of my site for speed and SEO, while still keeping dynamic API routes for things like contact forms and events.

Once I pushed my repo to GitHub, I connected it to Vercel, let it auto-detect Nuxt 3, and it just… worked (mostly).

Here’s a quick breakdown of the changes and settings I needed:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset: "vercel",
    prerender: {
      crawlLinks: true,
      routes: ["/"],
    },
  },
  routeRules: {
    "/**": { static: true },
  },
});
```

One notable change I had to make: reading email templates.

In a VPS setup, I used `fs.readFileSync` to load email HTML files. That doesn’t work in serverless-there’s no disk to read from in the way Node expects. Instead, I moved the templates to `server/assets` and switched to:

```ts
const assets = useStorage("assets:server");
const template = await assets.getItem("emails/contact.html");
```

This pattern works perfectly with Vercel’s deployment model and integrates cleanly into Nuxt’s server API routes.

### Final Thoughts

This move to Vercel isn’t just about my own site: it’s about moving forward.

My goal is to eventually migrate all of my freelance projects away from that old VPS and onto more modern, maintainable platforms like this. That means giving my clients faster, more secure, and easier-to-update solutions. And for me? It means sharpening my own workflows and working with tools that reflect where the web is headed-not where it’s been.

If you’re in a similar spot, I’d definitely recommend giving Vercel (or a comparable platform) a serious look.

[View the project on GitHub](https://github.com/mrcrandell/portfolio)
