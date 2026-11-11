// Aparecer al hacer scroll, escalonado de a 80 ms por fila
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('vis');io.unobserve(e.target);
}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.rv').forEach(el=>{
  const hermanos=[...el.parentElement.children].filter(c=>c.classList.contains('rv'));
  el.style.setProperty('--d',(hermanos.indexOf(el)%3)*80+'ms');
  io.observe(el);
});
