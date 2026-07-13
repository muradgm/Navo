import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "@playwright/test";

const port = process.env.NAVO_SMOKE_PORT || "5177";
const baseUrl = `http://127.0.0.1:${port}`;
const appRoot = fileURLToPath(new URL("..", import.meta.url));
const viteBin = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));

function startServer() {
  const child = spawn(
    process.execPath,
    [viteBin, "--host", "127.0.0.1", "--port", port],
    {
      cwd: appRoot,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, BROWSER: "none" },
    },
  );

  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  return { child, getOutput: () => output };
}

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await delay(250);
  }
  throw new Error(`Timed out waiting for ${baseUrl}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const server = startServer();
let browser;

try {
  await waitForServer();

  browser = await chromium.launch();
  const page = await browser.newPage();
  const browserErrors = [];

  page.on("pageerror", (error) => {
    browserErrors.push(error.message);
  });
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.locator("#destination-select").waitFor();

  const defaultDestination = await page.locator("#destination-select").inputValue();
  assert(
    defaultDestination === "basel",
    `Expected Basel default destination, received ${defaultDestination}`,
  );
  const baselText = await page.locator("body").innerText();
  assert(baselText.includes("Basel"), "Expected Basel text in rendered app");
  assert(
    baselText.includes("Smart route order"),
    "Expected route-aware panel text in rendered app",
  );

  await page.locator("#destination-select").selectOption("barcelona");
  await page.waitForURL(/destination=barcelona/);
  const barcelonaText = await page.locator("body").innerText();
  assert(
    barcelonaText.includes("Barcelona"),
    "Expected Barcelona text in rendered app",
  );
  assert(
    barcelonaText.includes("Smart route order"),
    "Expected route-aware panel text after destination switch",
  );

  assert(browserErrors.length === 0, `Browser errors:\n${browserErrors.join("\n")}`);

  console.log("App smoke verification passed for Basel default and Barcelona switch.");
} finally {
  await browser?.close();
  server.child.kill();
  setTimeout(() => {
    if (!server.child.killed) server.child.kill("SIGKILL");
  }, 1_000).unref();
}
