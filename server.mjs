import http from "node:http";
import { access, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, "site");
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".cur": "image/x-icon",
};

async function isRegularFile(filePath) {
  try {
    const info = await stat(filePath);
    return info.isFile();
  } catch {
    return false;
  }
}

async function resolveSafePath(relPath) {
  const cleaned = relPath.replace(/^\/+/, "");
  const full = path.resolve(SITE_ROOT, cleaned);
  if (full !== SITE_ROOT && !full.startsWith(SITE_ROOT + path.sep)) {
    return null;
  }
  return full;
}

async function resolveTargetFile(rawPathname) {
  const candidates = [];
  let decoded = rawPathname;
  try {
    decoded = decodeURIComponent(rawPathname);
  } catch {
    // Keep rawPathname if percent-encoding is malformed.
  }

  for (const variant of new Set([decoded, rawPathname])) {
    const trimmed = variant.replace(/^\/+|\/+$/g, "");
    if (!trimmed) {
      candidates.push("index.html");
      continue;
    }
    candidates.push(trimmed);
    candidates.push(path.join(trimmed, "index.html"));
    if (trimmed !== trimmed.toLowerCase()) {
      candidates.push(path.join(trimmed.toLowerCase(), "index.html"));
    }
  }

  for (const rel of candidates) {
    const full = await resolveSafePath(rel);
    if (full && (await isRegularFile(full))) {
      return full;
    }
  }

  // Fallback case-insensitive directory check at root level for Drupal route aliases.
  const firstSegment = decoded.replace(/^\/+|\/+$/g, "");
  if (firstSegment && !firstSegment.includes("/")) {
    try {
      const entries = await readdir(SITE_ROOT, { withFileTypes: true });
      const match = entries.find(
        (entry) =>
          entry.isDirectory() &&
          entry.name.toLowerCase() === firstSegment.toLowerCase(),
      );
      if (match) {
        const indexPath = path.join(SITE_ROOT, match.name, "index.html");
        if (await isRegularFile(indexPath)) {
          return indexPath;
        }
      }
    } catch {
      // Ignore directory read errors.
    }
  }

  return null;
}

const server = http.createServer(async (req, res) => {
  const method = req.method || "GET";
  if (method !== "GET" && method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method Not Allowed");
    return;
  }

  let pathname = "/";
  try {
    pathname = new URL(req.url || "/", `http://${HOST}:${PORT}`).pathname;
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Bad Request");
    return;
  }

  const filePath = await resolveTargetFile(pathname);
  if (!filePath) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`Not Found: ${pathname}`);
    return;
  }

  try {
    await access(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const body = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": body.length,
      "Cache-Control": "no-cache",
    });
    if (method === "HEAD") {
      res.end();
    } else {
      res.end(body);
    }
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`Internal Server Error: ${err.message}`);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Hacisren local server running at http://${HOST}:${PORT}/`);
});
