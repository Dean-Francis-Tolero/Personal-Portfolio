// A small requestAnimationFrame-driven tween for `scrollLeft`. Chrome (at
// least under automation, and CSS scroll-snap containers are known to be
// inconsistent about this cross-browser) can silently no-op a `scrollTo`/
// `scrollBy` call with a `behavior` option, or a plain `scrollLeft`
// assignment under `scroll-behavior: smooth` — confirmed directly against
// project_photo_carousel.tsx's track, which never moved at all through
// either path. Driving `element.scrollLeft` by hand every frame sidesteps
// all of that, matching project_problem.tsx's existing precedent of
// computing scroll-driven values manually rather than trusting a browser
// scroll-animation API.
export function animateScrollLeft(el: HTMLElement, target: number, duration = 450) {
  if (duration <= 0) {
    el.scrollLeft = target;
    return;
  }

  const start = el.scrollLeft;
  if (target === start) return;

  const startTime = performance.now();
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  let rafId = 0;
  let timeoutId = 0;
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;
    el.scrollLeft = target;
    cancelAnimationFrame(rafId);
    window.clearTimeout(timeoutId);
  };

  const step = (now: number) => {
    const progress = Math.min(1, (now - startTime) / duration);
    el.scrollLeft = start + (target - start) * easeOutCubic(progress);
    if (progress < 1) rafId = requestAnimationFrame(step);
    else finish();
  };
  rafId = requestAnimationFrame(step);

  // Safety net: requestAnimationFrame is fully suspended while a tab is
  // backgrounded (`document.visibilityState !== "visible"`) — verified
  // directly against this exact track, where an rAF-driven tween's
  // callback never fired at all in that state. A momentarily-backgrounded
  // tab (alt-tab mid-scroll, or an automated/off-screen browser context)
  // would otherwise leave the carousel stuck mid-jump indefinitely; this
  // guarantees the jump still lands on `target`, just without the glide.
  timeoutId = window.setTimeout(finish, duration + 50);
}
