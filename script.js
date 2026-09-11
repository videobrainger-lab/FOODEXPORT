document.querySelector('.menu-btn').addEventListener('click',()=>document.querySelector('.header').classList.toggle('open'));
document.querySelectorAll('.header nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.header').classList.remove('open')));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal,.section-head,.product-grid,.steps,.service-list,.why-grid').forEach(el=>{el.classList.add('reveal');io.observe(el)});

const form=document.getElementById('inquiry-form');
const statusEl=document.getElementById('form-status');
form.addEventListener('submit',async e=>{
  e.preventDefault();
  const button=form.querySelector('button[type="submit"]');
  const data=new FormData(form);
  if(data.get('bot-field')) return;

  button.disabled=true;
  const originalText=button.textContent;
  button.textContent='Sending…';
  statusEl.textContent='Sending your inquiry…';

  try{
    const encoded=new URLSearchParams();
    for(const [key,value] of data.entries()) encoded.append(key,String(value));

    const formResponse=await fetch('/',{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:encoded.toString()
    });
    if(!formResponse.ok) throw new Error('Form submission failed');

    const telegramPayload=Object.fromEntries(data.entries());
    fetch('/telegram-notify',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(telegramPayload)
    }).catch(err=>console.error('Telegram notification failed',err));

    form.reset();
    statusEl.textContent='Thank you for your inquiry. Our team will contact you shortly.';
  }catch(err){
    console.error(err);
    statusEl.textContent='Something went wrong. Please try again.';
  }finally{
    button.disabled=false;
    button.textContent=originalText;
  }
});