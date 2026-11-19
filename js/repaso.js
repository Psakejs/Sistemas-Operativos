/* Repaso del parcial: motor de la aplicación (necesita js/repaso-datos.js) */
/* ===================== MOTOR ===================== */
function toApp(){const el=document.getElementById("repaso");if(el&&el.getBoundingClientRect().top<0)el.scrollIntoView({block:"start"})}
const BANK=[];
TOPICS.forEach(t=>{(Q[t.id]||[]).forEach((x,i)=>{BANK.push(Object.assign({id:t.id+"-"+i,topic:t.id,area:t.a,u:t.u,k:x.k||"mc"},x))})});
const TOPIC=Object.fromEntries(TOPICS.map(t=>[t.id,t]));
const LS="parcialSO.v1";
let S={stats:{},known:{},tab:"aprender"};
try{const raw=localStorage.getItem(LS);if(raw)S=Object.assign(S,JSON.parse(raw))}catch(e){}
function save(){try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}}
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const norm=s=>String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/\s+/g,"").trim();
const fmt=s=>esc(s).replace(/\b(pwd|ls|cd|mkdir|cp|dir|copy|cls|tasklist|taskkill|systeminfo|top|htop|free -h|df -h|ps aux|kill|read\(\)|open\(\)|write\(\)|close\(\)|Get-Process|resmon|eventvwr\.msc|pagefile\.sys|rm -r|del \/s|format|cd \.\.|dxdiag|msinfo32|mdsched|services\.msc|wait\(\)|signal\(\)|uname -a|hostnamectl|lsblk|grub-install|update-grub|sudo apt update|sudo apt upgrade|apt update|apt upgrade|smartctl|iotop|inxi|systemd|bootrec)(?=[\s.,;:)]|$)/g,'<code>$1</code>');

function mastery(tid){const qs=BANK.filter(q=>q.topic===tid);if(!qs.length)return 0;const ok=qs.filter(q=>S.stats[q.id]&&S.stats[q.id].last).length;return Math.round(ok/qs.length*100)}
function wrongList(){return BANK.filter(q=>S.stats[q.id]&&S.stats[q.id].last===false)}
function record(q,ok){const s=S.stats[q.id]||{ok:0,bad:0};ok?s.ok++:s.bad++;s.last=ok;S.stats[q.id]=s;save()}

function renderStats(){
  const dom=TOPICS.filter(t=>mastery(t.id)>=80).length;
  const right=BANK.filter(q=>S.stats[q.id]&&S.stats[q.id].last).length;
  $("#stats").innerHTML=`<div class="stat"><b>${dom}/${TOPICS.length}</b><span>temas dominados (80 % o más)</span></div><div class="stat"><b>${right}/${BANK.length}</b><span>preguntas acertadas</span></div><div class="stat"><b>${wrongList().length}</b><span>errores por repasar</span></div>`;
}
const TABS=[["aprender","Aprender"],["tarjetas","Tarjetas"],["practicar","Practicar"],["simulacro","Simulacro"],["errores","Repasar errores"]];
function renderTabs(){
  $("#tabs").innerHTML=TABS.map(([id,l])=>`<button role="tab" id="tab-${id}" aria-selected="${S.tab===id}" data-tab="${id}">${l}</button>`).join("");
  $("#tabs").querySelectorAll("button").forEach(b=>b.onclick=()=>go(b.dataset.tab));
}
let timerId=null;
function go(tab,opts){S.tab=tab;save();clearInterval(timerId);renderTabs();renderStats();VIEWS[tab](opts||{});toApp()}

/* ---------- Aprender ---------- */
let filterArea="all", filterUnit="all", openTopic=null;
const unitOpts=()=>Object.keys(UNITS).map(k=>`<option value="u${k}">${UNITS[k]}</option>`).join("");
const unitIn=(u,t)=>/^u\d/.test(t)&&t.split("+").includes("u"+u);
const inSel=(q,t)=>t==="all"||q.topic===t||q.area===t||unitIn(q.u,t);
function vAprender(){
  const list=TOPICS.filter(t=>(filterArea==="all"||t.a===filterArea)&&(filterUnit==="all"||String(t.u)===filterUnit));
  $("#view").innerHTML=`
  <h2>Aprende los temas</h2>
  <p class="lead">Lee cada tema, luego practícalo. El porcentaje sube a medida que aciertas sus preguntas.</p>
  <ol class="steps"><li><b>Aprender</b><br>lee los ${TOPICS.length} temas</li><li><b>Tarjetas</b><br>memoriza conceptos</li><li><b>Practicar</b><br>preguntas con explicación</li><li><b>Simulacro</b><br>20 preguntas con nota</li></ol>
  <div class="chips" role="group" aria-label="Filtrar por unidad">
    <button class="chip" aria-pressed="${filterUnit==="all"}" data-un="all">Todas las unidades</button>
    ${Object.keys(UNITS).map(k=>`<button class="chip" aria-pressed="${filterUnit===k}" data-un="${k}">${USHORT[k]}</button>`).join("")}
  </div>
  <div class="chips" role="group" aria-label="Filtrar por parte">
    <button class="chip" aria-pressed="${filterArea==="all"}" data-f="all">Teórico y práctico</button>
    <button class="chip" aria-pressed="${filterArea==="T"}" data-f="T">Teórico</button>
    <button class="chip" aria-pressed="${filterArea==="P"}" data-f="P">Práctico</button>
  </div>
  <div class="topics">${list.map(t=>{const m=mastery(t.id),open=openTopic===t.id;return `
    <div class="topic">
      <button class="topic-h" aria-expanded="${open}" data-t="${t.id}"><span class="tag ${t.a}">${t.a==="T"?"Teórico":"Práctico"}</span><span class="t">${esc(t.t)}<span style="display:block;color:var(--muted);font-size:13px;font-weight:400">${uName(t.u)}</span></span><span class="meter"><i><span style="width:${m}%"></span></i>${m}%</span></button>
      ${open?`<div class="topic-b">
        <p class="sum">${fmt(t.sum)}</p>
        <ul>${t.pts.map(p=>`<li>${fmt(p)}</li>`).join("")}</ul>
        <div class="tip warn"><b>Ojo en el parcial</b>${fmt(t.ojo)}</div>
        <div class="tip ex"><b>Ejemplo</b>${fmt(t.ex)}</div>
        <div class="row"><button class="btn primary" data-prac="${t.id}">Practicar este tema</button><button class="btn" data-cards="${t.id}">Ver sus tarjetas</button></div>
      </div>`:""}
    </div>`}).join("")}</div>`;
  $("#view").querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{filterArea=b.dataset.f;vAprender()});
  $("#view").querySelectorAll("[data-un]").forEach(b=>b.onclick=()=>{filterUnit=b.dataset.un;vAprender()});
  $("#view").querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{openTopic=openTopic===b.dataset.t?null:b.dataset.t;vAprender();const el=$(`[data-t="${b.dataset.t}"]`);if(el)el.focus()});
  $("#view").querySelectorAll("[data-prac]").forEach(b=>b.onclick=()=>startRun({mode:"practice",qs:shuffle(BANK.filter(q=>q.topic===b.dataset.prac)),title:TOPIC[b.dataset.prac].t}));
  $("#view").querySelectorAll("[data-cards]").forEach(b=>b.onclick=()=>go("tarjetas",{topic:b.dataset.cards}));
}

/* ---------- Tarjetas ---------- */
let deck=[],di=0,flipped=false,deckTopic="all";
function buildDeck(t){deckTopic=t;deck=shuffle(TOPICS.filter(x=>t==="all"||x.id===t||(t==="T"||t==="P")&&x.a===t||unitIn(x.u,t)).flatMap(x=>x.cards.map((c,i)=>({id:x.id+"-c"+i,topic:x.id,f:c[0],b:c[1]}))));di=0;flipped=false}
function vTarjetas(o){
  if(o.topic||!deck.length)buildDeck(o.topic||deckTopic);
  const known=deck.filter(c=>S.known[c.id]).length;
  const c=deck[di];
  $("#view").innerHTML=`
  <h2>Tarjetas de memoria</h2>
  <p class="lead">Lee la pregunta, intenta responder en voz alta y toca la tarjeta para ver la respuesta.</p>
  <div class="setup" style="margin-bottom:16px"><label class="f" for="deckSel">Tema
    <select id="deckSel"><option value="all">Todos los temas</option>${unitOpts()}<option value="T">Solo teórico</option><option value="P">Solo práctico</option>${TOPICS.map(t=>`<option value="${t.id}">${esc(t.t)}</option>`).join("")}</select></label></div>
  <div class="qhead"><span>Tarjeta ${di+1} de ${deck.length}</span><span>Las sé: ${known}/${deck.length}</span></div>
  <div class="bar"><span style="width:${(di+1)/deck.length*100}%"></span></div>
  <div class="flash-wrap"><button class="flashcard ${flipped?"flip":""}" id="card" aria-label="Voltear tarjeta">
    <div class="face"><span class="tag ${TOPIC[c.topic].a}">${esc(TOPIC[c.topic].t)}</span><div class="front-q">${fmt(c.f)}</div><span class="hint">Toca para ver la respuesta</span></div>
    <div class="face back"><span class="tag ${TOPIC[c.topic].a}">Respuesta</span><div style="font-size:19px">${fmt(c.b)}</div></div>
  </button></div>
  <div class="row" style="justify-content:space-between">
    <button class="btn ghost" id="prev" ${di===0?"disabled":""}>Anterior</button>
    <span class="row" style="margin:0"><button class="btn" id="dunno">Aún no la sé</button><button class="btn primary" id="know">La sé</button></span>
  </div>`;
  $("#deckSel").value=deckTopic;
  $("#deckSel").onchange=e=>{buildDeck(e.target.value);vTarjetas({})};
  $("#card").onclick=()=>{flipped=!flipped;$("#card").classList.toggle("flip",flipped)};
  const next=k=>{S.known[c.id]=k;save();if(di<deck.length-1){di++;flipped=false}else{deck=shuffle(deck.filter(x=>!S.known[x.id]));if(!deck.length)buildDeck(deckTopic);di=0;flipped=false}vTarjetas({})};
  $("#know").onclick=()=>next(true);$("#dunno").onclick=()=>next(false);
  $("#prev").onclick=()=>{di--;flipped=false;vTarjetas({})};
}

/* ---------- Practicar ---------- */
function vPracticar(){
  $("#view").innerHTML=`
  <h2>Practica con preguntas</h2>
  <p class="lead">Cada respuesta se corrige al instante con su explicación. Puedes responder con las teclas 1 a 4 y avanzar con Enter.</p>
  <div class="panel setup">
    <label class="f" for="pTopic">Qué practicar
      <select id="pTopic"><option value="all">Todo (teórico y práctico)</option>${unitOpts()}<option value="T">Solo la parte teórica</option><option value="P">Solo la parte práctica</option>${TOPICS.map(t=>`<option value="${t.id}">U${t.u} · ${t.a==="T"?"Teórico":"Práctico"}: ${esc(t.t)}</option>`).join("")}</select></label>
    <label class="f" for="pCount">Cuántas preguntas
      <select id="pCount"><option value="10">10</option><option value="20" selected>20</option><option value="999">Todas las disponibles</option></select></label>
    <label class="f" for="pWeak" style="grid-template-columns:auto 1fr;align-items:center;font-weight:400"><input type="checkbox" id="pWeak"> Priorizar las que aún no he acertado</label>
    <div><button class="btn primary" id="pGo">Empezar</button></div>
  </div>`;
  $("#pGo").onclick=()=>{
    const t=$("#pTopic").value,n=+$("#pCount").value;
    let qs=BANK.filter(q=>inSel(q,t));
    qs=shuffle(qs);
    if($("#pWeak").checked)qs.sort((a,b)=>(S.stats[a.id]&&S.stats[a.id].last?1:0)-(S.stats[b.id]&&S.stats[b.id].last?1:0));
    startRun({mode:"practice",qs:qs.slice(0,n),title:$("#pTopic").selectedOptions[0].text});
  };
}

/* ---------- Simulacro ---------- */
function vSimulacro(){
  $("#view").innerHTML=`
  <h2>Simulacro del parcial</h2>
  <p class="lead">20 preguntas al azar: 10 de la parte teórica y 10 de la parte práctica, como tu parcial. No verás si acertaste hasta el final. La nota es sobre 5.0.</p>
  <div class="panel">
    <div class="split" style="margin-top:0"><div class="stat"><b>10</b><span><span class="tag T">Teórico</span> conceptos</span></div><div class="stat"><b>10</b><span><span class="tag P">Práctico</span> casos y herramientas</span></div></div>
    <label class="f" for="sUnit" style="margin-bottom:14px">Temas del simulacro
      <select id="sUnit"><option value="u3+u4">Unidades 3 y 4: distribuidos y booteo</option>${[4,3,2,1].map(k=>`<option value="u${k}">${UNITS[k]}</option>`).join("")}<option value="u1+u2+u3+u4">Todas las unidades de sistemas operativos</option></select></label>
    <p style="margin:0 0 14px;color:var(--muted)">Un cronómetro mide tu tiempo para que sepas a qué ritmo vas.</p>
    <button class="btn primary" id="sGo">Empezar simulacro</button>
  </div>`;
  $("#sGo").onclick=()=>{
    const su=$("#sUnit").value;const pick=area=>{const byT={};shuffle(BANK.filter(q=>q.area===area&&inSel(q,su))).forEach(q=>(byT[q.topic]=byT[q.topic]||[]).push(q));const out=[];let r=0;while(out.length<10){let added=false;Object.values(byT).forEach(l=>{if(out.length<10&&l[r]){out.push(l[r]);added=true}});if(!added)break;r++}return out};
    startRun({mode:"exam",qs:shuffle(pick("T")).concat(shuffle(pick("P"))),title:su.includes("+")?"Simulacro":"Simulacro unidad "+su.slice(1)});
  };
}

/* ---------- Errores ---------- */
function vErrores(){
  const w=wrongList();
  $("#view").innerHTML=`
  <h2>Repasa tus errores</h2>
  <p class="lead">Aquí quedan las preguntas que fallaste la última vez que las respondiste. Cuando las aciertes, salen de la lista.</p>
  ${w.length?`<div class="panel"><p style="margin:0 0 12px"><b style="font-family:var(--f-display);font-size:22px">${w.length}</b> preguntas por repasar, de ${new Set(w.map(q=>q.topic)).size} temas.</p>
  <div class="row" style="margin:0 0 16px"><button class="btn primary" id="eGo">Repasar mis errores</button></div>
  <div class="review">${w.map(q=>`<div class="rv no"><span class="tag ${q.area}">${esc(TOPIC[q.topic].t)}</span><p>${fmt(q.q)}</p></div>`).join("")}</div></div>`
  :`<div class="panel empty">Todavía no tienes errores guardados. Cuando falles una pregunta en Practicar o en el Simulacro, aparecerá aquí.<div class="row" style="justify-content:center"><button class="btn primary" id="toPrac">Ir a practicar</button></div></div>`}
  <div class="row" style="margin-top:24px"><button class="btn ghost" id="reset">Borrar todo mi progreso</button></div><p id="resetMsg" style="color:var(--muted);font-size:14px"></p>`;
  if(w.length)$("#eGo").onclick=()=>startRun({mode:"practice",qs:shuffle(w),title:"Repaso de errores"});
  else $("#toPrac").onclick=()=>go("practicar");
  let armed=false;
  $("#reset").onclick=()=>{if(!armed){armed=true;$("#reset").textContent="Toca otra vez para confirmar";$("#resetMsg").textContent="Esto borra tus aciertos, errores y tarjetas en este navegador.";return}S.stats={};S.known={};save();go("errores")};
}

/* ---------- Motor de preguntas ---------- */
let R=null;
function startRun(o){R={mode:o.mode,title:o.title,qs:o.qs,i:0,ans:[],t0:Date.now()};
  if(!R.qs.length){$("#view").innerHTML=`<div class="panel empty">No hay preguntas para esa selección.</div>`;return}
  R.qs=R.qs.map(q=>q.k==="mc"?Object.assign({},q,{order:shuffle(q.o.map((_,i)=>i))}):q.k==="order"?Object.assign({},q,{pool:shuffle(q.items.map((_,i)=>i))}):q);
  clearInterval(timerId);if(R.mode==="exam")timerId=setInterval(()=>{const el=$("#tm");if(el)el.textContent=clock()},1000);
  showQ();
}
function clock(){const s=Math.floor((Date.now()-R.t0)/1000);return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function showQ(){
  const q=R.qs[R.i],n=R.qs.length;let state={done:false,pick:[]};
  const body=()=>{
    if(q.k==="mc")return `<div class="opts">${q.order.map((oi,j)=>`<button class="opt" data-oi="${oi}"><span class="k">${j+1}</span><span>${fmt(q.o[oi])}</span></button>`).join("")}</div>`;
    if(q.k==="order")return `<div class="order-pick" id="pick"></div><div class="order-pool" id="pool">${q.pool.map(ii=>`<button class="ord" data-ii="${ii}"><span class="n"></span><span>${fmt(q.items[ii])}</span></button>`).join("")}</div><div class="row"><button class="btn ghost" id="oReset">Reiniciar orden</button><button class="btn primary" id="oCheck" disabled>${R.mode==="exam"?"Guardar respuesta":"Comprobar"}</button></div>`;
    return `<form id="tf" autocomplete="off"><input type="text" id="tIn" placeholder="Escribe aquí tu respuesta" aria-label="Tu respuesta" spellcheck="false" style="font-family:var(--f-mono)"><p id="tErr" style="color:var(--bad);font-size:14px;margin:6px 0 0" hidden>Escribe una respuesta antes de continuar.</p><div class="row"><button class="btn primary" type="submit">${R.mode==="exam"?"Guardar respuesta":"Comprobar"}</button></div></form>`;
  };
  $("#view").innerHTML=`
  <div class="qhead"><span>${esc(R.title)} · Pregunta ${R.i+1} de ${n}</span>${R.mode==="exam"?`<span class="timer" id="tm">${clock()}</span>`:`<button class="btn ghost" id="quit" style="padding:4px 10px">Salir</button>`}</div>
  <div class="bar"><span style="width:${R.i/n*100}%"></span></div>
  <div class="panel">
    <div class="row" style="margin:0 0 10px"><span class="tag ${q.area}">${q.area==="T"?"Teórico":"Práctico"}</span><span style="color:var(--muted);font-size:14px">${esc(TOPIC[q.topic].t)}</span></div>
    ${q.c?`<div class="case"><b>Caso Soluciones Digitales S.A.S.:</b> un equipo administrativo se pone lento y se bloquea al tener abiertos un navegador con varias pestañas, una hoja de cálculo, un programa de facturación y una videollamada.</div>`:""}
    <p class="q">${fmt(q.q)}</p>
    ${body()}
    <div id="fb"></div>
  </div>`;
  if($("#quit"))$("#quit").onclick=()=>go(S.tab);
  const finish=(ok,given)=>{
    state.done=true;R.ans[R.i]={ok,given};record(q,ok);renderStats();
    if(R.mode==="exam"){next();return}
    $("#fb").innerHTML=`<div class="fb ${ok?"ok":"no"}"><strong>${ok?"Correcto":"Incorrecto"}</strong>${q.k==="text"&&!ok?`Respuesta esperada: <code>${esc(q.ans[0])}</code>. `:""}${q.k==="order"&&!ok?`Orden correcto: ${q.items.map((s,i)=>`${i+1}. ${fmt(s)}`).join(" · ")}. `:""}${fmt(q.e)}</div><div class="row"><button class="btn primary" id="nx">${R.i<n-1?"Siguiente":"Ver resultado"}</button></div>`;
    $("#nx").focus();$("#nx").onclick=next;
  };
  if(q.k==="mc"){
    const btns=[...$("#view").querySelectorAll(".opt")];
    btns.forEach(b=>b.onclick=()=>{if(state.done)return;const oi=+b.dataset.oi,ok=oi===q.a;
      btns.forEach(x=>{x.disabled=true;if(R.mode!=="exam"){if(+x.dataset.oi===q.a)x.classList.add("right");else if(x===b)x.classList.add("wrong")}});
      if(R.mode==="exam")b.classList.add("sel");finish(ok,q.o[oi])});
  }else if(q.k==="order"){
    const pick=$("#pick"),pool=$("#pool");
    const upd=()=>{[...pick.children].forEach((b,i)=>b.querySelector(".n").textContent=i+1);[...pool.children].forEach(b=>b.querySelector(".n").textContent="");$("#oCheck").disabled=pool.children.length>0};
    [...pool.children].forEach(b=>b.onclick=()=>{if(state.done)return;(b.parentNode===pool?pick:pool).appendChild(b);upd()});
    $("#oReset").onclick=()=>{if(state.done)return;q.pool.forEach(ii=>pool.appendChild($(`[data-ii="${ii}"]`)));upd()};
    $("#oCheck").onclick=()=>{const seq=[...pick.children].map(b=>+b.dataset.ii);const ok=seq.every((v,i)=>v===i);
      [...pick.children].forEach((b,i)=>{b.disabled=true;if(R.mode!=="exam")b.style.borderColor=+b.dataset.ii===i?"var(--ok)":"var(--bad)"});$("#oCheck").disabled=true;$("#oReset").disabled=true;
      finish(ok,seq.map(i=>q.items[i]).join(" → "))};
  }else{
    const inp=$("#tIn");inp.focus();inp.oninput=()=>{$("#tErr").hidden=true};
    $("#tf").onsubmit=e=>{e.preventDefault();if(state.done)return;const v=inp.value;if(!v.trim()){$("#tErr").hidden=false;return}
      const ok=q.ans.some(a=>norm(a)===norm(v));inp.disabled=true;if(R.mode!=="exam")inp.style.borderColor=ok?"var(--ok)":"var(--bad)";finish(ok,v)};
  }
}
function next(){if(R.i<R.qs.length-1){R.i++;showQ();toApp()}else showResult()}
function showResult(){
  clearInterval(timerId);
  const n=R.qs.length,ok=R.ans.filter(a=>a&&a.ok).length;
  const grade=(ok/n*5).toFixed(1);
  const part=a=>{const idx=R.qs.map((q,i)=>i).filter(i=>R.qs[i].area===a);return idx.length?`${idx.filter(i=>R.ans[i]&&R.ans[i].ok).length}/${idx.length}`:"—"};
  const msg=grade>=4.5?"Excelente. Estás listo; repasa solo los detalles que fallaste.":grade>=3.5?"Vas bien. Repasa los temas de las preguntas que fallaste.":grade>=3?"Pasarías, pero justo. Vuelve a Aprender en los temas que fallaste.":"Todavía hay vacíos. Lee los temas en Aprender y vuelve a practicar.";
  $("#view").innerHTML=`
  <h2>${esc(R.title)}: resultado</h2>
  <div class="panel">
    <div class="row" style="align-items:flex-end;gap:18px;margin:0"><div><div class="result-big">${R.mode==="exam"?grade:ok+"/"+n}</div><div style="color:var(--muted)">${R.mode==="exam"?"nota sobre 5.0":"aciertos"}</div></div>
    <div style="color:var(--muted);font-size:15px">${ok} de ${n} correctas${R.mode==="exam"?` · tiempo ${clock()}`:""}</div></div>
    <div class="split"><div class="stat"><b>${part("T")}</b><span><span class="tag T">Teórico</span></span></div><div class="stat"><b>${part("P")}</b><span><span class="tag P">Práctico</span></span></div></div>
    <p style="margin:0">${msg}</p>
    <div class="row"><button class="btn primary" id="again">${R.mode==="exam"?"Otro simulacro":"Practicar de nuevo"}</button>${wrongList().length?`<button class="btn" id="toErr">Repasar errores</button>`:""}</div>
  </div>
  <h2 style="margin-top:26px;font-size:20px">Revisión pregunta por pregunta</h2>
  <div class="review">${R.qs.map((q,i)=>{const a=R.ans[i]||{};const right=q.k==="mc"?q.o[q.a]:q.k==="text"?q.ans[0]:q.items.join(" → ");return `<div class="rv ${a.ok?"":"no"}"><span class="tag ${q.area}">${esc(TOPIC[q.topic].t)}</span><p><b>${i+1}.</b> ${fmt(q.q)}</p>${a.ok?"":`<p class="small">Tu respuesta: ${esc(a.given||"sin responder")}</p>`}<p class="small"><b>Correcta:</b> ${fmt(right)}</p><p class="small">${fmt(q.e)}</p></div>`}).join("")}</div>`;
  $("#again").onclick=()=>R.mode==="exam"?go("simulacro"):go(S.tab==="errores"?"errores":S.tab==="aprender"?"aprender":"practicar");
  if($("#toErr"))$("#toErr").onclick=()=>go("errores");
  renderStats();
}
document.addEventListener("keydown",e=>{
  if(!R||!$(".opts")&&!$("#nx"))return;
  if(e.target.tagName==="INPUT"||e.target.tagName==="SELECT")return;
  if(/^[1-4]$/.test(e.key)){const b=$(".opts")&&$(".opts").children[+e.key-1];if(b&&!b.disabled)b.click()}
  if(e.key==="Enter"&&$("#nx")&&document.activeElement!==$("#nx")){e.preventDefault();$("#nx").click()}
});

const VIEWS={aprender:vAprender,tarjetas:vTarjetas,practicar:vPracticar,simulacro:vSimulacro,errores:vErrores};
if(!VIEWS[S.tab])S.tab="aprender";
go(S.tab);
