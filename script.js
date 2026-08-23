(() => {
  const shell = document.getElementById('h-shell');
  const panels = [...document.querySelectorAll('.panel')];
  const navLinks = [...document.querySelectorAll('.nav a')];
  const progressBar = document.querySelector('.progress-bar');
  const menuToggle = document.querySelector('.menu-toggle');
  const hero = document.querySelector('.hero-panel');
  const heroCut = document.querySelector('.hero-cut');
  const heroLogo = document.querySelector('.hero-logo');
  const thought = document.querySelector('.thought-panel');
  const shape = document.querySelector('.shape-panel');
  const build = document.querySelector('.build-panel');
  const buildBands = [...document.querySelectorAll('.build-band')];
  const coarse = window.matchMedia('(max-width:900px), (pointer:coarse)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp01 = n => Math.max(0, Math.min(1, n));

  menuToggle?.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? 'Close' : 'Menu';
  });

  document.querySelectorAll('.cap-item').forEach(button => {
    button.addEventListener('click', () => {
      const wasOpen = button.classList.contains('active');
      document.querySelectorAll('.cap-item').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      if (!wasOpen) {
        button.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
        button.nextElementSibling.classList.add('open');
      }
    });
  });

  function setNav(id) {
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
  }

  if (coarse) {
    navLinks.forEach(link => link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      if (menuToggle) menuToggle.textContent = 'Menu';
    }));

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setNav(entry.target.id); });
    }, { threshold:.52 });
    panels.forEach(panel => observer.observe(panel));
    return;
  }

  let targetX = shell.scrollLeft;
  let currentX = shell.scrollLeft;
  let ticking = false;

  const maxScroll = () => shell.scrollWidth - shell.clientWidth;
  const clampX = x => Math.max(0, Math.min(x, maxScroll()));

  function panelProgress(panel) {
    const left = panel.offsetLeft - currentX;
    return clamp01((window.innerWidth - left) / (window.innerWidth * .92));
  }

  function updateVisuals() {
    const max = maxScroll();
    progressBar.style.width = `${max > 0 ? currentX / max * 100 : 0}%`;

    const center = currentX + innerWidth * .5;
    let active = panels[0];
    for (const panel of panels) {
      if (center >= panel.offsetLeft && center < panel.offsetLeft + panel.offsetWidth) active = panel;
    }
    setNav(active.id);

    const heroP = clamp01(currentX / (innerWidth * .78));
    document.documentElement.style.setProperty('--hero-cut-h', `${2 + heroP * 6}px`);
    if (heroLogo) heroLogo.style.transform = `translateX(${-heroP * 3.5}vw) scale(${1 - heroP * .035})`;

    const tp = panelProgress(thought);
    thought.style.setProperty('--p', tp.toFixed(3));

    const sp = panelProgress(shape);
    shape.style.setProperty('--p', sp.toFixed(3));

    const bp = panelProgress(build);
    build.style.setProperty('--p', bp.toFixed(3));
    buildBands.forEach((band, index) => {
      const local = clamp01((bp - index * .075) / .62);
      band.style.setProperty('--bp', local.toFixed(3));
    });
  }

  function animate() {
    ticking = true;
    currentX += (targetX - currentX) * .16;
    if (Math.abs(targetX - currentX) < .4) currentX = targetX;
    shell.scrollLeft = currentX;
    updateVisuals();
    if (currentX !== targetX) requestAnimationFrame(animate);
    else ticking = false;
  }

  function goTo(x) {
    targetX = clampX(x);
    if (!ticking) animate();
  }

  shell.addEventListener('wheel', event => {
    const dominant = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (!dominant) return;
    event.preventDefault();
    targetX = clampX(targetX + dominant * 2.2);
    if (!ticking) animate();
  }, { passive:false });

  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      goTo(target.offsetLeft);
    });
  });
  document.querySelector('.brand')?.addEventListener('click', event => {
    event.preventDefault();
    goTo(0);
  });

  window.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); goTo(targetX + innerWidth * .72); }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); goTo(targetX - innerWidth * .72); }
    if (event.key === 'Home') { event.preventDefault(); goTo(0); }
    if (event.key === 'End') { event.preventDefault(); goTo(maxScroll()); }
  });

  let dragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;
  shell.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    if (event.target.closest('a, button, input, textarea, select, label')) return;
    dragging = true;
    dragStartX = event.clientX;
    dragStartScroll = targetX;
    shell.setPointerCapture?.(event.pointerId);
  });
  shell.addEventListener('pointermove', event => {
    if (!dragging) return;
    targetX = clampX(dragStartScroll - (event.clientX - dragStartX) * 1.3);
    if (!ticking) animate();
  });
  shell.addEventListener('pointerup', () => dragging = false);
  shell.addEventListener('pointercancel', () => dragging = false);

  shell.addEventListener('scroll', () => {
    if (ticking) return;
    currentX = shell.scrollLeft;
    targetX = shell.scrollLeft;
    updateVisuals();
  }, { passive:true });

  window.addEventListener('resize', () => {
    currentX = shell.scrollLeft;
    targetX = shell.scrollLeft;
    updateVisuals();
  });

  if (reduced) {
    document.documentElement.style.setProperty('--hero-cut-h', '4px');
  }

  updateVisuals();
})();
