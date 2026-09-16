(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = window.matchMedia('(hover: none)').matches;
  const loader = document.getElementById('loader');
  const root = document.documentElement;

  window.addEventListener('load', () => {
    setTimeout(() => loader?.classList.add('hide'), reduce ? 100 : 850);
  }, { once: true });

  const nav = document.getElementById('nav');
  const progress = document.querySelector('.page-progress i');
  const sections = [...document.querySelectorAll('main section[id]')];
  const navAnchors = [...document.querySelectorAll('.nav-links a')];

  const updateScroll = () => {
    const y = window.scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    nav?.classList.toggle('scrolled', y > 30);
    if (progress) progress.style.transform = `scaleX(${Math.min(1, y / max)})`;

    let current = '';
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= innerHeight * 0.38) current = section.id;
    });
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
  };
  addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  const menu = document.querySelector('.menu');
  const links = document.querySelector('.nav-links');
  menu?.addEventListener('click', () => {
    const open = links?.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(!!open));
  });
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  }));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -7% 0px' });
    document.querySelectorAll('.reveal,.reveal-right,.reveal-left').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal,.reveal-right,.reveal-left').forEach(el => el.classList.add('visible'));
  }

  const glow = document.querySelector('.cursor-glow');
  if (!touch && !reduce && glow) {
    addEventListener('pointermove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      root.style.setProperty('--pointer-x', `${e.clientX}px`);
      root.style.setProperty('--pointer-y', `${e.clientY}px`);
    }, { passive: true });
  }

  const parallax = [...document.querySelectorAll('[data-parallax]')];
  if (!touch && !reduce && parallax.length) {
    let ticking = false;
    const paint = () => {
      ticking = false;
      const mid = innerHeight / 2;
      parallax.forEach(el => {
        const r = el.getBoundingClientRect();
        const speed = Number(el.dataset.parallax) || .04;
        const offset = (r.top + r.height / 2 - mid) * speed;
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      });
    };
    addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(paint); ticking = true; }
    }, { passive: true });
    paint();
  }

  // Soft 3D tilt: the card follows the pointer while preserving its hover lift.
  if (!touch && !reduce) {
    document.querySelectorAll('.project-card,.bento-card,.about-facts>div,.timeline-card,.float-card').forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.setProperty('--mx', `${(x * 12).toFixed(1)}px`);
        card.style.setProperty('--my', `${(y * 8).toFixed(1)}px`);
        card.style.setProperty('--rx', `${(-y * 3.5).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(x * 4).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
        card.style.removeProperty('--rx');
        card.style.removeProperty('--ry');
      });
    });
  }

  // Add the 3D transform through a single injected rule so existing card hover styles stay intact.
  const motionStyle = document.createElement('style');
  motionStyle.textContent = `
    @media (hover:hover) and (pointer:fine) {
      .project-card,.bento-card,.about-facts>div,.timeline-card,.float-card {
        transform: perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translate3d(var(--mx,0),var(--my,0),0);
        will-change: transform;
      }
      .project-card:hover,.bento-card:hover,.about-facts>div:hover,.timeline-card:hover,.float-card:hover {
        transform: perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translate3d(var(--mx,0),var(--my,-7px),0) !important;
      }
    }
    .nav-links a.active { color: var(--text); }
    .nav-links a.active:after { transform: translateX(-50%) scale(1); }
    .btn, .nav-resume, .project-link { -webkit-tap-highlight-color: transparent; }
    .btn i, .nav-resume i { transition: transform .3s cubic-bezier(.2,.75,.2,1); }
    .btn:hover i, .nav-resume:hover i { transform: translateX(4px) translateY(-1px); }
    @media (prefers-reduced-motion:reduce) {
      .project-card,.bento-card,.about-facts>div,.timeline-card,.float-card { transform:none !important; }
    }
  `;
  document.head.appendChild(motionStyle);

  // Magnetic micro-interaction for primary actions.
  if (!touch && !reduce) {
    document.querySelectorAll('.btn-primary,.btn-glass,.nav-resume').forEach(button => {
      button.addEventListener('pointermove', e => {
        const r = button.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .08;
        const y = (e.clientY - r.top - r.height / 2) * .08;
        button.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      });
      button.addEventListener('pointerleave', () => { button.style.removeProperty('translate'); });
    });
  }

  // Subtle image depth on project cards.
  if (!touch && !reduce) {
    document.querySelectorAll('.project-visual img').forEach(img => {
      const parent = img.closest('.project-visual');
      parent?.addEventListener('pointermove', e => {
        const r = parent.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        img.style.translate = `${(x * -10).toFixed(1)}px ${(y * -8).toFixed(1)}px`;
      });
      parent?.addEventListener('pointerleave', () => { img.style.removeProperty('translate'); });
    });
  }
})();