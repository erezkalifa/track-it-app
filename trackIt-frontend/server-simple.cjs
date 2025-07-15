const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = process.env.PORT || 3000;

// MIME types
const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".woff": "application/font-woff",
  ".ttf": "application/font-ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "application/font-otf",
  ".wasm": "application/wasm",
};

// Try different possible dist locations
const possibleDistPaths = [
  path.join(process.cwd(), "dist"),
  path.join(__dirname, "dist"),
  path.join(process.cwd(), "../dist"),
  path.join(__dirname, "../dist"),
  "/app/dist",
];

let distPath;
for (const dist of possibleDistPaths) {
  console.log(`Checking for dist at: ${dist}`);
  if (fs.existsSync(dist)) {
    distPath = dist;
    console.log(`Found dist directory at: ${distPath}`);
    break;
  }
}

if (!distPath) {
  console.error("Error: Could not find dist directory. Checked paths:");
  possibleDistPaths.forEach((p) => console.log(` - ${p}`));
  console.log("\nCurrent directory contents:");
  console.log(fs.readdirSync(process.cwd()));
  process.exit(1);
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Parse URL
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;

  // Default to index.html for root
  if (pathname === "/") {
    pathname = "/index.html";
  }

  // Get file path
  const filePath = path.join(distPath, pathname);

  // Get file extension
  const extname = path.extname(filePath).toLowerCase();

  // Set content type
  const contentType = mimeTypes[extname] || "application/octet-stream";

  // Read file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // If file not found, serve index.html for SPA routing
      if (err.code === "ENOENT") {
        const indexPath = path.join(distPath, "index.html");
        fs.readFile(indexPath, (err2, content2) => {
          if (err2) {
            res.writeHead(404);
            res.end("File not found");
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(content2, "utf-8");
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});
