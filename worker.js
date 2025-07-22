import * as nitroWorker from "./.output/server/index.mjs";

addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Attempt to serve .html directly first
  if (url.pathname.endsWith(".html")) {
    event.respondWith(handleHtmlRequest(event.request));
  } else {
    // Fallback to Nitro SSR for everything else
    event.respondWith(nitroWorker.fetch(event.request, event));
  }
});

async function handleHtmlRequest(request) {
  try {
    // Attempt to fetch the static file directly
    const response = await fetch(request);

    // If the file exists (status 200), serve it directly
    if (response.status === 200) {
      return response;
    }

    // If the file does not exist, fallback to SSR
    return await nitroWorker.fetch(request);
  } catch (error) {
    // On any error, fallback to SSR
    return await nitroWorker.fetch(request);
  }
}
