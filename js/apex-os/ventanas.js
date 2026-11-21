// APEX OS · Ventanas, barra de tareas, menú Inicio y reloj
const windows=[...document.querySelectorAll('.window')], taskList=document.getElementById('task-list');
let topZ=20;
function focusWin(w){topZ++;w.style.zIndex=topZ;windows.forEach(x=>x.classList.toggle('focused',x===w));}
function taskFor(id){return document.querySelector(`[data-task="${id}"]`)}
function openWin(id){
  const w=document.getElementById(id);if(!w)return;
  w.classList.remove('hidden');w.classList.remove('minimized');focusWin(w);
  if(!taskFor(id)){
    const b=document.createElement('button');b.className='task active';b.dataset.task=id;
    b.textContent=({explorer:'📁 Archivos',terminal:'▣ Terminal',browser:'🌐 Navegador',doom:'🕹️ Arcade',about:'◈ Acerca de'})[id];
    b.onclick=()=>{if(w.classList.contains('hidden'))w.classList.remove('hidden');else if(w.style.display!=='none'&&!w.classList.contains('minimized'))w.classList.add('hidden');else w.classList.remove('hidden');focusWin(w);};
    taskList.appendChild(b)
  }
  updateTasks();document.getElementById('start-menu').classList.remove('open');
  if(id==='doom') startDoom();
  if(id==='browser') loadBrowserPage(currentPage);
}
function closeWin(w){w.classList.add('hidden');w.classList.remove('max');taskFor(w.id)?.remove(); if(w.id==='doom') stopDoom();}
function updateTasks(){windows.forEach(w=>{const t=taskFor(w.id);if(t)t.classList.toggle('active',!w.classList.contains('hidden'))})}
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openWin(b.dataset.open)));
windows.forEach(w=>{
  w.addEventListener('mousedown',()=>focusWin(w));
  w.querySelector('[data-close]').onclick=()=>closeWin(w);
  w.querySelector('[data-min]').onclick=()=>{w.classList.add('hidden');updateTasks()};
  w.querySelector('[data-max]').onclick=()=>{w.classList.toggle('max');focusWin(w)};
  const bar=w.querySelector('.titlebar');let drag=false,sx=0,sy=0,ox=0,oy=0;
  bar.addEventListener('pointerdown',e=>{if(e.target.closest('button')||w.classList.contains('max'))return;drag=true;bar.setPointerCapture(e.pointerId);sx=e.clientX;sy=e.clientY;ox=w.offsetLeft;oy=w.offsetTop;focusWin(w)});
  bar.addEventListener('pointermove',e=>{if(!drag)return;w.style.left=Math.max(0,Math.min(innerWidth-w.offsetWidth,ox+e.clientX-sx))+'px';w.style.top=Math.max(0,Math.min(innerHeight-75,oy+e.clientY-sy))+'px'});
  bar.addEventListener('pointerup',()=>drag=false);bar.addEventListener('pointercancel',()=>drag=false);
});
const start=document.getElementById('start-menu');document.getElementById('start-btn').onclick=()=>start.classList.toggle('open');
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#start-menu')&&!e.target.closest('#start-btn'))start.classList.remove('open')});


// Clock
function tick(){document.getElementById('clock').textContent=new Date().toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'})}tick();setInterval(tick,15000);

