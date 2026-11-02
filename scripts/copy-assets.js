const fs = require("fs");
const path = require("path");

// `tsc` only emits .js/.d.ts/.map files, so any non-TypeScript asset that the
// runtime reads (email logo, static pages, ...) has to be copied manually.
// Equivalent of `cp -R src/mail dist/mail`, but cross-platform.
const ASSETS = ["mail"];

const root = path.join(__dirname, "..");

for (const dir of ASSETS) {
  const from = path.join(root, "src", dir);
  const to = path.join(root, "dist", dir);

  if (!fs.existsSync(from)) continue;

  fs.mkdirSync(to, { recursive: true });
  fs.cpSync(from, to, { recursive: true, force: true });
  console.log(`copied src/${dir} -> dist/${dir}`);
}
