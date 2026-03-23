const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const msgEl = document.getElementById('message');

const GRID = 20;
const COLS = canvas.width / GRID;
const ROWS = canvas.height / GRID;
const speedEl = document.getElementById('speed');

let snake, dir, nextDir, food, score, best = 0, running, gameOver, tickInterval, goldCount, wanderer, enemies, lastEnemyThreshold;
let goldOrange, goldOrangeTimer, bullets, shooting, shootEnd;
let beaver, beaverTimer, beaverLogs, beaverLogInterval;
let killCount, vacuumEnd;
let storms, stormTimer, lastGoldOrangeEatTime;

function init() {
  const mid = Math.floor(ROWS / 2);
  snake = [{ x: 5, y: mid }, { x: 4, y: mid }, { x: 3, y: mid }];
  dir = { x: 1, y: 0 };
  nextDir = { ...dir };
  score = 0;
  goldCount = 0;
  gameOver = false;
  running = false;
  scoreEl.textContent = score;
  enemies = [];
  lastEnemyThreshold = 0;
  goldOrange = null;
  bullets = [];
  shooting = false;
  shootEnd = 0;
  if (goldOrangeTimer) clearTimeout(goldOrangeTimer);
  if (beaverTimer) clearTimeout(beaverTimer);
  if (beaverLogInterval) clearInterval(beaverLogInterval);
  beaver = null;
  beaverLogs = [];
  killCount = 0;
  vacuumEnd = 0;
  storms = [];
  lastGoldOrangeEatTime = 0;
  if (stormTimer) clearTimeout(stormTimer);
  scheduleBeaver();
  scheduleGoldOrange();
  placeFood();
  placeWanderer();
  spawnEnemy();
  draw();
  msgEl.textContent = 'Press any arrow key or WASD to start';
}

function placeFood() {
  while (true) {
    food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    if (!snake.some(s => s.x === food.x && s.y === food.y) &&
        !(wanderer && wanderer.x === food.x && wanderer.y === food.y)) break;
  }
}

function scheduleGoldOrange() {
  // Appear after 5-12 seconds randomly
  const delay = 5000 + Math.random() * 7000;
  goldOrangeTimer = setTimeout(() => {
    if (gameOver) return;
    // Place it
    while (true) {
      goldOrange = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      if (!snake.some(s => s.x === goldOrange.x && s.y === goldOrange.y)) break;
    }
    draw();
    // Disappear after 2.9 seconds
    setTimeout(() => {
      goldOrange = null;
      if (!gameOver) { draw(); scheduleGoldOrange(); }
    }, 2900);
  }, delay);
}

function fireBullets() {
  // Place a constant line of bullets from head to edge in current direction
  bullets = [];
  const h = snake[0];
  let x = h.x + dir.x;
  let y = h.y + dir.y;
  while (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
    bullets.push({ x, y, dx: dir.x, dy: dir.y });
    x += dir.x;
    y += dir.y;
  }
}

function vacuumSuck() {
  vacuumEnd = Date.now() + 9000;
}

function applyVacuum() {
  if (Date.now() > vacuumEnd) return;
  const h = snake[0];
  const range = 3;

  // Suck in food (orange)
  if (Math.abs(food.x - h.x) <= range && Math.abs(food.y - h.y) <= range) {
    goldCount++;
    score = goldCount;
    scoreEl.textContent = score;
    if (score > best) { best = score; bestEl.textContent = best; }
    placeFood();
    const threshold = Math.floor(score / 15);
    if (threshold > lastEnemyThreshold) {
      lastEnemyThreshold = threshold;
      spawnEnemy();
    }
  }

  // Suck in gold orange
  if (goldOrange && Math.abs(goldOrange.x - h.x) <= range && Math.abs(goldOrange.y - h.y) <= range) {
    goldOrange = null;
    shooting = true;
    shootEnd = Date.now() + 8340;
    scheduleGoldOrange();
  }

  // Suck in lone capybara
  if (wanderer && Math.abs(wanderer.x - h.x) <= range && Math.abs(wanderer.y - h.y) <= range) {
    snake.push({ ...snake[snake.length - 1] });
    wanderer = null;
    setTimeout(() => {
      if (!gameOver) { placeWanderer(); draw(); }
    }, 2170);
  }
}

function spawnStorm() {
  if (gameOver) return;
  const sx = Math.floor(Math.random() * (COLS - 1));
  const sy = 0;
  storms.push({ x: sx, y: sy });
  // Storm lasts 3 seconds
  setTimeout(() => {
    storms = storms.filter(s => s.x !== sx || s.y !== sy);
    if (!gameOver) draw();
  }, 3000);
  draw();
}

function tryTriggerStorm() {
  // If a gold orange was eaten within the last 5.55 seconds, spawn storm in 1 second
  if (Date.now() - lastGoldOrangeEatTime <= 5550) {
    if (stormTimer) clearTimeout(stormTimer);
    stormTimer = setTimeout(() => {
      spawnStorm();
    }, 1000);
  }
}

function getStormZones() {
  // Each storm: cloud at (x, y) 2 wide, rain falls 6 tiles below cloud
  const zones = [];
  storms.forEach(s => {
    for (let dx = 0; dx < 2; dx++) {
      for (let dy = 0; dy <= 6; dy++) {
        const tx = s.x + dx;
        const ty = s.y + dy;
        if (tx >= 0 && tx < COLS && ty >= 0 && ty < ROWS) {
          zones.push({ x: tx, y: ty });
        }
      }
    }
  });
  return zones;
}

function applyStormDamage() {
  if (storms.length === 0) return;
  const zones = getStormZones();

  // Kill snake if head is in rain
  if (zones.some(z => z.x === snake[0].x && z.y === snake[0].y)) {
    return die();
  }

  // Kill enemies in rain
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (zones.some(z => z.x === enemies[i].x && z.y === enemies[i].y)) {
      const killed = enemies.splice(i, 1)[0];
      killCount++;
      if (killCount >= 4) { killCount = 0; vacuumSuck(); }
      const respawnDelay = killed.type === 'wombat' ? 4110 : 6870;
      setTimeout(() => {
        if (gameOver) return;
        let pos;
        while (true) {
          pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
          const tooClose = Math.abs(pos.x - snake[0].x) + Math.abs(pos.y - snake[0].y) < 5;
          if (!tooClose && !snake.some(s2 => s2.x === pos.x && s2.y === pos.y)) break;
        }
        enemies.push({ x: pos.x, y: pos.y, dir: DIRS[Math.floor(Math.random() * 4)], type: killed.type });
        draw();
      }, respawnDelay);
    }
  }

  // Kill beaver in rain
  if (beaver && zones.some(z => z.x === beaver.x && z.y === beaver.y)) {
    beaver = null;
    beaverLogs = [];
    if (beaverLogInterval) { clearInterval(beaverLogInterval); beaverLogInterval = null; }
  }
}

function drawStorms() {
  storms.forEach(s => {
    // Cloud
    const cx1 = s.x * GRID + GRID / 2;
    const cx2 = (s.x + 1) * GRID + GRID / 2;
    const cy = s.y * GRID + GRID / 2 - 2;
    ctx.fillStyle = '#555';
    ctx.beginPath();
    ctx.arc(cx1, cy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx2, cy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc((cx1 + cx2) / 2, cy - 4, 7, 0, Math.PI * 2);
    ctx.fill();

    // Rain lines
    ctx.strokeStyle = 'rgba(100,180,255,0.6)';
    ctx.lineWidth = 1;
    for (let dx = 0; dx < 2; dx++) {
      for (let dy = 1; dy <= 6; dy++) {
        const rx = (s.x + dx) * GRID;
        const ry = (s.y + dy) * GRID;
        if (ry < canvas.height) {
          // Random rain drops
          for (let r = 0; r < 3; r++) {
            const ox = rx + Math.random() * GRID;
            const oy = ry + Math.random() * GRID;
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.lineTo(ox - 1, oy + 5);
            ctx.stroke();
          }
        }
      }
    }

    // Danger zone tint
    ctx.fillStyle = 'rgba(100,180,255,0.08)';
    for (let dx = 0; dx < 2; dx++) {
      for (let dy = 0; dy <= 6; dy++) {
        const tx = s.x + dx;
        const ty = s.y + dy;
        if (tx < COLS && ty < ROWS) {
          ctx.fillRect(tx * GRID, ty * GRID, GRID, GRID);
        }
      }
    }
  });
}

function moveBullets() {
  // Remove out-of-bounds
  bullets = bullets.filter(b => b.x >= 0 && b.x < COLS && b.y >= 0 && b.y < ROWS);
  // Check hits against enemies
  bullets = bullets.filter(b => {
    const hitIdx = enemies.findIndex(e => e.x === b.x && e.y === b.y);
    if (hitIdx !== -1) {
      const killed = enemies.splice(hitIdx, 1)[0];
      killCount++;
      if (killCount >= 4) { killCount = 0; vacuumSuck(); }
      const respawnDelay = killed.type === 'wombat' ? 4110 : 6870;
      setTimeout(() => {
        if (gameOver) return;
        let pos;
        while (true) {
          pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
          const tooClose = Math.abs(pos.x - snake[0].x) + Math.abs(pos.y - snake[0].y) < 5;
          if (!tooClose && !snake.some(s => s.x === pos.x && s.y === pos.y)) break;
        }
        enemies.push({ x: pos.x, y: pos.y, dir: DIRS[Math.floor(Math.random() * 4)], type: killed.type });
        draw();
      }, respawnDelay);
      return false;
    }
    return true;
  });
}

function drawBullet(bx, by) {
  const cx = bx * GRID + GRID / 2;
  const cy = by * GRID + GRID / 2;
  // Orange slice - half circle
  ctx.fillStyle = '#ff8c00';
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI);
  ctx.fill();
  // Rind
  ctx.strokeStyle = '#ff6600';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI);
  ctx.stroke();
  // Segments
  ctx.strokeStyle = '#ffe0a0';
  ctx.lineWidth = 0.7;
  for (let a = 0.2; a < Math.PI; a += 0.5) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * 4, cy + Math.sin(a) * 4);
    ctx.stroke();
  }
}

function placeWanderer() {
  while (true) {
    wanderer = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    if (!snake.some(s => s.x === wanderer.x && s.y === wanderer.y) &&
        !(food.x === wanderer.x && food.y === wanderer.y)) break;
  }
}

const DIRS = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];

function spawnEnemy() {
  // Every 30 points = wombat, otherwise raccoon
  const spawnCount = enemies.length + 1;
  const type = (spawnCount % 2 === 0) ? 'wombat' : 'raccoon';
  let pos;
  while (true) {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    const tooClose = Math.abs(pos.x - snake[0].x) + Math.abs(pos.y - snake[0].y) < 5;
    if (!tooClose && !snake.some(s => s.x === pos.x && s.y === pos.y)) break;
  }
  enemies.push({ x: pos.x, y: pos.y, dir: DIRS[Math.floor(Math.random() * 4)], type });
}

function moveEnemies() {
  enemies.forEach(e => {
    if (Math.random() < 0.3) {
      e.dir = DIRS[Math.floor(Math.random() * 4)];
    }
    const nx = e.x + e.dir.x;
    const ny = e.y + e.dir.y;
    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
      e.dir = { x: -e.dir.x, y: -e.dir.y };
      e.x += e.dir.x;
      e.y += e.dir.y;
    } else {
      e.x = nx;
      e.y = ny;
    }
  });
}

function drawRaccoon(rx, ry) {
  // Face
  ctx.fillStyle = '#888';
  ctx.beginPath();
  ctx.arc(rx, ry, 8, 0, Math.PI * 2);
  ctx.fill();
  // Dark mask
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.ellipse(rx - 3, ry - 2, 3, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(rx + 3, ry - 2, 3, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Eyes (white in mask)
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(rx - 3, ry - 2, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(rx + 3, ry - 2, 1.5, 0, Math.PI * 2);
  ctx.fill();
  // Pupils
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(rx - 3, ry - 2, 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(rx + 3, ry - 2, 0.7, 0, Math.PI * 2);
  ctx.fill();
  // Ears
  ctx.fillStyle = '#666';
  ctx.beginPath(); ctx.arc(rx - 6, ry - 7, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(rx + 6, ry - 7, 3, 0, Math.PI * 2); ctx.fill();
  // Nose
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(rx, ry + 3, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawWombat(wx, wy) {
  // Face - dark brown/chocolate
  ctx.fillStyle = '#4a3728';
  ctx.beginPath();
  ctx.arc(wx, wy, 8, 0, Math.PI * 2);
  ctx.fill();
  // Ears - small round
  ctx.fillStyle = '#3a2a1e';
  ctx.beginPath(); ctx.arc(wx - 6, wy - 6, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(wx + 6, wy - 6, 2.5, 0, Math.PI * 2); ctx.fill();
  // Inner ears
  ctx.fillStyle = '#c4956a';
  ctx.beginPath(); ctx.arc(wx - 6, wy - 6, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(wx + 6, wy - 6, 1.2, 0, Math.PI * 2); ctx.fill();
  // Eyes
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(wx - 3, wy - 1, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(wx + 3, wy - 1, 1.5, 0, Math.PI * 2); ctx.fill();
  // Big square nose
  ctx.fillStyle = '#2a1a10';
  ctx.fillRect(wx - 3, wy + 1, 6, 4);
  // Nostrils
  ctx.fillStyle = '#1a0f08';
  ctx.beginPath(); ctx.arc(wx - 1.2, wy + 3, 0.8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(wx + 1.2, wy + 3, 0.8, 0, Math.PI * 2); ctx.fill();
}

function drawEnemies() {
  enemies.forEach(e => {
    const ex = e.x * GRID + GRID / 2;
    const ey = e.y * GRID + GRID / 2;
    if (e.type === 'wombat') {
      drawWombat(ex, ey);
    } else {
      drawRaccoon(ex, ey);
    }
  });
}

function scheduleBeaver() {
  const delay = (Math.random() < 0.5 ? 11 : 13) * 1000;
  beaverTimer = setTimeout(() => {
    if (gameOver) return;
    // Pick random type: hostile (fires logs) or hunter (chases enemies)
    const bType = Math.random() < 0.5 ? 'hostile' : 'hunter';
    let pos;
    while (true) {
      pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      const tooClose = Math.abs(pos.x - snake[0].x) + Math.abs(pos.y - snake[0].y) < 4;
      if (!tooClose && !snake.some(s => s.x === pos.x && s.y === pos.y)) break;
    }
    beaver = { x: pos.x, y: pos.y, type: bType };
    beaverLogs = [];

    if (bType === 'hostile') {
      // Fire red logs every 0.2 seconds
      beaverLogInterval = setInterval(() => {
        if (!beaver || gameOver) return;
        const d = DIRS[Math.floor(Math.random() * 4)];
        beaverLogs.push({ x: beaver.x, y: beaver.y, dx: d.x, dy: d.y });
      }, 200);
    }

    // Disappear after 4 seconds
    setTimeout(() => {
      beaver = null;
      beaverLogs = [];
      if (beaverLogInterval) { clearInterval(beaverLogInterval); beaverLogInterval = null; }
      if (!gameOver) { draw(); scheduleBeaver(); }
    }, 4000);

    draw();
  }, delay);
}

function moveBeaver() {
  if (!beaver) return;
  if (beaver.type === 'hunter' && enemies.length > 0) {
    // Chase nearest enemy
    let nearest = null, bestDist = Infinity;
    enemies.forEach(e => {
      const d = Math.abs(e.x - beaver.x) + Math.abs(e.y - beaver.y);
      if (d < bestDist) { bestDist = d; nearest = e; }
    });
    if (nearest) {
      const dx = Math.sign(nearest.x - beaver.x);
      const dy = Math.sign(nearest.y - beaver.y);
      if (Math.abs(nearest.x - beaver.x) >= Math.abs(nearest.y - beaver.y)) {
        beaver.x += dx;
      } else {
        beaver.y += dy;
      }
      // Check if caught an enemy
      const caughtIdx = enemies.findIndex(e => e.x === beaver.x && e.y === beaver.y);
      if (caughtIdx !== -1) {
        const caught = enemies.splice(caughtIdx, 1)[0];
        killCount++;
        if (killCount >= 4) { killCount = 0; vacuumSuck(); }
        setTimeout(() => {
          if (gameOver) return;
          let p;
          while (true) {
            p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
            const tc = Math.abs(p.x - snake[0].x) + Math.abs(p.y - snake[0].y) < 5;
            if (!tc && !snake.some(s => s.x === p.x && s.y === p.y)) break;
          }
          enemies.push({ x: p.x, y: p.y, dir: DIRS[Math.floor(Math.random() * 4)], type: caught.type });
          draw();
        }, 7000);
      }
    }
  }
}

function moveBeaverLogs() {
  beaverLogs.forEach(l => { l.x += l.dx; l.y += l.dy; });
  beaverLogs = beaverLogs.filter(l => l.x >= 0 && l.x < COLS && l.y >= 0 && l.y < ROWS);
}

function checkBeaverLogHits() {
  beaverLogs = beaverLogs.filter(l => {
    if (snake.some(s => s.x === l.x && s.y === l.y)) {
      if (goldCount > 0) {
        // Lose 3 gold
        goldCount = Math.max(0, goldCount - 3);
        score = goldCount;
        scoreEl.textContent = score;
        const keepLength = 1 + Math.max(1, goldCount);
        if (snake.length > keepLength) snake.length = keepLength;
      } else {
        // No gold: need at least 6 non-gold body segments (snake.length - 1 = body)
        const nonGoldBody = snake.length - 1;
        if (nonGoldBody < 6) {
          die();
        } else {
          snake.length = snake.length - 6;
        }
      }
      return false;
    }
    return true;
  });
}

function drawBeaver(bx, by) {
  // Brown beaver face
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.arc(bx, by, 8, 0, Math.PI * 2);
  ctx.fill();
  // Ears
  ctx.fillStyle = '#6B3410';
  ctx.beginPath(); ctx.arc(bx - 6, by - 6, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(bx + 6, by - 6, 2.5, 0, Math.PI * 2); ctx.fill();
  // Eyes
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(bx - 3, by - 2, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(bx + 3, by - 2, 1.5, 0, Math.PI * 2); ctx.fill();
  // Teeth
  ctx.fillStyle = '#fff';
  ctx.fillRect(bx - 2, by + 3, 2, 3);
  ctx.fillRect(bx, by + 3, 2, 3);
  // Outline teeth
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(bx - 2, by + 3, 2, 3);
  ctx.strokeRect(bx, by + 3, 2, 3);
}

function drawBeaverLog(lx, ly) {
  const cx = lx * GRID + GRID / 2;
  const cy = ly * GRID + GRID / 2;
  ctx.fillStyle = '#8B0000';
  ctx.shadowColor = '#ff0000';
  ctx.shadowBlur = 4;
  ctx.fillRect(cx - 6, cy - 3, 12, 6);
  ctx.shadowBlur = 0;
  // Wood grain
  ctx.strokeStyle = '#5a0000';
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(cx - 5, cy - 1); ctx.lineTo(cx + 5, cy - 1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 4, cy + 1); ctx.lineTo(cx + 4, cy + 1); ctx.stroke();
}

function draw() {
  ctx.fillStyle = '#0f0f23';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid lines (subtle)
  ctx.strokeStyle = '#16213e';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= COLS; i++) {
    ctx.beginPath(); ctx.moveTo(i * GRID, 0); ctx.lineTo(i * GRID, canvas.height); ctx.stroke();
  }
  for (let i = 0; i <= ROWS; i++) {
    ctx.beginPath(); ctx.moveTo(0, i * GRID); ctx.lineTo(canvas.width, i * GRID); ctx.stroke();
  }

  // Gold orange powerup
  if (goldOrange) {
    const gx = goldOrange.x * GRID + GRID / 2;
    const gy = goldOrange.y * GRID + GRID / 2;
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(gx, gy, GRID / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Leaf
    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.ellipse(gx + 2, gy - (GRID / 2 - 2) - 1, 3, 5, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bullets
  bullets.forEach(b => drawBullet(b.x, b.y));

  // Enemies
  drawEnemies();

  // Beaver
  if (beaver) {
    drawBeaver(beaver.x * GRID + GRID / 2, beaver.y * GRID + GRID / 2);
  }
  beaverLogs.forEach(l => drawBeaverLog(l.x, l.y));

  // Rainstorms
  drawStorms();

  // Food (orange)
  const fx = food.x * GRID + GRID / 2;
  const fy = food.y * GRID + GRID / 2;
  const r = GRID / 2 - 2;
  ctx.fillStyle = '#ff8c00';
  ctx.shadowColor = '#ff8c00';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(fx, fy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  // Leaf
  ctx.fillStyle = '#2ecc71';
  ctx.beginPath();
  ctx.ellipse(fx + 2, fy - r - 1, 3, 5, Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Wandering capybara
  if (wanderer) {
  const wx = wanderer.x * GRID + GRID / 2;
  const wy = wanderer.y * GRID + GRID / 2;
  ctx.fillStyle = '#8B6914';
  ctx.beginPath();
  ctx.arc(wx, wy, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6B4F10';
  ctx.beginPath(); ctx.arc(wx - 5, wy - 7, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(wx + 5, wy - 7, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#C4956A';
  ctx.beginPath(); ctx.arc(wx - 5, wy - 7, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(wx + 5, wy - 7, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(wx - 3, wy - 2, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(wx + 3, wy - 2, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#5a3e1b';
  ctx.beginPath(); ctx.ellipse(wx, wy + 3, 3, 2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3a2510';
  ctx.beginPath(); ctx.arc(wx - 1.2, wy + 3, 0.8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(wx + 1.2, wy + 3, 0.8, 0, Math.PI * 2); ctx.fill();
  }

  // Snake
  snake.forEach((seg, i) => {
    const sx = seg.x * GRID;
    const sy = seg.y * GRID;
    if (i === 0) {
      // Head: person face
      const cx = sx + GRID / 2;
      const cy = sy + GRID / 2;
      // Hair
      ctx.fillStyle = '#3b2314';
      ctx.beginPath();
      ctx.arc(cx, cy - 2, 9, Math.PI, 0);
      ctx.fill();
      // Face
      ctx.fillStyle = '#f5cba7';
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      // Hair fringe
      ctx.fillStyle = '#3b2314';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 6, 8, 4, 0, 0, Math.PI);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(cx - 3, cy - 1, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 3, cy - 1, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2c3e50';
      ctx.beginPath();
      ctx.arc(cx - 3, cy - 1, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 3, cy - 1, 1.2, 0, Math.PI * 2);
      ctx.fill();
      // Smile
      ctx.strokeStyle = '#c0392b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy + 2, 3, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    } else {
      // Body: capybara face (gold if earned)
      const isGold = i <= goldCount;
      const cx = sx + GRID / 2;
      const cy = sy + GRID / 2;
      if (isGold) {
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 6;
      }
      // Face
      ctx.fillStyle = isGold ? '#ffd700' : '#8B6914';
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      // Ears
      ctx.fillStyle = isGold ? '#daa520' : '#6B4F10';
      ctx.beginPath();
      ctx.arc(cx - 5, cy - 7, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 5, cy - 7, 3, 0, Math.PI * 2);
      ctx.fill();
      // Inner ears
      ctx.fillStyle = isGold ? '#ffe066' : '#C4956A';
      ctx.beginPath();
      ctx.arc(cx - 5, cy - 7, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 5, cy - 7, 1.5, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(cx - 3, cy - 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 3, cy - 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      // Nose
      ctx.fillStyle = isGold ? '#b8860b' : '#5a3e1b';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 3, 3, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Nostrils
      ctx.fillStyle = isGold ? '#8b6508' : '#3a2510';
      ctx.beginPath();
      ctx.arc(cx - 1.2, cy + 3, 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 1.2, cy + 3, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  if (gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff4757';
    ctx.font = 'bold 36px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillStyle = '#eee';
    ctx.font = '18px Segoe UI';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 24);
  }
}

function step() {
  if (!running || gameOver) return;

  dir = { ...nextDir };
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // Wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) return die();
  // Self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) return die();

  // Move enemies
  moveEnemies();

  // Rainstorm damage
  applyStormDamage();

  // Move beaver and its logs
  moveBeaver();
  moveBeaverLogs();
  checkBeaverLogHits();

  // Separate raccoon vs wombat collision
  const hitRaccoon = enemies.some(e => e.type === 'raccoon' &&
    (snake.some(s => s.x === e.x && s.y === e.y) || (head.x === e.x && head.y === e.y)));
  const hitWombat = enemies.some(e => e.type === 'wombat' &&
    (snake.some(s => s.x === e.x && s.y === e.y) || (head.x === e.x && head.y === e.y)));

  // Wombat = lose non-gold capybaras + 2 gold, die if ≤1 gold
  if (hitWombat) {
    if (goldCount <= 1) return die();
    goldCount -= 2;
    score = goldCount;
    scoreEl.textContent = score;
    const keepLength = 1 + Math.max(1, goldCount);
    if (snake.length > keepLength) {
      snake.length = keepLength;
    }
  }

  // Raccoon = lose non-gold capybaras (keep 1) + lose 1 gold, or die if no gold
  if (hitRaccoon) {
    if (goldCount <= 0) return die();
    goldCount--;
    score = goldCount;
    scoreEl.textContent = score;
    // Keep head + 1 body segment + gold segments
    const keepLength = 1 + Math.max(1, goldCount);
    if (snake.length > keepLength) {
      snake.length = keepLength;
    }
  }

  // Move bullets and check hits
  moveBullets();

  // Fire bullets if shooting
  if (shooting) {
    fireBullets();
    if (Date.now() >= shootEnd) {
      shooting = false;
      bullets = [];
    }
  }

  snake.unshift(head);

  // Apply vacuum effect each tick
  applyVacuum();

  if (goldOrange && head.x === goldOrange.x && head.y === goldOrange.y) {
    // Activate shooting mode
    goldOrange = null;
    shooting = true;
    shootEnd = Date.now() + 8340;
    lastGoldOrangeEatTime = Date.now();
    scheduleGoldOrange();
    snake.pop();
  } else if (head.x === food.x && head.y === food.y) {
    goldCount++;
    score = goldCount;
    scoreEl.textContent = score;
    if (score > best) { best = score; bestEl.textContent = best; }
    placeFood();
    // Spawn new enemy every 15 points
    const threshold = Math.floor(score / 15);
    if (threshold > lastEnemyThreshold) {
      lastEnemyThreshold = threshold;
      spawnEnemy();
    }
    // Don't grow — instead a capybara turns gold
    snake.pop();
    // Check if storm should trigger (ate regular orange within 5.55s of gold orange)
    tryTriggerStorm();
  } else if (wanderer && head.x === wanderer.x && head.y === wanderer.y) {
    // Eat the lone capybara — grow and respawn after 2.17s
    wanderer = null;
    setTimeout(() => {
      if (!gameOver) { placeWanderer(); draw(); }
    }, 2170);
  } else {
    snake.pop();
  }
  draw();
}

function die() {
  gameOver = true;
  running = false;
  draw();
  msgEl.textContent = 'Press R or Space to restart';
}

const KEY_MAP = {
  ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
};

document.addEventListener('keydown', e => {
  const mapped = KEY_MAP[e.key];
  if (mapped) {
    e.preventDefault();
    // Prevent reversing
    if (mapped.x !== -dir.x || mapped.y !== -dir.y) {
      nextDir = mapped;
    }
    if (!running && !gameOver) { running = true; msgEl.textContent = ''; }
  }
  if ((e.key === 'r' || e.key === 'R' || e.key === ' ') && gameOver) {
    init();
  }
});

speedEl.addEventListener('change', () => {
  restartTimer();
});

function restartTimer() {
  clearInterval(tickInterval);
  tickInterval = setInterval(step, parseInt(speedEl.value));
}

restartTimer();
init();
