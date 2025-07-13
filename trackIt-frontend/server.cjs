const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Log startup information
console.log("Starting server...");
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${PORT}`);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist")));

// Handle client-side routing by serving index.html for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
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
