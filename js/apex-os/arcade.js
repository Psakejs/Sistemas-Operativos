// APEX OS · Arcade: menú, juegos retro (carpeta juegos/) y arranque de los clásicos
// ===== Arcade (juegos locales mejorados) =====
const arcadeCanvas = document.getElementById('arcade-canvas');
const arcadeMenu = document.getElementById('arcade-menu');
const arcadeInfo = document.getElementById('arcade-info');
const arcadeScore = document.getElementById('arcade-score');
let arcadeGame = null;
let arcadeLoop = null;
let keys = {};

const retroFrame = document.getElementById('retro-frame');
const arcadeBack = document.getElementById('arcade-back');

// Juegos retro: páginas dentro de la carpeta juegos/ que se cargan en un iframe
const RETRO = {
  freedoom:   { url: 'juegos/dos/?juego=freedoom', titulo: 'DOOM (Freedoom)',
                info: 'Flechas: moverse · Ctrl: disparar · Espacio: puertas · Esc: menú' },
  zork:       { url: 'juegos/zork/?juego=zork1', titulo: 'Zork',
                info: 'Escribe órdenes en inglés: look, north, take lamp, inventory' },
  digger:     { url: 'juegos/dos/?juego=digger', titulo: 'Digger',
                info: 'Flechas: moverse · F1: disparar' },
  buscaminas: { url: 'juegos/buscaminas/', titulo: 'Buscaminas',
                info: 'Clic: descubrir · Clic derecho: bandera' },
  raycaster:  { url: 'juegos/raycaster/', titulo: 'Raycaster',
                info: 'W/S o ↑/↓: avanzar · ←/→: girar · A/D: paso lateral' },
};

function showMenu() {
  if (arcadeLoop) cancelAnimationFrame(arcadeLoop);
  arcadeCanvas.style.display = 'none';
  // Descargar el juego retro para liberar memoria y detener su sonido
  if (retroFrame.getAttribute('src') && retroFrame.getAttribute('src') !== 'about:blank') retroFrame.src = 'about:blank';
  retroFrame.style.display = 'none';
  arcadeBack.hidden = true;
  arcadeScore.style.display = '';
  arcadeMenu.style.display = 'flex';
  arcadeInfo.textContent = 'Selecciona un juego';
  arcadeScore.textContent = 'Score: 0';
  arcadeGame = null;
  keys = {};
}

function openRetro(id) {
  const juego = RETRO[id];
  if (!juego) return;
  if (arcadeLoop) cancelAnimationFrame(arcadeLoop);
  arcadeGame = null;
  arcadeMenu.style.display = 'none';
  arcadeCanvas.style.display = 'none';
  arcadeScore.style.display = 'none';
  arcadeBack.hidden = false;
  arcadeInfo.textContent = juego.titulo + ' · ' + juego.info;
  // Agrandar la ventana para que el juego se vea mejor (sin pasarse de la pantalla)
  const w = document.getElementById('doom');
  if (!w.classList.contains('max')) {
    const ancho = Math.min(960, innerWidth - 28), alto = Math.min(720, innerHeight - 80);
    w.style.width = ancho + 'px';
    w.style.height = alto + 'px';
    w.style.left = Math.max(8, Math.min(w.offsetLeft, innerWidth - ancho - 8)) + 'px';
    w.style.top = Math.max(8, Math.min(w.offsetTop, innerHeight - alto - 62)) + 'px';
  }
  retroFrame.style.display = 'block';
  retroFrame.src = juego.url;
  retroFrame.onload = () => { try { retroFrame.contentWindow.focus(); } catch (e) {} };
}

document.querySelectorAll('[data-retro]').forEach(b => b.addEventListener('click', () => openRetro(b.dataset.retro)));
document.querySelectorAll('[data-launch]').forEach(b => b.addEventListener('click', () => { openWin('doom'); openRetro(b.dataset.launch); }));
arcadeBack.addEventListener('click', showMenu);

function startArcade(game) {
  arcadeMenu.style.display = 'none';
  arcadeBack.hidden = false;
  arcadeCanvas.style.display = 'block';
  const rect = arcadeCanvas.parentElement.getBoundingClientRect();
  arcadeCanvas.width = Math.max(400, rect.width);
  arcadeCanvas.height = Math.max(300, rect.height - 36);
  arcadeGame = game;
  if (game === 'snake') initSnake();
  else if (game === 'pong') initPong();
  else if (game === 'breakout') initBreakout();
  else if (game === 'invaders') initInvaders();
  else if (game === 'asteroids') initAsteroids();
}

document.querySelectorAll('.arcade-btn').forEach(btn => {
  btn.onclick = () => startArcade(btn.dataset.game);
});

document.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; });
document.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

