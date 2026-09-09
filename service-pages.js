(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = [...document.querySelectorAll('.nav a')];
  const servicesNav = document.querySelector('.nav-services');
  const servicesTrigger = document.querySelector('.nav-services-trigger');
  const mobileNav = window.matchMedia('(max-width:900px), (pointer:coarse)');
  const progress = document.querySelector('.service-progress span');

  function setServicesState(open) {
    servicesNav?.classList.toggle('open', open);
    servicesTrigger?.setAttribute('aria-expanded', String(open));
  }

  function setMenuState(open) {
    document.body.classList.toggle('menu-open', open);
    menuToggle?.setAttribute('aria-expanded', String(open));
    menuToggle?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (menuToggle) menuToggle.textContent = open ? 'Close' : 'Menu';
    if (!open) setServicesState(false);
  }

  menuToggle?.addEventListener('click', () => {
    setMenuState(!document.body.classList.contains('menu-open'));
  });

  servicesTrigger?.addEventListener('click', event => {
    if (!mobileNav.matches) return;
    event.preventDefault();
    setServicesState(!servicesNav?.classList.contains('open'));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (link === servicesTrigger) return;
      setMenuState(false);
    });
  });

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      setServicesState(false);
      if (document.body.classList.contains('menu-open')) setMenuState(false);
    }
  });

  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${value}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive:true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealItems = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold:.14, rootMargin:'0px 0px -8% 0px' });

    revealItems.forEach(item => observer.observe(item));
  } else {
    document.querySelectorAll('.reveal').forEach(item => item.classList.add('is-visible'));
  }
})();