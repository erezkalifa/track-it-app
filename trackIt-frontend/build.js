import esbuild from "esbuild";
import fs from "fs";
import path from "path";

console.log("Starting esbuild build process...");

// Create dist directory if it doesn't exist
if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist", { recursive: true });
  console.log("Created dist directory");
}

// Copy HTML file to dist
if (fs.existsSync("index.html")) {
  fs.copyFileSync("index.html", "dist/index.html");
} else {
  console.error("index.html not found in current directory");
  process.exit(1);
}

// Build with esbuild
esbuild
  .build({
    entryPoints: ["src/main.tsx"],
    bundle: true,
    outdir: "dist",
    format: "esm",
    minify: true,
    sourcemap: true,
    target: "es2020",
    loader: {
      ".tsx": "tsx",
      ".ts": "ts",
      ".jsx": "jsx",
      ".js": "js",
    },
    define: {
      "process.env.VITE_API_URL": JSON.stringify(
        process.env.VITE_API_URL || ""
      ),
      "process.env.VITE_ENV": JSON.stringify(process.env.VITE_ENV || ""),
    },
  })
  .then(() => {
    console.log("Build completed successfully!");
  })
  .catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
  });
