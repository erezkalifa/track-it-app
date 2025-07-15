const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Log startup information and paths
console.log("Starting server...");
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${PORT}`);
console.log(`Current directory: ${process.cwd()}`);
console.log(`__dirname: ${__dirname}`);

// Try different possible dist locations
const possibleDistPaths = [
  path.join(process.cwd(), "dist"),
  path.join(__dirname, "dist"),
  path.join(process.cwd(), "../dist"),
  path.join(__dirname, "../dist"),
  "/app/dist",
];

let distPath;
for (const path of possibleDistPaths) {
  console.log(`Checking for dist at: ${path}`);
  if (fs.existsSync(path)) {
    distPath = path;
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

// Configure MIME types for modern JavaScript
app.use((req, res, next) => {
  if (req.url.endsWith(".js")) {
    res.setHeader("Content-Type", "application/javascript");
  } else if (req.url.endsWith(".mjs")) {
    res.setHeader("Content-Type", "application/javascript");
  } else if (req.url.endsWith(".css")) {
    res.setHeader("Content-Type", "text/css");
  }
  next();
});

// Serve static files from the dist directory
app.use(
  express.static(distPath, {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      } else if (path.endsWith(".mjs")) {
        res.setHeader("Content-Type", "application/javascript");
      } else if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
    },
  })
);

// Handle client-side routing by serving index.html for all routes
app.get("*", (req, res) => {
  const indexPath = path.join(distPath, "index.html");
  console.log(`Attempting to serve index.html from: ${indexPath}`);

  if (!fs.existsSync(indexPath)) {
    console.error(`Error: index.html not found at ${indexPath}`);
    console.log("Contents of dist directory:");
    console.log(fs.readdirSync(distPath));
    return res.status(404).send("index.html not found");
  }

  res.sendFile(indexPath);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).send("Internal Server Error");
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});
