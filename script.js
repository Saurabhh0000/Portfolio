(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      window.setTimeout(() => {
        preloader.classList.add('is-hidden');
        document.body.classList.add('is-loaded');
      }, prefersReducedMotion ? 150 : 650);
    }, { once: true });
  }

  const nav = document.getElementById('nav');
  const progress = document.querySelector('.scroll-progress__bar');
  const backTop = document.querySelector('.back-top');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  const updateScrollUI = () => {
    const scrollY = window.scrollY;
    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, scrollY / maxScroll);

    nav?.classList.toggle('scrolled', scrollY > 30);
    backTop?.classList.toggle('is-visible', scrollY > 520);
    if (progress) progress.style.transform = `scaleX(${ratio})`;
  };

  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  navToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', navToggle.classList.contains('active'));
  });

  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle?.classList.remove('active');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
  }

  const parallaxItems = document.querySelectorAll('[data-parallax]');
  const updateParallax = () => {
    if (prefersReducedMotion || isTouch || !parallaxItems.length) return;
    const viewport = window.innerHeight;
    parallaxItems.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const speed = Number(el.dataset.parallax || 0.06);
      const centerOffset = (rect.top + rect.height / 2 - viewport / 2) * speed;
      el.style.transform = `translate3d(0, ${centerOffset.toFixed(2)}px, 0)`;
    });
  };

  let raf = 0;
  const scheduleParallax = () => {
    if (raf) return;
    raf = window.requestAnimationFrame(() => {
      updateParallax();
      raf = 0;
    });
  };

  if (!prefersReducedMotion && !isTouch) {
    window.addEventListener('scroll', scheduleParallax, { passive: true });
    window.addEventListener('resize', scheduleParallax);
    scheduleParallax();
  }

  const projectTrack = document.querySelector('.project-reel');
  const projectCards = [...document.querySelectorAll('.project-panel')];
  const projectCount = document.querySelector('.project-count');
  const updateProjectCount = () => {
    if (!projectTrack || !projectCount || !projectCards.length) return;
    const trackLeft = projectTrack.getBoundingClientRect().left;
    const distances = projectCards.map((card) => Math.abs(card.getBoundingClientRect().left - trackLeft));
    const index = distances.indexOf(Math.min(...distances));
    projectCount.textContent = `${String(index + 1).padStart(2, '0')} / ${String(projectCards.length).padStart(2, '0')}`;
  };
  projectTrack?.addEventListener('scroll', updateProjectCount, { passive: true });
  window.addEventListener('resize', updateProjectCount);
  updateProjectCount();

  document.querySelectorAll('[data-scroll-to]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.dataset.scrollTo);
      target?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'start' });
    });
  });

  document.querySelectorAll('.skill-orbit').forEach((orbit) => {
    orbit.querySelectorAll('.skill-node').forEach((node) => {
      node.addEventListener('mousemove', (event) => {
        if (prefersReducedMotion || isTouch) return;
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        node.style.transform = `translate(${(x / 8).toFixed(2)}px, ${(y / 8).toFixed(2)}px)`;
      });
      node.addEventListener('mouseleave', () => {
        node.style.transform = '';
      });
    });
  });
})();
