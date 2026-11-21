// APEX OS · Arcade: Snake, Pong, Breakout, Space Invaders y Asteroids
// ---- SNAKE (clásico con cuadrícula) ----
let snake, dir, food, snakeScore, snakeSpeed, gridSize;
function initSnake() {
  const ctx = arcadeCanvas.getContext('2d');
  gridSize = 18;
  const cols = Math.floor(arcadeCanvas.width / gridSize);
  const rows = Math.floor(arcadeCanvas.height / gridSize);
  snake = [{x: Math.floor(cols/2), y: Math.floor(rows/2)}];
  dir = {x: 1, y: 0};
  snakeScore = 0;
  snakeSpeed = 110;
  placeFood(cols, rows);
  arcadeInfo.textContent = 'Snake · Flechas/WASD · Llega a 200 para ganar · R reinicia';
  arcadeScore.textContent = 'Score: 0';
  let last = 0;
  function loop(t) {
    if (arcadeGame !== 'snake') return;
    if (t - last > snakeSpeed) {
      last = t;
      const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
      if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows || snake.some(s => s.x === head.x && s.y === head.y)) {
        arcadeInfo.textContent = 'Game Over · R para reiniciar';
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        snakeScore += 10;
        arcadeScore.textContent = 'Score: ' + snakeScore;
        if (snakeScore >= 200) {
          arcadeInfo.textContent = '¡GANASTE! · R para reiniciar';
          return;
        }
        placeFood(cols, rows);
        snakeSpeed = Math.max(55, snakeSpeed - 1.5);
      } else snake.pop();
    }
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, arcadeCanvas.width, arcadeCanvas.height);
    // grid sutil
    ctx.strokeStyle = '#1a1a1e';
    ctx.lineWidth = 1;
    for (let x = 0; x < cols; x++) for (let y = 0; y < rows; y++) {
      ctx.strokeRect(x*gridSize, y*gridSize, gridSize, gridSize);
    }
    ctx.fillStyle = '#D00000';
    ctx.fillRect(food.x*gridSize + 1, food.y*gridSize + 1, gridSize-2, gridSize-2);
    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? '#ff3333' : '#F3F3F4';
      ctx.fillRect(s.x*gridSize + 1, s.y*gridSize + 1, gridSize-2, gridSize-2);
    });
    arcadeLoop = requestAnimationFrame(loop);
  }
  function placeFood(cols, rows) {
    do {
      food = {x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)};
    } while (snake.some(s => s.x === food.x && s.y === food.y));
  }
  arcadeLoop = requestAnimationFrame(loop);
}

// ---- PONG ----
let pongBall, pongPaddle, pongAI, pongScore;
function initPong() {
  const ctx = arcadeCanvas.getContext('2d');
  pongBall = {x: arcadeCanvas.width/2, y: arcadeCanvas.height/2, vx: 5, vy: 3};
  pongPaddle = {x: 30, y: arcadeCanvas.height/2 - 45, w: 12, h: 90};
  pongAI = {x: arcadeCanvas.width - 42, y: arcadeCanvas.height/2 - 45, w: 12, h: 90};
  pongScore = 0;
  arcadeInfo.textContent = 'Pong · Flechas/W-S o ratón · 15 puntos para ganar · R reinicia';
  arcadeScore.textContent = 'Score: 0';
  function loop() {
    if (arcadeGame !== 'pong') return;
    pongBall.x += pongBall.vx;
    pongBall.y += pongBall.vy;
    if (pongBall.y < 10 || pongBall.y > arcadeCanvas.height - 10) pongBall.vy *= -1;
    if (pongBall.x < pongPaddle.x + pongPaddle.w && pongBall.y > pongPaddle.y && pongBall.y < pongPaddle.y + pongPaddle.h) {
      pongBall.vx = Math.abs(pongBall.vx) + 0.15;
      pongScore++;
      arcadeScore.textContent = 'Score: ' + pongScore;
      if (pongScore >= 15) { arcadeInfo.textContent = '¡GANASTE! · R para reiniciar'; return; }
    }
    if (pongBall.x > pongAI.x && pongBall.y > pongAI.y && pongBall.y < pongAI.y + pongAI.h) pongBall.vx = -Math.abs(pongBall.vx);
    if (pongBall.x < 0 || pongBall.x > arcadeCanvas.width) {
      arcadeInfo.textContent = 'Game Over · R para reiniciar';
      return;
    }
    if (pongAI.y + pongAI.h/2 < pongBall.y) pongAI.y += 3.2;
    if (pongAI.y + pongAI.h/2 > pongBall.y) pongAI.y -= 3.2;
    pongAI.y = Math.max(0, Math.min(arcadeCanvas.height - pongAI.h, pongAI.y));
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, arcadeCanvas.width, arcadeCanvas.height);
    ctx.fillStyle = '#F3F3F4';
    ctx.fillRect(pongPaddle.x, pongPaddle.y, pongPaddle.w, pongPaddle.h);
    ctx.fillRect(pongAI.x, pongAI.y, pongAI.w, pongAI.h);
    ctx.fillStyle = '#D00000';
    ctx.beginPath();
    ctx.arc(pongBall.x, pongBall.y, 9, 0, Math.PI*2);
    ctx.fill();
    arcadeLoop = requestAnimationFrame(loop);
  }
  arcadeLoop = requestAnimationFrame(loop);
}

// ---- BREAKOUT ----
let bricks, ball, paddle, breakScore, totalBricks;
function initBreakout() {
  const ctx = arcadeCanvas.getContext('2d');
  paddle = {x: arcadeCanvas.width/2 - 55, y: arcadeCanvas.height - 28, w: 110, h: 12};
  ball = {x: arcadeCanvas.width/2, y: arcadeCanvas.height - 50, vx: 3.5, vy: -4.5};
  breakScore = 0;
  bricks = [];
  const cols = 9, rows = 5;
  const bw = 58, bh = 22, gap = 6;
  const startX = (arcadeCanvas.width - (cols*(bw+gap))) / 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      bricks.push({x: startX + c*(bw+gap), y: 40 + r*(bh+gap), w: bw, h: bh, alive: true});
    }
  }
  totalBricks = bricks.length;
  arcadeInfo.textContent = 'Breakout · Flechas/A-D o ratón · Rompe todos · R reinicia';
  arcadeScore.textContent = 'Score: 0';
  function loop() {
    if (arcadeGame !== 'breakout') return;
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.x < 8 || ball.x > arcadeCanvas.width - 8) ball.vx *= -1;
    if (ball.y < 8) ball.vy *= -1;
    if (ball.y > arcadeCanvas.height) {
      arcadeInfo.textContent = 'Game Over · R para reiniciar';
      return;
    }
    if (ball.y > paddle.y - 8 && ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
      ball.vy = -Math.abs(ball.vy);
      ball.vx += (ball.x - (paddle.x + paddle.w/2)) * 0.04;
    }
    let alive = 0;
    bricks.forEach(b => {
      if (!b.alive) return;
      alive++;
      if (ball.x > b.x && ball.x < b.x + b.w && ball.y > b.y && ball.y < b.y + b.h) {
        b.alive = false;
        ball.vy *= -1;
        breakScore += 10;
        arcadeScore.textContent = 'Score: ' + breakScore;
      }
    });
    if (alive === 0) {
      arcadeInfo.textContent = '¡GANASTE! · R para reiniciar';
      return;
    }
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, arcadeCanvas.width, arcadeCanvas.height);
    bricks.forEach(b => {
      if (!b.alive) return;
      ctx.fillStyle = '#D00000';
      ctx.fillRect(b.x, b.y, b.w, b.h);
    });
    ctx.fillStyle = '#F3F3F4';
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#D00000';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 7, 0, Math.PI*2);
    ctx.fill();
    arcadeLoop = requestAnimationFrame(loop);
  }
  arcadeLoop = requestAnimationFrame(loop);
}

// ---- SPACE INVADERS (simple) ----
let invaders, invDir, invSpeed, player, invBullets, playerBullets, invScore, invWave;
function initInvaders() {
  const ctx = arcadeCanvas.getContext('2d');
  invWave = 1;
  invScore = 0;
  player = {x: arcadeCanvas.width/2 - 18, y: arcadeCanvas.height - 40, w: 36, h: 16};
  invBullets = [];
  playerBullets = [];
  spawnInvaders();
  arcadeInfo.textContent = 'Invaders · Flechas/A-D + Espacio · Elimina la oleada · R reinicia';
  arcadeScore.textContent = 'Score: 0';
  function spawnInvaders() {
    invaders = [];
    invDir = 1;
    invSpeed = 0.6 + invWave * 0.15;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 8; c++) {
        invaders.push({x: 40 + c*55, y: 30 + r*36, w: 28, h: 20, alive: true});
      }
    }
  }
  function loop() {
    if (arcadeGame !== 'invaders') return;
    // player
    if (keys['arrowleft'] || keys['a']) player.x = Math.max(0, player.x - 5);
    if (keys['arrowright'] || keys['d']) player.x = Math.min(arcadeCanvas.width - player.w, player.x + 5);
    if (keys[' '] && playerBullets.length < 3) {
      playerBullets.push({x: player.x + player.w/2 - 2, y: player.y, vy: -7});
      keys[' '] = false;
    }
    // invaders move
    let edge = false;
    invaders.forEach(inv => {
      if (!inv.alive) return;
      inv.x += invDir * invSpeed;
      if (inv.x < 10 || inv.x + inv.w > arcadeCanvas.width - 10) edge = true;
      if (Math.random() < 0.002) invBullets.push({x: inv.x + inv.w/2, y: inv.y + inv.h, vy: 3});
    });
    if (edge) {
      invDir *= -1;
      invaders.forEach(inv => { if (inv.alive) inv.y += 12; });
    }
    // bullets
    playerBullets.forEach(b => b.y += b.vy);
    invBullets.forEach(b => b.y += b.vy);
    playerBullets = playerBullets.filter(b => b.y > -10);
    invBullets = invBullets.filter(b => b.y < arcadeCanvas.height + 10);
    // collisions
    playerBullets.forEach(b => {
      invaders.forEach(inv => {
        if (!inv.alive) return;
        if (b.x > inv.x && b.x < inv.x + inv.w && b.y > inv.y && b.y < inv.y + inv.h) {
          inv.alive = false;
          b.y = -999;
          invScore += 10;
          arcadeScore.textContent = 'Score: ' + invScore;
        }
      });
    });
    invBullets.forEach(b => {
      if (b.x > player.x && b.x < player.x + player.w && b.y > player.y && b.y < player.y + player.h) {
        arcadeInfo.textContent = 'Game Over · R para reiniciar';
        arcadeGame = null;
      }
    });
    const alive = invaders.filter(i => i.alive).length;
    if (alive === 0) {
      invWave++;
      invScore += 50;
      arcadeScore.textContent = 'Score: ' + invScore;
      if (invWave > 3) {
        arcadeInfo.textContent = '¡GANASTE! · R para reiniciar';
        return;
      }
      spawnInvaders();
    }
    if (invaders.some(i => i.alive && i.y + i.h > player.y)) {
      arcadeInfo.textContent = 'Game Over · R para reiniciar';
      return;
    }
    // draw
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, arcadeCanvas.width, arcadeCanvas.height);
    ctx.fillStyle = '#F3F3F4';
    ctx.fillRect(player.x, player.y, player.w, player.h);
    invaders.forEach(inv => {
      if (!inv.alive) return;
      ctx.fillStyle = '#D00000';
      ctx.fillRect(inv.x, inv.y, inv.w, inv.h);
    });
    ctx.fillStyle = '#ff6666';
    playerBullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 10));
    ctx.fillStyle = '#aaa';
    invBullets.forEach(b => ctx.fillRect(b.x-2, b.y, 4, 10));
    arcadeLoop = requestAnimationFrame(loop);
  }
  arcadeLoop = requestAnimationFrame(loop);
}

// ---- ASTEROIDS (simple) ----
let ship, asteroids, astBullets, astScore, astAngle;
function initAsteroids() {
  const ctx = arcadeCanvas.getContext('2d');
  ship = {x: arcadeCanvas.width/2, y: arcadeCanvas.height/2, vx: 0, vy: 0, angle: 0};
  asteroids = [];
  astBullets = [];
  astScore = 0;
  for (let i = 0; i < 6; i++) spawnAsteroid(true);
  arcadeInfo.textContent = 'Asteroids · Flechas rotar/avanzar · Espacio dispara · 150 pts gana · R reinicia';
  arcadeScore.textContent = 'Score: 0';
  function spawnAsteroid(big) {
    const size = big ? 28 + Math.random()*16 : 14 + Math.random()*8;
    asteroids.push({
      x: Math.random()*arcadeCanvas.width,
      y: Math.random()*arcadeCanvas.height,
      vx: (Math.random()-0.5)*2.5,
      vy: (Math.random()-0.5)*2.5,
      r: size,
      big
    });
  }
  function loop() {
    if (arcadeGame !== 'asteroids') return;
    if (keys['arrowleft'] || keys['a']) ship.angle -= 0.07;
    if (keys['arrowright'] || keys['d']) ship.angle += 0.07;
    if (keys['arrowup'] || keys['w']) {
      ship.vx += Math.cos(ship.angle) * 0.12;
      ship.vy += Math.sin(ship.angle) * 0.12;
    }
    ship.x = (ship.x + ship.vx + arcadeCanvas.width) % arcadeCanvas.width;
    ship.y = (ship.y + ship.vy + arcadeCanvas.height) % arcadeCanvas.height;
    ship.vx *= 0.99;
    ship.vy *= 0.99;
    if (keys[' '] && astBullets.length < 5) {
      astBullets.push({
        x: ship.x + Math.cos(ship.angle)*18,
        y: ship.y + Math.sin(ship.angle)*18,
        vx: Math.cos(ship.angle)*6 + ship.vx,
        vy: Math.sin(ship.angle)*6 + ship.vy
      });
      keys[' '] = false;
    }
    astBullets.forEach(b => { b.x += b.vx; b.y += b.vy; });
    astBullets = astBullets.filter(b => b.x > -20 && b.x < arcadeCanvas.width+20 && b.y > -20 && b.y < arcadeCanvas.height+20);
    asteroids.forEach(a => { a.x = (a.x + a.vx + arcadeCanvas.width) % arcadeCanvas.width; a.y = (a.y + a.vy + arcadeCanvas.height) % arcadeCanvas.height; });
    // collisions
    astBullets.forEach(b => {
      asteroids.forEach(a => {
        if (Math.hypot(b.x - a.x, b.y - a.y) < a.r) {
          b.x = -999;
          a.r = 0;
          astScore += a.big ? 15 : 25;
          arcadeScore.textContent = 'Score: ' + astScore;
          if (!a.big && Math.random() < 0.4) spawnAsteroid(false);
        }
      });
    });
    asteroids = asteroids.filter(a => a.r > 8);
    if (asteroids.some(a => Math.hypot(a.x - ship.x, a.y - ship.y) < a.r + 10)) {
      arcadeInfo.textContent = 'Game Over · R para reiniciar';
      return;
    }
    if (astScore >= 150) {
      arcadeInfo.textContent = '¡GANASTE! · R para reiniciar';
      return;
    }
    if (asteroids.length < 4 && Math.random() < 0.01) spawnAsteroid(true);
    // draw
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, arcadeCanvas.width, arcadeCanvas.height);
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    ctx.fillStyle = '#F3F3F4';
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(-10, -8);
    ctx.lineTo(-10, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#D00000';
    asteroids.forEach(a => {
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.fillStyle = '#ff6666';
    astBullets.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3, 0, Math.PI*2);
      ctx.fill();
    });
    arcadeLoop = requestAnimationFrame(loop);
  }
  arcadeLoop = requestAnimationFrame(loop);
}

// Controles globales de reinicio y movimiento
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'r' && arcadeGame) {
    if (arcadeGame === 'snake') initSnake();
    else if (arcadeGame === 'pong') initPong();
    else if (arcadeGame === 'breakout') initBreakout();
    else if (arcadeGame === 'invaders') initInvaders();
    else if (arcadeGame === 'asteroids') initAsteroids();
  }
});

arcadeCanvas.addEventListener('mousemove', e => {
  if (!arcadeGame) return;
  const rect = arcadeCanvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  if (arcadeGame === 'breakout') {
    paddle.x = Math.max(0, Math.min(arcadeCanvas.width - paddle.w, mx - paddle.w/2));
  }
  if (arcadeGame === 'pong') {
    pongPaddle.y = Math.max(0, Math.min(arcadeCanvas.height - pongPaddle.h, my - pongPaddle.h/2));
  }
});

function startDoom() { showMenu(); }
function stopDoom() { showMenu(); }

