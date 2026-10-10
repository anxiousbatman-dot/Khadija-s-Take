// Runs on Vercel every time the site is deployed (vercel.json tells it to).
// 1. Reads your Firebase values from Vercel's Environment Variables.
// 2. Copies the site into a folder called "public", which is what Vercel publishes.
// 3. Writes config.js inside that folder, holding the values.
// So the values never have to be written in any file you upload to GitHub.
const fs = require("fs");
const path = require("path");

const NAMES = {
  apiKey: "FIREBASE_API_KEY",
  authDomain: "FIREBASE_AUTH_DOMAIN",
  projectId: "FIREBASE_PROJECT_ID",
  appId: "FIREBASE_APP_ID"
};

const config = {};
const missing = [];
for (const [key, envName] of Object.entries(NAMES)) {
  config[key] = (process.env[envName] || "").trim();
  if (!config[key]) missing.push(envName);
}

const OUT = "public";
const SKIP = new Set([
  ".git", ".github", ".vercel", "node_modules", OUT,
  "build-config.js", "vercel.json", "firestore.rules", "config.js", "config.example.js"
]);

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);
for (const name of fs.readdirSync(".")) {
  if (SKIP.has(name) || name.startsWith(".env")) continue;
  fs.cpSync(name, path.join(OUT, name), { recursive: true });
}

if (missing.length) {
  console.warn("Missing in Vercel Environment Variables: " + missing.join(", "));
  console.warn("The site will still work, and comments will say 'coming soon'.");
  fs.writeFileSync(path.join(OUT, "config.js"), "export default null;\n");
} else {
  fs.writeFileSync(path.join(OUT, "config.js"), "export default " + JSON.stringify(config, null, 2) + ";\n");
  console.log("Firebase values found. config.js written.");
}
console.log("Site copied into ./" + OUT);
