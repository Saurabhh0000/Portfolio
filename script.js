(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = window.matchMedia('(hover: none)').matches;
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => setTimeout(() => loader?.classList.add('hide'), reduce ? 100 : 850), {once:true});

  const nav = document.getElementById('nav');
  const progress = document.querySelector('.page-progress i');
  const updateScroll = () => {
    const y = window.scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    nav?.classList.toggle('scrolled', y > 30);
    if (progress) progress.style.transform = `scaleX(${Math.min(1, y / max)})`;
  };
  addEventListener('scroll', updateScroll, {passive:true}); updateScroll();

  const menu = document.querySelector('.menu');
  const links = document.querySelector('.nav-links');
  menu?.addEventListener('click', () => { const open = links?.classList.toggle('open'); menu.setAttribute('aria-expanded', String(!!open)); });
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { links.classList.remove('open'); menu?.setAttribute('aria-expanded','false'); }));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold:.12,rootMargin:'0px 0px -7% 0px'});
    document.querySelectorAll('.reveal,.reveal-right,.reveal-left').forEach(el => observer.observe(el));
  } else document.querySelectorAll('.reveal,.reveal-right,.reveal-left').forEach(el => el.classList.add('visible'));

  const glow = document.querySelector('.cursor-glow');
  if (!touch && !reduce && glow) addEventListener('pointermove', e => { glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`; }, {passive:true});

  const parallax = [...document.querySelectorAll('[data-parallax]')];
  if (!touch && !reduce && parallax.length) {
    let ticking = false;
    const paint = () => { ticking=false; const mid=innerHeight/2; parallax.forEach(el => { const r=el.getBoundingClientRect(); const speed=Number(el.dataset.parallax)||.04; const offset=(r.top+r.height/2-mid)*speed; el.style.translate=`0 ${offset.toFixed(1)}px`; }); };
    addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(paint);ticking=true;}},{passive:true}); paint();
  }

  document.querySelectorAll('.project-card,.bento-card,.about-facts>div,.timeline-card,.float-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      if(touch || reduce) return;
      const r=card.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5; const y=(e.clientY-r.top)/r.height-.5;
      card.style.setProperty('--mx', `${(x*18).toFixed(1)}px`); card.style.setProperty('--my', `${(y*12).toFixed(1)}px`);
    });
    card.addEventListener('pointerleave',()=>{card.style.removeProperty('--mx');card.style.removeProperty('--my');});
  });
})();