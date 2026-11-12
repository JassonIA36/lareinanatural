const WA='573134040401', CLAVE='lareina-pedido-v1', MAX=20;
const $=s=>document.querySelector(s);
const cop=n=>'$ '+n.toLocaleString('es-CO');
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sinMov=matchMedia('(prefers-reduced-motion: reduce)').matches;

// catálogo leído de las tarjetas
const prods={};
document.querySelectorAll('.card[data-id]').forEach(c=>{
  prods[c.dataset.id]={id:c.dataset.id,nombre:c.dataset.nombre,precio:+c.dataset.precio,img:c.querySelector('.foto img').getAttribute('src')};
});

// estado guardado en el navegador (si no se puede, sigue funcionando)
let pedido={}, datos={};
try{
  const g=JSON.parse(localStorage.getItem(CLAVE)||'{}');
  for(const id in (g.pedido||{})) if(prods[id]&&g.pedido[id]>0) pedido[id]=Math.min(MAX,g.pedido[id]|0);
  datos=g.datos||{};
}catch(e){}
const guardar=()=>{try{localStorage.setItem(CLAVE,JSON.stringify({pedido,datos}))}catch(e){}};

const fab=$('#fab'), dlg=$('#carrito'), form=$('#form');
const cantidad=()=>Object.values(pedido).reduce((a,b)=>a+b,0);
const total=()=>Object.entries(pedido).reduce((a,[id,q])=>a+prods[id].precio*q,0);

function pintar(){
  const n=cantidad(), vacio=n===0;
  $('#fab-n').textContent=n; $('#fab-n').hidden=vacio;
  $('#vaciar').hidden=vacio; $('#datos').hidden=vacio; $('#pie').hidden=vacio;
  $('#total').textContent=cop(total());
  $('#lineas').innerHTML=vacio
    ?'<div class="car-vacio"><b>Tu pedido está vacío</b>Agrega productos desde el catálogo y aparecerán aquí.<br><button type="button" class="btn btn-verde" data-ir>Ver productos</button></div>'
    :Object.entries(pedido).map(([id,q])=>{const p=prods[id];return `<div class="linea">
        <img src="${esc(p.img)}" alt="" width="48" height="64">
        <div><span class="nom">${esc(p.nombre)}</span><span class="uni">${cop(p.precio)} c/u</span></div>
        <div class="der"><span class="sub">${cop(p.precio*q)}</span>
          <div class="cant"><button type="button" data-acc="menos" data-id="${id}" aria-label="Quitar uno de ${esc(p.nombre)}">−</button><output>${q}</output><button type="button" data-acc="mas" data-id="${id}" aria-label="Agregar uno de ${esc(p.nombre)}">+</button></div>
          <button type="button" class="quitar" data-acc="quitar" data-id="${id}">Quitar</button></div>
      </div>`}).join('');
  guardar();
}
function rebote(){ if(!sinMov) fab.animate([{transform:'scale(1)'},{transform:'scale(1.1)'},{transform:'scale(1)'}],{duration:260,easing:'cubic-bezier(0.23,1,0.32,1)'}); }

// selector de cantidad y botón "Agregar" en cada tarjeta
document.querySelectorAll('.card[data-id]').forEach(c=>{
  const out=c.querySelector('output'); let q=1;
  c.querySelector('.menos').onclick=()=>{q=Math.max(1,q-1);out.textContent=q};
  c.querySelector('.mas').onclick=()=>{q=Math.min(MAX,q+1);out.textContent=q};
  const b=c.querySelector('.agregar'), t=b.querySelector('span'); let h;
  b.onclick=()=>{
    const id=c.dataset.id; pedido[id]=Math.min(MAX,(pedido[id]||0)+q);
    q=1; out.textContent=1; pintar(); rebote();
    clearTimeout(h); b.classList.add('ok'); t.textContent='¡Agregado!';
    h=setTimeout(()=>{b.classList.remove('ok');t.textContent='Agregar'},1400);
  };
});

// combo: suma 1 de cada producto
const combo=$('#combo'), comboT=combo.querySelector('span'); let hc;
combo.onclick=()=>{
  for(const id in prods) pedido[id]=Math.min(MAX,(pedido[id]||0)+1);
  pintar(); rebote();
  clearTimeout(hc); combo.classList.add('ok'); comboT.textContent='¡Combo agregado!';
  hc=setTimeout(()=>{combo.classList.remove('ok');comboT.textContent='Agregar combo al pedido'},1400);
};

// panel del pedido
const abrir=()=>{ for(const k in datos){const f=form.elements[k]; if(f&&!f.value) f.value=datos[k];} dlg.showModal(); };
fab.onclick=abrir;
$('#cerrar').onclick=()=>dlg.close();
dlg.addEventListener('click',e=>{ if(e.target===dlg) dlg.close(); });
$('#vaciar').onclick=()=>{ if(confirm('¿Vaciar todo el pedido?')){pedido={};pintar();} };
$('#lineas').addEventListener('click',e=>{
  if(e.target.closest('[data-ir]')){dlg.close();location.hash='#productos';return;}
  const b=e.target.closest('[data-acc]'); if(!b) return;
  const id=b.dataset.id, a=b.dataset.acc;
  if(a==='mas') pedido[id]=Math.min(MAX,(pedido[id]||0)+1);
  if(a==='menos'){ pedido[id]=(pedido[id]||1)-1; if(pedido[id]<=0) delete pedido[id]; }
  if(a==='quitar') delete pedido[id];
  pintar();
  if(!cantidad()) dlg.close();
});

// enviar por WhatsApp
const reglas={nombre:'Escribe tu nombre',tel:'Escribe un celular válido',ciudad:'Escribe tu ciudad',dir:'Escribe tu dirección'};
form.addEventListener('submit',e=>{
  e.preventDefault();
  if(!cantidad()) return;
  let primero=null;
  for(const k in reglas){
    const f=form.elements[k], v=f.value.trim();
    const mal=!v||(k==='tel'&&v.replace(/\D/g,'').length<7);
    f.setAttribute('aria-invalid',mal);
    $('#e-'+k).textContent=mal?reglas[k]:'';
    if(mal&&!primero) primero=f;
  }
  if(primero){primero.focus();return;}
  const v=k=>form.elements[k].value.trim();
  datos={nombre:v('nombre'),tel:v('tel'),ciudad:v('ciudad'),dir:v('dir')}; guardar();
  const lineas=Object.entries(pedido).map(([id,q])=>`• ${q} x ${prods[id].nombre} — ${cop(prods[id].precio*q)}`).join('\n');
  const msg=`Hola, quiero hacer un pedido 🐝\n\n*Mi pedido*\n${lineas}\n\n*Total productos:* ${cop(total())}
_(Domicilio aparte, por cuenta del cliente)_

*Datos de entrega*\nNombre: ${v('nombre')}\nCelular: ${v('tel')}\nCiudad: ${v('ciudad')}\nDirección: ${v('dir')}`+(v('notas')?`\nNotas: ${v('notas')}`:'');
  window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg),'_blank','noopener');
});
form.addEventListener('input',e=>{ if(e.target.getAttribute('aria-invalid')==='true'){e.target.setAttribute('aria-invalid','false');const m=$('#e-'+e.target.name); if(m) m.textContent='';} });
pintar();
