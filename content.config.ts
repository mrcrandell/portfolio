import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      source: "blog/*.md",
      type: "page",
      // Define custom schema for docs collection
      schema: z.object({
        tags: z.array(z.string()).optional(),
        image: z.string().optional(),
        date: z.date(),
      }),
    }),
  },
});
