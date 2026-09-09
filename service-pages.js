(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = [...document.querySelectorAll('.nav a')];
  const progress = document.querySelector('.service-progress span');

  menuToggle?.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? 'Close' : 'Menu';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      if (menuToggle) menuToggle.textContent = 'Menu';
    });
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