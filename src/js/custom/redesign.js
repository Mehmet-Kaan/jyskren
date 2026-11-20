/* Keep the title stable while the existing carousel cycles its photographs. */
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.Slider4rev3');
  if (hero && window.jQuery) {
    const $hero = window.jQuery(hero);
    $hero.carousel('pause');
    // Preserve swipe navigation; automatic slide changes make reading harder.
    $hero.carousel({ interval: false });
  }
  // The existing service tiles use an empty overlay link. Name it from its own text.
  document.querySelectorAll('.entry__grid-item').forEach(item => {
    const link = item.querySelector('.box__content-link a');
    const title = item.querySelector('.title');
    if (link && title) link.setAttribute('aria-label', title.textContent.trim());
  });
});

// Progressive enhancement: the page remains fully visible without animation.
window.addEventListener('load', () => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({isIntersecting, target}) => {
      if (!isIntersecting) return;
      target.animate([{opacity:.75,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,easing:'cubic-bezier(.2,.65,.3,1)'});
      observer.unobserve(target);
    });
  }, {threshold:.12});
  document.querySelectorAll('main h2, .entry__grid-item .box__visual, .contact-title').forEach(e => observer.observe(e));
}, {once:true});
