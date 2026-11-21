// APEX OS · Pantalla de arranque (BIOS) e inicio de sesión
// ===== Boot / BIOS sequence =====
const bootScreen = document.getElementById('boot-screen');
const bootLog = document.getElementById('boot-log');
const bootMessages = [
  "APEX BIOS v0.9.5 · Copyright 2026",
  "CPU: Intel Core i7-8565U @ 1.80GHz",
  "Memory Test: 4096 MB OK",
  "Detecting storage... WDC WD10SPZX 1TB",
  "UEFI Boot Manager initialized",
  "Loading APEX OS kernel...",
  "Starting desktop environment"
];
let bootIndex = 0;
function addBootLine() {
  if (bootIndex >= bootMessages.length) return;
  const div = document.createElement('div');
  div.textContent = bootMessages[bootIndex];
  div.style.animationDelay = '0s';
  bootLog.appendChild(div);
  bootIndex++;
  if (bootIndex < bootMessages.length) {
    setTimeout(addBootLine, 380);
  }
}
addBootLine();

let bootDone = false;
function finishBoot() {
  // Solo una vez: si no, un clic o tecla posterior (por ejemplo en el login) volvía a mostrar el login
  if (bootDone) return;
  bootDone = true;
  document.removeEventListener('keydown', finishBoot);
  document.removeEventListener('click', finishBoot);
  bootScreen.classList.add('hide');
  setTimeout(() => {
    bootScreen.style.display = 'none';
    document.getElementById('login-screen').classList.add('show');
    document.getElementById('login-user').focus();
  }, 600);
}

setTimeout(finishBoot, 3200);
document.addEventListener('keydown', finishBoot, { once: true });
document.addEventListener('click', finishBoot, { once: true });

// Login
const VALID_USER = 'apex';
const VALID_PASS = 'apex';
const loginBtn = document.getElementById('login-btn');
const loginUser = document.getElementById('login-user');
const loginPass = document.getElementById('login-pass');
const loginError = document.getElementById('login-error');
const loginScreen = document.getElementById('login-screen');

function tryLogin() {
  const u = loginUser.value.trim();
  const p = loginPass.value;
  if (u === VALID_USER && p === VALID_PASS) {
    loginError.textContent = '';
    loginScreen.classList.remove('show');
    document.getElementById('desktop').classList.remove('hidden');
    openWin('about');
  } else {
    loginError.textContent = 'Usuario o contraseña incorrectos';
    loginPass.value = '';
    loginPass.focus();
  }
}
loginBtn.onclick = tryLogin;
loginPass.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
loginUser.addEventListener('keydown', e => { if (e.key === 'Enter') loginPass.focus(); });

// openWin('about'); removed — now starts after login
