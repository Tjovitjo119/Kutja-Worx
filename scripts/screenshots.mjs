/**
 * Captures every public page and the main admin screens at mobile (375px) and desktop (1440px).
 *   1. npm run dev          (demo mode is fine: the demo login is pre-filled in dev)
 *   2. npm run screenshots
 * Uses puppeteer-core with an installed Edge/Chrome. Set CHROME_PATH to override.
 * Output: docs/screenshots/<name>-<mobile|desktop>.png
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = path.resolve("docs/screenshots");
const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);
const executablePath = candidates.find((p) => fs.existsSync(p));
if (!executablePath) throw new Error("No Chrome/Edge found. Set CHROME_PATH.");

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};

const publicPages = [
  ["home", "/"],
  ["services", "/services"],
  ["price-list-tab", "/services?tab=price"],
  ["cars", "/cars"],
  ["car-detail", "/cars/bmw-e30-325i"],
  ["parts", "/parts"],
  ["price-list", "/price-list"],
  ["gallery", "/gallery"],
  ["about", "/about"],
  ["contact", "/contact"],
];
const adminPages = [
  ["admin-dashboard", "/admin"],
  ["admin-vehicles", "/admin/vehicles"],
  ["admin-vehicle-edit", "/admin/vehicles/vehicle-bmw-e30-325i"],
  ["admin-services", "/admin/services"],
  ["admin-inquiries", "/admin/inquiries"],
  ["admin-reception", "/admin/reception"],
  ["admin-users", "/admin/users"],
];

async function settle(page) {
  // Scroll through the page so scroll-triggered animations and lazy images run, then return to top.
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto"; // smooth scrolling would leave the page mid-scroll at capture time
    const step = Math.max(300, innerHeight * 0.7);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
  await page
    .evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? 1 : new Promise((r) => (i.onload = i.onerror = r))))))
    .catch(() => {});
}

// A throwaway profile stops Edge/Chrome from handing off to an already-running browser instance.
const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "kutja-shots-"));
const browser = await puppeteer.launch({ executablePath, headless: true, userDataDir, args: ["--no-sandbox", "--disable-gpu"] });
fs.mkdirSync(OUT, { recursive: true });

for (const [vpName, vp] of Object.entries(viewports)) {
  // Separate context per viewport so each run starts logged out.
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport(vp);

  const shot = async (name, url) => {
    const res = await page.goto(BASE + url, { waitUntil: "networkidle2", timeout: 120000 });
    await page.waitForFunction(() => !document.body.innerText.includes("Loading…"), { timeout: 20000 }).catch(() => {});
    await settle(page);
    await page.screenshot({ path: path.join(OUT, `${name}-${vpName}.png`), fullPage: true });
    console.log(`${res?.status()} ${vpName} ${url}`);
  };

  if (!process.env.SKIP_PUBLIC) for (const [name, url] of publicPages) await shot(name, url);

  // Admin: login screen, then sign in with the dev demo login (or ADMIN_EMAIL / ADMIN_PASSWORD).
  await shot("admin-login", "/admin/login");
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    await page.$eval("#email", (el) => (el.value = ""));
    await page.type("#email", email);
    await page.$eval("#password", (el) => (el.value = ""));
    await page.type("#password", password);
  }
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle2", timeout: 120000 }), page.click("form button:not([type=button])")]);
  for (const [name, url] of adminPages) await shot(name, url);
  await context.close();
}
await browser.close();
console.log(`Screenshots saved to ${OUT}`);
