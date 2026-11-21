// APEX OS · Terminal: sistema de archivos simulado y comandos
// Terminal
const form = document.getElementById('term-form');
const input = document.getElementById('term-input');
const out = document.getElementById('term-output');
const promptEl = document.getElementById('term-prompt');
let cwd = '/home/apex';

const fs = {
  '/home/apex': ['Desktop', 'Documents', 'Games', 'Projects', '.bashrc'],
  '/home/apex/Desktop': ['readme.txt'],
  '/home/apex/Documents': ['notas.txt'],
  '/home/apex/Games': ['doom', 'zork', 'digger', 'buscaminas', 'raycaster', 'arcade'],
  '/home/apex/Projects': ['apex-os.html']
};

function normalize(path) {
  const parts = path.split('/').filter(Boolean);
  const stack = [];
  for (const p of parts) {
    if (p === '..') stack.pop();
    else if (p !== '.') stack.push(p);
  }
  return '/' + stack.join('/');
}

function resolvePath(p) {
  if (!p || p === '~' || p === '') return '/home/apex';
  if (p === '..') {
    const parts = cwd.split('/').filter(Boolean);
    parts.pop();
    return '/' + parts.join('/') || '/';
  }
  if (p.startsWith('/')) return normalize(p);
  return normalize(cwd + '/' + p);
}

function updatePrompt() {
  const display = cwd === '/home/apex' ? '~' : cwd.replace('/home/apex', '~');
  promptEl.textContent = 'apex@desktop:' + display + '$';
}

function appendOutput(text) {
  if (!text) return;
  const div = document.createElement('div');
  div.className = 'dim';
  div.style.whiteSpace = 'pre-wrap';
  div.textContent = text;
  out.appendChild(div);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const raw = input.value.trim();
  if (!raw) return;

  const line = document.createElement('div');
  const displayCwd = cwd === '/home/apex' ? '~' : cwd.replace('/home/apex', '~');
  line.textContent = 'apex@desktop:' + displayCwd + '$ ' + raw;
  out.appendChild(line);

  const parts = raw.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  let outText = '';

  switch (cmd) {
    case 'help':
      outText = `Comandos disponibles:
  help              Muestra esta ayuda
  ls [dir]          Lista archivos
  cd [dir]          Cambia de directorio
  pwd               Directorio actual
  cat <archivo>     Muestra contenido
  echo <texto>      Imprime texto
  whoami            Usuario actual
  uname -a          Info del sistema
  free              Memoria
  df                Discos
  ps                Procesos
  date              Fecha y hora
  clear             Limpia pantalla
  neofetch          Info del sistema
  games             Lista los juegos instalados
  launch <juego>    Abre un juego (doom, zork, digger,
                    buscaminas, raycaster, arcade)
  browser           Abre navegador`;
      break;

    case 'ls': {
      const target = args[0] ? resolvePath(args[0]) : cwd;
      const items = fs[target];
      if (items === undefined) outText = `ls: cannot access '${args[0] || '.'}': No such file or directory`;
      else outText = items.length ? items.join('  ') : '';
      break;
    }

    case 'cd': {
      if (!args[0] || args[0] === '~') {
        cwd = '/home/apex';
      } else {
        const target = resolvePath(args[0]);
        if (fs[target] !== undefined) {
          cwd = target;
        } else {
          outText = `bash: cd: ${args[0]}: No such file or directory`;
        }
      }
      updatePrompt();
      break;
    }

    case 'pwd':
      outText = cwd;
      break;

    case 'cat':
      if (!args[0]) outText = 'cat: missing file operand';
      else {
        const file = args[0].split('/').pop();
        if (file === 'readme.txt') outText = 'APEX OS — Personal Desktop Environment\nDual boot demo · Use with caution on real hardware.';
        else if (file === 'notas.txt') outText = 'Notas del proyecto Sistemas Operativos.\n- Lubuntu 26.04 dual boot\n- GRUB configurado\n- HDD con sectores pendientes';
        else if (file === '.bashrc') outText = '# ~/.bashrc\nalias ll="ls -la"\nexport PS1="apex@desktop:\\w\\$ "';
        else outText = `cat: ${args[0]}: No such file or directory`;
      }
      break;

    case 'echo':
      outText = args.join(' ');
      break;

    case 'whoami':
      outText = 'apex';
      break;

    case 'uname':
      outText = args.includes('-a') ? 'APEX OS 0.9.5 Web x86_64 GNU/Linux' : 'APEX';
      break;

    case 'free':
      outText = `              total        used        free
Mem:          4096        1840        2256
Swap:         2048           0        2048`;
      break;

    case 'df':
      outText = `Filesystem     1K-blocks     Used Available Use% Mounted on
/dev/sda7       103809024 12582912  85934080  13% /
/dev/sda2          102400    28672     73728  28% /boot/efi`;
      break;

    case 'ps':
      outText = `  PID TTY          TIME CMD
    1 ?        00:00:01 init
  412 pts/0    00:00:00 bash
  891 pts/0    00:00:00 apex-desktop`;
      break;

    case 'date':
      outText = new Date().toString();
      break;

    case 'neofetch':
      outText = `  /\\_/\\     APEX OS 0.9.5
 ( o.o )    Kernel: Web Runtime
  > ^ <     Shell: Apex Shell
            User: apex
            Uptime: 0m
            Memory: 1840MiB / 4096MiB`;
      break;

    case 'clear':
      out.innerHTML = '';
      input.value = '';
      return;

    case 'games':
      outText = `Juegos instalados en /home/apex/Games:
  doom         DOOM (Freedoom + FastDoom)    shooter 3D · DOS
  zork         Zork I, II y III              aventura de texto
  digger       Digger (1983)                 arcade · DOS
  buscaminas   Buscaminas                    puzzle
  raycaster    Raycaster                     laberinto 3D
  arcade       Snake, Pong, Breakout, Invaders, Asteroids
Usa: launch <juego>`;
      break;

    case 'launch': {
      const alias = { doom: 'freedoom', freedoom: 'freedoom', zork: 'zork', digger: 'digger',
                      buscaminas: 'buscaminas', minas: 'buscaminas', raycaster: 'raycaster' };
      const t = (args[0] || '').toLowerCase();
      if (t === 'arcade') {
        openWin('doom');
        outText = 'Abriendo Arcade...';
      } else if (alias[t]) {
        openWin('doom');
        openRetro(alias[t]);
        outText = t === 'doom' ? 'Cargando DOOM... (DOSBox + FastDoom + Freedoom)' : `Abriendo ${RETRO[alias[t]].titulo}...`;
      } else outText = `launch: unknown target '${args[0] || ''}'. Escribe "games" para ver la lista.`;
      break;
    }

    case 'browser':
      openWin('browser');
      outText = 'Abriendo navegador...';
      break;

    default:
      outText = `bash: ${cmd}: command not found`;
  }

  appendOutput(outText);
  input.value = '';
  const term = document.getElementById('term');
  term.scrollTop = term.scrollHeight;
});

