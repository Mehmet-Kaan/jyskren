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

// Build the mobile drawer from the existing navigation so links stay in sync.
function setupMobileNavigation() {
  const header = document.querySelector('.Menu2rev2');
  const trigger = header?.querySelector('.primary__navbar-action-toggle');
  const source = header?.querySelector('.menu__list--1');
  const logo = header?.querySelector('.primary__logo');
  if (!trigger || !source || !logo || !window.HTMLDialogElement?.prototype.showModal) return;

  const mobile = matchMedia('(max-width: 1199.98px)');
  const dialog = document.createElement('dialog');
  dialog.id = 'mobile-navigation';
  dialog.className = 'mobile-nav';
  dialog.setAttribute('aria-label', 'Hovedmenu');
  dialog.innerHTML = `
    <div class="mobile-nav__panel">
      <div class="mobile-nav__header">
        <button class="mobile-nav__close" type="button" aria-label="Luk menu" autofocus></button>
      </div>
      <div class="mobile-nav__scroll">
        <nav aria-label="Hovednavigation"><ul class="mobile-nav__links"></ul></nav>
        <div class="mobile-nav__contact"></div>
      </div>
    </div>`;
  const close = dialog.querySelector('.mobile-nav__close');
  const mobileLogo = logo.cloneNode(true);
  mobileLogo.className = 'mobile-nav__logo';
  close.before(mobileLogo);

  const list = dialog.querySelector('.mobile-nav__links');
  const contact = dialog.querySelector('.mobile-nav__contact');
  const disclosures = [];
  const normalizePath = path => path.replace(/\/+$/, '');

  function copyLink(original) {
    const link = document.createElement('a');
    link.href = original.href;
    link.textContent = original.textContent.trim();
    if (link.origin === location.origin && normalizePath(link.pathname) === normalizePath(location.pathname)) {
      link.setAttribute('aria-current', 'page');
    }
    return link;
  }

  for (const [index, item] of Array.from(source.children).entries()) {
    const original = item.querySelector(':scope > .menu__link');
    if (!original) continue;
    const children = item.querySelectorAll('.menu__list--2 .menu__link[href]');
    const row = document.createElement('li');
    const label = original.textContent.trim();
    const link = original.matches('a[href]') ? copyLink(original) : null;

    if (!children.length) {
      if (!link) continue;
      if (link.protocol === 'tel:') {
        link.className = 'mobile-nav__phone';
        const icon = original.querySelector('i, svg')?.cloneNode(true);
        if (icon) link.prepend(icon);
        contact.append(link);
      } else if (index === source.children.length - 1) {
        link.className = 'mobile-nav__cta';
        contact.append(link);
      } else {
        row.append(link);
        list.append(row);
      }
      continue;
    }

    const group = document.createElement('div');
    group.className = 'mobile-nav__group';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'mobile-nav__toggle';
    if (link) {
      group.append(link);
      toggle.setAttribute('aria-label', label);
    } else {
      toggle.textContent = label;
    }
    group.append(toggle);

    const submenu = document.createElement('ul');
    submenu.className = 'mobile-nav__submenu';
    submenu.id = `mobile-nav-section-${index}`;
    toggle.setAttribute('aria-controls', submenu.id);
    for (const originalChild of children) {
      const child = document.createElement('li');
      child.append(copyLink(originalChild));
      submenu.append(child);
    }
    const setExpanded = expanded => {
      toggle.setAttribute('aria-expanded', String(expanded));
      submenu.hidden = !expanded;
    };
    setExpanded(!!submenu.querySelector('[aria-current="page"]'));
    toggle.addEventListener('click', () => {
      const shouldOpen = submenu.hidden;
      disclosures.forEach(update => update(false));
      setExpanded(shouldOpen);
    });
    disclosures.push(setExpanded);
    row.append(group, submenu);
    list.append(row);
  }

  document.body.append(dialog);
  header.classList.add('has-mobile-nav');
  trigger.classList.add('mobile-nav-trigger');
  trigger.setAttribute('aria-label', 'Åbn menu');
  trigger.setAttribute('aria-controls', dialog.id);
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-haspopup', 'dialog');

  trigger.addEventListener('click', event => {
    if (!mobile.matches || dialog.open) return;
    event.stopImmediatePropagation();
    dialog.showModal();
    trigger.setAttribute('aria-expanded', 'true');
  }, true);
  async function closeDrawer() {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    dialog.classList.add('is-closing');
    const exit = dialog.getAnimations().find(animation => animation.animationName === 'mobile-nav-exit');
    if (exit) await exit.finished.catch(() => {});
    if (dialog.open && dialog.classList.contains('is-closing')) dialog.close();
  }

  close.addEventListener('click', closeDrawer);
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeDrawer();
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeDrawer();
  });
  dialog.addEventListener('close', () => {
    dialog.classList.remove('is-closing');
    trigger.setAttribute('aria-expanded', 'false');
    if (mobile.matches) trigger.focus();
  });
  mobile.addEventListener('change', () => {
    if (!mobile.matches && dialog.open) dialog.close();
  });
}

document.addEventListener('DOMContentLoaded', setupMobileNavigation);

document.addEventListener('DOMContentLoaded', () => {
  const source = document.querySelector('.nav-phone-item a[href^="tel:"]');
  if (!source) return;

  document.querySelector('#ew-cta-2 .cta-flex a[href^="tel:"]')
    ?.setAttribute('aria-label', `Ring til JYSKREN på ${source.textContent.trim()}`);
});
