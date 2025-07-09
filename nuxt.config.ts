// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-08",
  modules: [
    // ...
    "@pinia/nuxt",
    "nuxt-proxy",
    [
      "@nuxtjs/eslint-module",
      {
        fix: true,
      },
    ],
    "nuxt-gtag",
    "@nuxt/content",
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/_functions.scss" as *;
            @use "@/assets/scss/_variables.scss" as *;
            @use "@/assets/scss/_mixins.scss" as *;
          `,
        },
      },
    },
  },
  ssr: true, // SSR enabled (still needed for flexibility)
  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
    prerender: {
      autoSubfolderIndex: false,
      crawlLinks: true,
      routes: ["/"],
    },
  },
  /* nitro: {
    preset: "static", // optional, Nuxt automatically infers static
  }, */
  routeRules: {
    "/**": { static: true },
  },
  devtools: { enabled: true },
  telemetry: false,
  runtimeConfig: {
    invisibleRecaptchaSecretkey: process.env.INVISIBLE_RECAPTCHA_SECRETKEY,
    mailgunDomain: process.env.MAILGUN_DOMAIN,
    mailgunApi: process.env.MAILGUN_API,
    public: {
      invisibleRecaptchaSiteKey: process.env.INVISIBLE_RECAPTCHA_SITEKEY,
    },
  },
  gtag: {
    id: process.env.GOOGLE_ANALYTICS_ID,
  },
  content: {
    build: {
      markdown: {
        highlight: {
          // Theme used in all color schemes.
          theme: "material-theme-ocean",
        },
      },
    },
  },
});
