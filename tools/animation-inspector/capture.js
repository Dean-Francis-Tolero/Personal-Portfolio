const { chromium } = require("playwright");
const fs = require("fs");

const USAGE =
  'Usage: node capture.js <url> --selector "<css selector>" [--action hover|click|focus] [--duration ms] [--out file.json]';

function parseArgs(argv) {
  const args = { action: "hover", duration: 1500, out: null };
  args.url = argv[2];
  for (let i = 3; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--selector") args.selector = argv[++i];
    else if (a === "--action") args.action = argv[++i];
    else if (a === "--duration") args.duration = Number(argv[++i]);
    else if (a === "--out") args.out = argv[++i];
  }
  return args;
}

async function captureCdpAnimations(page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Animation.enable");
  const events = [];
  cdp.on("Animation.animationStarted", (evt) => events.push(evt));
  return () =>
    events.map((e) => ({
      type: e.animation.type,
      name: e.animation.name,
      cssId: e.animation.cssId,
      duration: e.animation.source?.duration,
      delay: e.animation.source?.delay,
      easing: e.animation.source?.easing,
      iterations: e.animation.source?.iterations,
      direction: e.animation.source?.direction,
      fill: e.animation.source?.fill,
      keyframesRule: e.animation.source?.keyframesRule,
    }));
}

async function sampleComputedStyleOverTime(page, selector, durationMs) {
  await page.evaluate(
    ({ selector, durationMs }) => {
      window.__samples = [];
      const el = document.querySelector(selector);
      if (!el) return;
      const start = performance.now();
      function tick() {
        const cs = getComputedStyle(el);
        window.__samples.push({
          t: Math.round(performance.now() - start),
          transform: cs.transform,
          opacity: cs.opacity,
          backgroundColor: cs.backgroundColor,
          color: cs.color,
          filter: cs.filter,
        });
        if (performance.now() - start < durationMs) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    },
    { selector, durationMs }
  );
  return () => page.evaluate(() => window.__samples);
}

async function triggerInteraction(page, selector, action) {
  const locator = page.locator(selector).first();
  if (action === "hover") await locator.hover();
  else if (action === "click") await locator.click();
  else if (action === "focus") await locator.focus();
}

function summarize({ cdpAnimations, rafSamples, duration }) {
  console.log("\n=== CDP-reported CSS/WAAPI animations ===");
  if (cdpAnimations.length === 0) {
    console.log("(none — check the raw samples below for rAF/imperative-driven motion instead)");
  } else {
    for (const a of cdpAnimations) {
      console.log(
        `- ${a.type} "${a.name || a.cssId || "unnamed"}": duration=${a.duration}ms delay=${a.delay}ms easing=${a.easing} iterations=${a.iterations}`
      );
    }
  }

  console.log(`\n=== Raw computed-style samples: ${rafSamples.length} frames over ${duration}ms ===`);
  console.log("(first, middle, last frame shown; full data in --out file if provided)");
  const indices = [0, Math.floor(rafSamples.length / 2), rafSamples.length - 1].filter(
    (i, pos, arr) => i >= 0 && arr.indexOf(i) === pos
  );
  for (const i of indices) {
    if (rafSamples[i]) console.log(`  t=${rafSamples[i].t}ms`, rafSamples[i]);
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.url || !args.selector) {
    console.error(USAGE);
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const getCdpAnimations = await captureCdpAnimations(page);
  await page.goto(args.url, { waitUntil: "networkidle" });
  const getRafSamples = await sampleComputedStyleOverTime(page, args.selector, args.duration);

  await triggerInteraction(page, args.selector, args.action);
  await page.waitForTimeout(args.duration + 100);

  const cdpAnimations = getCdpAnimations();
  const rafSamples = await getRafSamples();
  await browser.close();

  const result = { url: args.url, selector: args.selector, action: args.action, cdpAnimations, rafSamples };

  if (args.out) {
    fs.writeFileSync(args.out, JSON.stringify(result, null, 2));
    console.log(`Wrote ${args.out}`);
  }

  summarize({ cdpAnimations, rafSamples, duration: args.duration });
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
