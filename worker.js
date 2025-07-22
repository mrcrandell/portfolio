import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import * as nitroWorker from "./.output/server/index.mjs";

addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.endsWith(".html")) {
    // Serve static file directly without redirect
    event.respondWith(handleStatic(event));
  } else {
    // Forward to Nitro Worker for SSR/API handling
    event.respondWith(nitroWorker.fetch(event.request, env, ctx));
  }
});

async function handleStatic(event) {
  try {
    return await getAssetFromKV(event);
  } catch (e) {
    return new Response("Not found", { status: 404 });
  }
}
