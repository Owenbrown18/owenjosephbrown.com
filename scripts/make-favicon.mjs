// Renders src/app/icon.svg to a 32px PNG with headless Chromium and wraps
// it in an ICO container (modern ICO = PNG payload). Run once:
//   node scripts/make-favicon.mjs
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";

const svg = readFileSync("src/app/icon.svg", "utf8");
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 32, height: 32 },
  deviceScaleFactor: 1,
});
await page.setContent(
  `<style>*{margin:0}svg{display:block;width:32px;height:32px}</style>${svg}`,
);
const png = await page.screenshot({
  clip: { x: 0, y: 0, width: 32, height: 32 },
  omitBackground: true,
});
await browser.close();

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image

const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0); // width
entry.writeUInt8(32, 1); // height
entry.writeUInt8(0, 2); // palette
entry.writeUInt8(0, 3); // reserved
entry.writeUInt16LE(1, 4); // planes
entry.writeUInt16LE(32, 6); // bpp
entry.writeUInt32LE(png.length, 8); // payload size
entry.writeUInt32LE(22, 12); // payload offset

writeFileSync("src/app/favicon.ico", Buffer.concat([header, entry, png]));
console.log(`favicon.ico written (${png.length + 22} bytes)`);
