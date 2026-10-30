(() => {
  const root = document.querySelector('.video-reviews');
  if (!root) return;
  const track = root.querySelector('.video-reviews-grid');
  const cards = [...track.children];
  const viewport = document.createElement('div');
  viewport.className = 'video-reviews-viewport';
  viewport.tabIndex = 0;
  viewport.setAttribute('role', 'region');
  viewport.setAttribute('aria-label', 'รีวิว: ปัดเพื่ออ่าน');
  track.before(viewport); viewport.append(track);
  cards.forEach(card => { const copy = card.cloneNode(true); copy.setAttribute('aria-hidden', 'true'); copy.inert = true; track.append(copy); });
  root.classList.add('is-ribbon');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let hover = false, touching = false, last = 0, distance = 0, offset = 0;
  function measure() { distance = track.children[cards.length].offsetLeft - track.children[0].offsetLeft; offset = viewport.scrollLeft % distance; }
  new ResizeObserver(measure).observe(viewport);
  root.addEventListener('mouseenter', () => { hover = true; });
  root.addEventListener('mouseleave', () => { hover = false; });
  viewport.addEventListener('touchstart', () => { touching = true; }, {passive:true});
  viewport.addEventListener('touchend', () => { touching = false; offset = viewport.scrollLeft; }, {passive:true});
  viewport.addEventListener('touchcancel', () => { touching = false; }, {passive:true});
  function frame(now) {
    const elapsed = Math.min(now - last, 50); last = now;
    const stopped = reduced.matches || hover || touching || document.hidden || root.contains(document.activeElement);
    if (!stopped && distance > 0) { offset = (offset + elapsed * .022) % distance; viewport.scrollLeft = offset; }
    else offset = viewport.scrollLeft;
    requestAnimationFrame(frame);
  }
  measure(); requestAnimationFrame(frame);
})();
