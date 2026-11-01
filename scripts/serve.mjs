import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PORT = Number(process.env.PORT) || 8080;

const TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".mp3", "audio/mpeg"],
  [".wav", "audio/wav"],
  [".ico", "image/x-icon"],
  [".txt", "text/plain; charset=utf-8"]
]);

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }

  let pathname = "/";
  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host || "localhost"}`).pathname);
  } catch {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  let target = path.resolve(ROOT, `.${pathname}`);
  if (target !== ROOT && !target.startsWith(`${ROOT}${path.sep}`)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const info = await stat(target);
    if (info.isDirectory()) target = path.join(target, "index.html");
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  try {
    const data = await readFile(target);
    const type = TYPES.get(path.extname(target).toLowerCase()) || "application/octet-stream";
    response.writeHead(200, {
      "Content-Type": type,
      "Content-Length": data.length,
      "Cache-Control": "no-store"
    });
    if (request.method === "HEAD") {
      response.end();
    } else {
      response.end(data);
    }
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`Small Steps English dev server: http://localhost:${PORT}/`);
  console.log("Press Ctrl+C to stop.");
});
