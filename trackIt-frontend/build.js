import esbuild from "esbuild";
import fs from "fs";
import path from "path";

// Create dist directory if it doesn't exist
if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist", { recursive: true });
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
    external: [
      "react",
      "react-dom",
      "react-router-dom",
      "styled-components",
      "axios",
      "formik",
      "yup",
      "@mui/material",
      "@mui/icons-material",
      "@emotion/react",
      "@emotion/styled",
      "react-icons",
    ],
    loader: {
      ".tsx": "tsx",
      ".ts": "ts",
      ".jsx": "jsx",
      ".js": "js",
    },
  })
  .catch(() => process.exit(1));
