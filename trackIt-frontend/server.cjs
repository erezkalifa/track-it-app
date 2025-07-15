const express = require("express");
const path = require("path");

const app = express();
const distPath = path.join(__dirname, "dist");
const port = process.env.PORT || 3000;

console.log("Environment:", process.env.NODE_ENV || "production");
console.log("Port:", port);
console.log("Current directory:", process.cwd());
console.log("__dirname:", __dirname);
console.log("Checking for dist at:", distPath);

if (!require("fs").existsSync(distPath)) {
  console.error("Dist directory not found!");
  process.exit(1);
}

// 1. Serve static files first
app.use(express.static(distPath));

// 2. Fallback: serve index.html for any other route (SPA)
app.get("*", (req, res) => {
  const indexPath = path.join(distPath, "index.html");
  console.log("Attempting to serve index.html from:", indexPath);
  res.sendFile(indexPath);
});

app.listen(port, () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});
