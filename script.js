const pages=[...document.querySelectorAll('.page')];
const navLinks=[...document.querySelectorAll('.nav a[data-page]')];
const nav=document.querySelector('.nav');
const toggle=document.querySelector('.menu-toggle');
const backdrop=document.createElement('button');backdrop.className='nav-backdrop';backdrop.type='button';backdrop.setAttribute('aria-label','Tutup menu');backdrop.hidden=true;document.body.appendChild(backdrop);
function closeMenu(){nav.classList.remove('open');nav.style.transform='';nav.style.opacity='';nav.style.transition='';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Buka menu');backdrop.hidden=true;document.body.style.overflow=''}
backdrop.addEventListener('click',closeMenu);
let touchStartX=0,touchStartY=0,dragX=0,isDragging=false;
function startMenuDrag(x,y){touchStartX=x;touchStartY=y;dragX=0;isDragging=true;nav.style.transition='none'}
function moveMenuDrag(x,y){if(!isDragging)return;const dx=x-touchStartX,dy=y-touchStartY;if(dx>0&&Math.abs(dx)>Math.abs(dy)*1.15){dragX=Math.min(dx,nav.getBoundingClientRect().width);nav.style.transform=`translateX(${dragX}px)`;nav.style.opacity=String(Math.max(.35,1-dragX/500))}}
function endMenuDrag(){if(!isDragging)return;isDragging=false;const shouldClose=dragX>Math.min(85,nav.getBoundingClientRect().width*.28);nav.style.transition='transform .28s cubic-bezier(.22,.8,.25,1), opacity .22s ease';if(shouldClose){nav.style.transform='translateX(110%)';nav.style.opacity='0';window.setTimeout(()=>{closeMenu();nav.style.transform='';nav.style.opacity='';nav.style.transition=''},280)}else{nav.style.transform='translateX(0)';nav.style.opacity='1';window.setTimeout(()=>{nav.style.transition=''},300)}}
nav.addEventListener('touchstart',e=>{const t=e.changedTouches[0];startMenuDrag(t.clientX,t.clientY)},{passive:true});
nav.addEventListener('touchmove',e=>{const t=e.changedTouches[0];moveMenuDrag(t.clientX,t.clientY)},{passive:true});
nav.addEventListener('touchend',endMenuDrag,{passive:true});
nav.addEventListener('touchcancel',endMenuDrag,{passive:true});
nav.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;startMenuDrag(e.clientX,e.clientY)});
nav.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')return;moveMenuDrag(e.clientX,e.clientY)});
nav.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')endMenuDrag()});

function showPage(id){if(!document.getElementById(id)||!document.getElementById(id).classList.contains('page'))id='beranda';pages.forEach(p=>p.classList.toggle('active',p.id===id));navLinks.forEach(a=>a.classList.toggle('active',a.dataset.page===id));closeMenu();window.scrollTo({top:0,behavior:'smooth'});history.replaceState(null,'','#'+id)}
navLinks.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showPage(a.dataset.page)}));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{showPage(b.dataset.go);if(b.dataset.variant){const v=document.getElementById('variant');v.value=b.dataset.variant==='horti'?'kocor':'muda';resetResult()}}));
document.querySelectorAll('.brand[data-page],.footer-brand[data-page]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showPage(a.dataset.page)}));
toggle.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Tutup menu':'Buka menu');backdrop.hidden=!open;document.body.style.overflow=open?'hidden':''});
document.getElementById('year').textContent=new Date().getFullYear();
const variant=document.getElementById('variant'),water=document.getElementById('water'),mainResult=document.getElementById('result-main'),detail=document.getElementById('result-detail');
function fmt(n){return new Intl.NumberFormat('id-ID',{maximumFractionDigits:2}).format(n)}
function calculate(){const box=document.getElementById('result-box');const w=Number(water.value);if(!Number.isFinite(w)||w<=0){box.classList.remove('hidden');mainResult.textContent='Masukkan jumlah air yang valid';detail.textContent='Jumlah air harus lebih besar dari 0 liter.';return}const rate={semprot:143,kocor:330,muda:230,dewasa:600}[variant.value];box.classList.remove('hidden');mainResult.textContent=fmt(rate*w)+' ml BIOBOOST';let desc={semprot:'Hortikultura — sprayer (143 ml per liter air).',kocor:'Hortikultura — kocor tanah (330 ml per liter air).',muda:'Perkebunan — pohon muda (230 ml per liter air).',dewasa:'Perkebunan — pohon dewasa (600 ml per liter air).'};detail.textContent='Campurkan '+fmt(rate*w)+' ml BIOBOOST ke dalam '+fmt(w)+' liter air. '+desc[variant.value]}
function resetResult(){document.getElementById('result-box').classList.add('hidden');mainResult.textContent='';detail.textContent=''}
variant.addEventListener('change',resetResult);document.getElementById('calculate').addEventListener('click',calculate);water.addEventListener('input',resetResult);resetResult();
const topButton=document.getElementById('toTop');window.addEventListener('scroll',()=>topButton.classList.toggle('show',window.scrollY>300));topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));const initial=location.hash.slice(1);if(initial&&document.getElementById(initial)?.classList.contains('page'))showPage(initial);else showPage('beranda');
