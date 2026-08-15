/**
 * Performance budget gate. Starts the production server, runs Lighthouse
 * (mobile emulation) against the landing page, and fails if scores fall
 * below the floor. Exists because mobile perf sat at 59 without anyone
 * noticing: desktop numbers were perfect the whole time.
 *
 * Floors are set with headroom below current reality (95 perf, 60ms TBT
 * at the time of writing) so the gate catches regressions, not CI noise.
 */
import { spawn, execSync } from "node:child_process";
import { readFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const PORT = 4321;
const URL = `http://localhost:${PORT}/`;
const FLOORS = {
  performance: 85,
  accessibility: 100,
  "best-practices": 100,
  seo: 100,
};
const TBT_CEILING_MS = 500;
const CLS_CEILING = 0.1;

const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  stdio: "ignore",
  detached: true,
});

const waitForServer = async () => {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(URL);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("server never came up");
};

let failed = false;
try {
  await waitForServer();
  const out = join(mkdtempSync(join(tmpdir(), "lh-")), "report.json");
  execSync(
    `npx --yes lighthouse@12 ${URL} --quiet --chrome-flags="--headless --no-sandbox" ` +
      `--output=json --output-path=${out} ` +
      `--only-categories=performance,accessibility,best-practices,seo`,
    { stdio: "inherit" },
  );
  const report = JSON.parse(readFileSync(out, "utf8"));

  for (const [cat, floor] of Object.entries(FLOORS)) {
    const score = Math.round(report.categories[cat].score * 100);
    const ok = score >= floor;
    console.log(`${ok ? "PASS" : "FAIL"} ${cat}: ${score} (floor ${floor})`);
    if (!ok) failed = true;
  }
  const tbt = report.audits["total-blocking-time"].numericValue;
  const cls = report.audits["cumulative-layout-shift"].numericValue;
  const tbtOk = tbt <= TBT_CEILING_MS;
  const clsOk = cls <= CLS_CEILING;
  console.log(
    `${tbtOk ? "PASS" : "FAIL"} TBT: ${Math.round(tbt)}ms (ceiling ${TBT_CEILING_MS}ms)`,
  );
  console.log(`${clsOk ? "PASS" : "FAIL"} CLS: ${cls} (ceiling ${CLS_CEILING})`);
  if (!tbtOk || !clsOk) failed = true;
} finally {
  // next start spawns a renamed next-server child; kill the whole group.
  try {
    process.kill(-server.pid, "SIGKILL");
  } catch {
    /* already gone */
  }
}

process.exit(failed ? 1 : 0);
