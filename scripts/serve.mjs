// Server pengembangan lokal untuk ES modules; Netlify menyajikan file statis secara langsung.
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
// MIME type memastikan browser membaca JavaScript dan CSS dengan benar.
const root = process.cwd(),
  types = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
  };
// Resolusi path dibatasi ke folder project untuk menolak akses keluar direktori.
http
  .createServer(async (req, res) => {
    try {
      const name = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      const file = path.resolve(
        root,
        "." + (name === "/" ? "/index.html" : name),
      );
      if (!file.startsWith(root + path.sep)) {
        res.writeHead(403);
        return res.end();
      }
      const data = await readFile(file);
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
      });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(4173, "127.0.0.1", () => console.log("Open http://localhost:4173"));
