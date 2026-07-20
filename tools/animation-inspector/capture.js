// Reusable animation-inspection tool.
// Captures CSS/WAAPI animation timing (via Chrome DevTools Protocol's
// Animation domain) plus raw computed-style samples (rAF polling fallback,
// for imperative/rAF-driven motion the CDP Animation domain can't see)
// for a single interaction on any page.
//
// Usage:
//   node capture.js <url> --selector "<css selector>" [--action hover|click|focus] [--duration 1500] [--out out.json]
//
// Example:
//   node capture.js https://example.com/blog --selector "a.list-row" --action hover

const { chromium } = require("playwright");
const fs = require("fs");

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

async function main() {
  const args = parseArgs(process.argv);
  if (!args.url || !args.selector) {
    console.error(
      'Usage: node capture.js <url> --selector "<css selector>" [--action hover|click|focus] [--duration ms] [--out file.json]'
    );
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Animation.enable");

  const animationEvents = [];
  cdp.on("Animation.animationStarted", (evt) => animationEvents.push(evt));

  await page.goto(args.url, { waitUntil: "networkidle" });

  // Start a rAF sampler on the target element to catch imperative
  // (non-CSS, non-WAAPI) motion that the Animation domain won't report.
  await page.evaluate(
    ({ selector, duration }) => {
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
        if (performance.now() - start < duration) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    },
    { selector: args.selector, duration: args.duration }
  );

  const locator = page.locator(args.selector).first();
  if (args.action === "hover") await locator.hover();
  else if (args.action === "click") await locator.click();
  else if (args.action === "focus") await locator.focus();

  await page.waitForTimeout(args.duration + 100);

  const samples = await page.evaluate(() => window.__samples);
  await browser.close();

  const result = {
    url: args.url,
    selector: args.selector,
    action: args.action,
    cdpAnimations: animationEvents.map((e) => ({
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
    })),
    rafSampleCount: samples.length,
    rafSamples: samples,
  };

  if (args.out) {
    fs.writeFileSync(args.out, JSON.stringify(result, null, 2));
    console.log(`Wrote ${args.out}`);
  }

  console.log("\n=== CDP-reported CSS/WAAPI animations ===");
  if (result.cdpAnimations.length === 0) {
    console.log("(none — this interaction's motion is likely imperative/rAF-driven, see raw samples below)");
  } else {
    for (const a of result.cdpAnimations) {
      console.log(
        `- ${a.type} "${a.name || a.cssId || "unnamed"}": duration=${a.duration}ms delay=${a.delay}ms easing=${a.easing} iterations=${a.iterations}`
      );
    }
  }

  console.log(`\n=== Raw computed-style samples: ${samples.length} frames over ${args.duration}ms ===`);
  console.log("(first, middle, last frame shown; full data in --out file if provided)");
  const idxs = [0, Math.floor(samples.length / 2), samples.length - 1].filter(
    (i, pos, arr) => i >= 0 && arr.indexOf(i) === pos
  );
  for (const i of idxs) {
    if (samples[i]) console.log(`  t=${samples[i].t}ms`, samples[i]);
  }
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
