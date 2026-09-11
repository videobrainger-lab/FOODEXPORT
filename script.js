document.querySelector('.menu-btn').addEventListener('click',()=>document.querySelector('.header').classList.toggle('open'));
document.querySelectorAll('.header nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.header').classList.remove('open')));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal,.section-head,.product-grid,.steps,.service-list,.why-grid').forEach(el=>{el.classList.add('reveal');io.observe(el)});