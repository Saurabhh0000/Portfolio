(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $ = (s, root = document) => [...root.querySelectorAll(s)];
  const loader = document.getElementById('loader');
  addEventListener('load', () => setTimeout(() => loader?.classList.add('hide'), reduce ? 80 : 900), {once:true});

  const nav = document.getElementById('nav');
  const progress = document.querySelector('.page-progress i');
  const anchors = $('.nav-links a');
  const sections = $('main section[id]');
  const update = () => {
    const y = scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    nav?.classList.toggle('scrolled', y > 35);
    if (progress) progress.style.transform = `scaleX(${Math.min(1, y / max)})`;
    let current = 'home';
    sections.forEach(s => { if (s.getBoundingClientRect().top <= innerHeight * .42) current = s.id; });
    anchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
  };
  addEventListener('scroll', update, {passive:true}); update();

  const menu = document.querySelector('.menu');
  const navLinks = document.querySelector('.nav-links');
  menu?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open'); menu?.setAttribute('aria-expanded','false');
  }));

  const revealItems = $('.reveal,.reveal-left,.reveal-right');
  if ('IntersectionObserver' in window && !reduce) {
    const observer = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    }), {threshold:.12, rootMargin:'0px 0px -8% 0px'});
    revealItems.forEach(el => observer.observe(el));
  } else revealItems.forEach(el => el.classList.add('visible'));

  if (fine && !reduce) {
    const glow = document.querySelector('.cursor-glow');
    addEventListener('pointermove', e => {
      if (glow) { glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`; }
      document.documentElement.style.setProperty('--px', `${e.clientX}px`);
      document.documentElement.style.setProperty('--py', `${e.clientY}px`);
    }, {passive:true});

    // Portrait tilt feels like a physical card rather than a generic hover effect.
    const portrait = document.querySelector('.portrait');
    portrait?.addEventListener('pointermove', e => {
      const r = portrait.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      portrait.style.transform = `rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) rotate(0deg) scale(1.015)`;
    });
    portrait?.addEventListener('pointerleave', () => portrait.style.removeProperty('transform'));

    // Project image depth.
    $('.project-card').forEach(card => {
      const image = card.querySelector('.project-visual img');
      card.addEventListener('pointermove', e => {
        const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        card.style.setProperty('--rx', `${(-y*2.2).toFixed(2)}deg`); card.style.setProperty('--ry', `${(x*2.6).toFixed(2)}deg`);
        if(image) image.style.transform=`scale(1.055) translate(${(-x*7).toFixed(1)}px,${(-y*5).toFixed(1)}px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); if(image) image.style.removeProperty('transform'); });
    });

    // Small magnetic movement for CTAs.
    $('.btn,.nav-resume').forEach(el => {
      el.addEventListener('pointermove', e => { const r=el.getBoundingClientRect(); el.style.translate=`${((e.clientX-r.left-r.width/2)*.07).toFixed(1)}px ${((e.clientY-r.top-r.height/2)*.07).toFixed(1)}px`; });
      el.addEventListener('pointerleave', () => el.style.removeProperty('translate'));
    });
  }

  // Keep the skills constellation gently alive without moving it on touch screens.
  if (!reduce) {
    const constellation = document.querySelector('.constellation');
    let t = 0;
    const animate = () => {
      t += .006;
      if (constellation && fine) constellation.style.setProperty('--spin', `${Math.sin(t)*2}deg`);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
})();
