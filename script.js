(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $ = (s, root=document) => [...root.querySelectorAll(s)];
  const loader=document.getElementById('loader');
  addEventListener('load',()=>setTimeout(()=>loader?.classList.add('hide'),reduce?80:900),{once:true});
  const nav=document.getElementById('nav'), progress=document.querySelector('.page-progress i');
  const anchors=$('.nav-links a'), sections=$('main section[id]');
  const update=()=>{const y=scrollY,max=Math.max(1,document.documentElement.scrollHeight-innerHeight);nav?.classList.toggle('scrolled',y>35);if(progress)progress.style.transform=`scaleX(${Math.min(1,y/max)})`;let current='home';sections.forEach(s=>{if(s.getBoundingClientRect().top<=innerHeight*.42)current=s.id});anchors.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${current}`))};
  addEventListener('scroll',update,{passive:true});update();
  const menu=document.querySelector('.menu'),links=document.querySelector('.nav-links');
  menu?.addEventListener('click',()=>{const open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
  links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));
  const reveals=$('.reveal,.reveal-left,.reveal-right');
  if('IntersectionObserver'in window&&!reduce){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});reveals.forEach(e=>io.observe(e))}else reveals.forEach(e=>e.classList.add('visible'));
  if(fine&&!reduce){
    const glow=document.querySelector('.cursor-glow');
    addEventListener('pointermove',e=>{if(glow){glow.style.left=`${e.clientX}px`;glow.style.top=`${e.clientY}px`}}, {passive:true});
    const portrait=document.querySelector('.portrait');
    portrait?.addEventListener('pointermove',e=>{const r=portrait.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;portrait.style.transform=`translateX(-50%) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) rotate(0deg) scale(1.015)`});
    portrait?.addEventListener('pointerleave',()=>portrait.style.removeProperty('transform'));
    $('.project').forEach(card=>{const image=card.querySelector('.project-image img');card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;if(image)image.style.transform=`scale(1.055) translate(${(-x*7).toFixed(1)}px,${(-y*5).toFixed(1)}px)`});card.addEventListener('pointerleave',()=>image?.style.removeProperty('transform'))});
    $('.btn,.nav-resume,.socials a').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.translate=`${((e.clientX-r.left-r.width/2)*.06).toFixed(1)}px ${((e.clientY-r.top-r.height/2)*.06).toFixed(1)}px`});el.addEventListener('pointerleave',()=>el.style.removeProperty('translate'))});
  }
  if(!reduce){let t=0;const orbit=document.querySelector('.orbit');const loop=()=>{t+=.006;if(orbit&&fine)orbit.style.rotate=`${Math.sin(t)*1.5}deg`;requestAnimationFrame(loop)};requestAnimationFrame(loop)}
})();
