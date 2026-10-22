const pages=[...document.querySelectorAll('.page')];
const navLinks=[...document.querySelectorAll('.nav a[data-page]')];
const nav=document.querySelector('.nav');
const toggle=document.querySelector('.menu-toggle');
function showPage(id){if(!document.getElementById(id)||!document.getElementById(id).classList.contains('page'))id='beranda';pages.forEach(p=>p.classList.toggle('active',p.id===id));navLinks.forEach(a=>a.classList.toggle('active',a.dataset.page===id));nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');window.scrollTo({top:0,behavior:'smooth'});history.replaceState(null,'','#'+id)}
navLinks.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showPage(a.dataset.page)}));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{showPage(b.dataset.go);if(b.dataset.variant){const v=document.getElementById('variant');v.value=b.dataset.variant==='horti'?'kocor':'muda';resetResult()}}));
document.querySelectorAll('.brand[data-page],.footer-brand[data-page]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showPage(a.dataset.page)}));
function closeMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');nav.style.transform='';}
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));if(open){const r=toggle.getBoundingClientRect();nav.style.setProperty('--menu-top',Math.round(r.bottom+8)+'px');}});
let touchStartX=0,touchStartY=0,dragX=0,dragging=false;
nav.addEventListener('touchstart',e=>{if(!nav.classList.contains('open'))return;touchStartX=e.touches[0].clientX;touchStartY=e.touches[0].clientY;dragX=0;dragging=true;nav.style.transition='none';},{passive:true});
nav.addEventListener('touchmove',e=>{if(!dragging)return;const dx=e.touches[0].clientX-touchStartX,dy=e.touches[0].clientY-touchStartY;if(Math.abs(dy)>Math.abs(dx)*1.2){dragging=false;nav.style.transition='';return}dragX=Math.max(0,dx);nav.style.transform='translateX('+dragX+'px)';},{passive:true});
nav.addEventListener('touchend',()=>{if(!dragging)return;dragging=false;nav.style.transition='';if(dragX>65)closeMenu();else nav.style.transform='';});
document.addEventListener('touchstart',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!toggle.contains(e.target))closeMenu();},{passive:true});
document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!toggle.contains(e.target))closeMenu();});
document.getElementById('year').textContent=new Date().getFullYear();
const variant=document.getElementById('variant'),water=document.getElementById('water'),mainResult=document.getElementById('result-main'),detail=document.getElementById('result-detail');
function fmt(n){return new Intl.NumberFormat('id-ID',{maximumFractionDigits:2}).format(n)}
function calculate(){const box=document.getElementById('result-box');const w=Number(water.value);if(!Number.isFinite(w)||w<=0){box.classList.remove('hidden');mainResult.textContent='Masukkan jumlah air yang valid';detail.textContent='Jumlah air harus lebih besar dari 0 liter.';return}const rate={semprot:143,kocor:330,muda:230,dewasa:600}[variant.value];box.classList.remove('hidden');mainResult.textContent=fmt(rate*w)+' ml BIOBOOST';let desc={semprot:'Hortikultura — sprayer (143 ml per liter air).',kocor:'Hortikultura — kocor tanah (330 ml per liter air).',muda:'Perkebunan — pohon muda (230 ml per liter air).',dewasa:'Perkebunan — pohon dewasa (600 ml per liter air).'};detail.textContent='Campurkan '+fmt(rate*w)+' ml BIOBOOST ke dalam '+fmt(w)+' liter air. '+desc[variant.value]}
function resetResult(){document.getElementById('result-box').classList.add('hidden');mainResult.textContent='';detail.textContent=''}
variant.addEventListener('change',resetResult);document.getElementById('calculate').addEventListener('click',calculate);water.addEventListener('input',resetResult);resetResult();
const topButton=document.getElementById('toTop');window.addEventListener('scroll',()=>topButton.classList.toggle('show',window.scrollY>300));topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));const initial=location.hash.slice(1);if(initial&&document.getElementById(initial)?.classList.contains('page'))showPage(initial);else showPage('beranda');
