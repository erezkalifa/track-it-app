const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Log startup information and paths
console.log("Starting server...");
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${PORT}`);
console.log(`Current directory: ${process.cwd()}`);
console.log(`__dirname: ${__dirname}`);

// Determine the dist directory path
const distPath = path.resolve(process.cwd(), "dist");
console.log(`Looking for dist at: ${distPath}`);

// Check if dist directory exists
const fs = require("fs");
if (!fs.existsSync(distPath)) {
  console.error(`Error: dist directory not found at ${distPath}`);
  console.log("Contents of current directory:");
  console.log(fs.readdirSync(process.cwd()));
  process.exit(1);
}

// Serve static files from the dist directory
app.use(express.static(distPath));

// Handle client-side routing by serving index.html for all routes
app.get("*", (req, res) => {
  const indexPath = path.join(distPath, "index.html");
  console.log(`Serving index.html from: ${indexPath}`);
  if (!fs.existsSync(indexPath)) {
    console.error(`Error: index.html not found at ${indexPath}`);
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
