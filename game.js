const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('scoreDisplay');
const bestEl = document.getElementById('bestDisplay');
const msgEl = document.getElementById('gameMessage');
const GRID = 20;
const COLS = canvas.width / GRID;
const ROWS = canvas.height / GRID;
const speedEl = document.getElementById('gameSpeed');

var snake, dir, nextDir, food, score, best = 0, running, gameOver, tickInterval, goldCount, wanderer, enemies, lastEnemyThreshold;
var goldOrange, goldOrangeTimer, bullets, shooting, shootEnd;
var beaver, beaverTimer, beaverLogs, beaverLogInterval;
var killCount, vacuumEnd;
var storms, stormTimer, lastGoldOrangeEatTime;
var purpleShieldEnd;
var currentScreen = 'main';
var autoSaveInterval;
const MAX_SAVES = 13;
var spikeCount = 0;
var creativeMode = false;
var creativeMoveQueued = false;

function init() {
  var mid = Math.floor(ROWS / 2);
  snake = [{x:5,y:mid},{x:4,y:mid},{x:3,y:mid}];
  dir = {x:1,y:0};
  nextDir = {x:1,y:0};
  score = 0;
  goldCount = 0;
  spikeCount = 0;
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
  purpleShieldEnd = 0;
  storms = [];
  lastGoldOrangeEatTime = 0;
  if (stormTimer) clearTimeout(stormTimer);
  if (autoSaveInterval) clearInterval(autoSaveInterval);
  currentScreen = 'main';
  scheduleBeaver();
  scheduleGoldOrange();
  placeFood();
  placeWanderer();
  if (!creativeMode) spawnEnemy();
  startAutoSave();
  draw();
  msgEl.textContent = 'Press any arrow key or WASD to start';
}

function placeFood() {
  while (true) {
    food = {x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};
    var inVacuum = Date.now() < vacuumEnd && Math.abs(food.x-snake[0].x)<=3 && Math.abs(food.y-snake[0].y)<=3;
    if (!snake.some(function(s){return s.x===food.x&&s.y===food.y}) && !(wanderer&&wanderer.x===food.x&&wanderer.y===food.y) && !inVacuum) break;
  }
}

function scheduleGoldOrange() {
  var delay = 5000 + Math.random()*7000;
  goldOrangeTimer = setTimeout(function(){
    if (gameOver||currentScreen!=='main') return;
    while (true) {
      goldOrange = {x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};
      if (!snake.some(function(s){return s.x===goldOrange.x&&s.y===goldOrange.y})) break;
    }
    draw();
    setTimeout(function(){
      goldOrange = null;
      if (!gameOver&&currentScreen==='main'){draw();scheduleGoldOrange();}
    }, 2900);
  }, delay);
}

function fireBullets() {
  bullets = [];
  var h = snake[0];
  var x = h.x+dir.x, y = h.y+dir.y;
  while (x>=0&&x<COLS&&y>=0&&y<ROWS) {
    bullets.push({x:x,y:y,dx:dir.x,dy:dir.y});
    x+=dir.x; y+=dir.y;
  }
}

function vacuumSuck() { vacuumEnd = Date.now()+9000; }

function applyVacuum() {
  if (Date.now()>vacuumEnd) return;
  var h = snake[0], range = 3;
  if (Math.abs(food.x-h.x)<=range&&Math.abs(food.y-h.y)<=range) {
    goldCount++; score=goldCount; scoreEl.textContent=score;
    if (score>best){best=score;bestEl.textContent=best;}
    placeFood();
    var threshold=Math.floor(score/15);
    if (!creativeMode&&threshold>lastEnemyThreshold){lastEnemyThreshold=threshold;spawnEnemy();}
  }
  if (goldOrange&&Math.abs(goldOrange.x-h.x)<=range&&Math.abs(goldOrange.y-h.y)<=range) {
    goldOrange=null; shooting=true; shootEnd=Date.now()+8340; scheduleGoldOrange();
  }
  if (wanderer&&Math.abs(wanderer.x-h.x)<=range&&Math.abs(wanderer.y-h.y)<=range) {
    snake.push({x:snake[snake.length-1].x,y:snake[snake.length-1].y});
    wanderer=null;
    setTimeout(function rVac(){if(gameOver)return;if(currentScreen!=='main'){setTimeout(rVac,1000);return;}placeWanderer();draw();},2170);
  }
}

function spawnStorm() {
  if (gameOver||currentScreen!=='main') return;
  var sx, attempts=0;
  do {
    sx=Math.floor(Math.random()*(COLS-1)); attempts++;
  } while (attempts<50&&snake.some(function(s){for(var dx=0;dx<2;dx++)for(var dy=0;dy<=6;dy++)if(s.x===sx+dx&&s.y===dy)return true;return false;}));
  storms.push({x:sx,y:0});
  setTimeout(function(){storms=storms.filter(function(s){return s.x!==sx||s.y!==0;});if(!gameOver&&currentScreen==='main')draw();},3000);
  draw();
}

function tryTriggerStorm() {
  if (Date.now()-lastGoldOrangeEatTime<=5550) {
    if (stormTimer) clearTimeout(stormTimer);
    stormTimer=setTimeout(function(){spawnStorm();},1000);
  }
}

function getStormZones() {
  var zones=[];
  storms.forEach(function(s){for(var dx=0;dx<2;dx++)for(var dy=0;dy<=6;dy++){var tx=s.x+dx,ty=s.y+dy;if(tx<COLS&&ty<ROWS)zones.push({x:tx,y:ty});}});
  return zones;
}

function applyStormDamage() {
  if (storms.length===0) return;
  var head=snake[0];
  var inCloud=storms.some(function(s){return head.y===s.y&&(head.x===s.x||head.x===s.x+1);});
  if (inCloud){enterCapy3();return;}
  var zones=getStormZones();
  if (zones.some(function(z){return z.x===head.x&&z.y===head.y;})) return die();
  applyStormDamageToNonSnake(zones);
}

function applyStormDamageEnemiesOnly() {
  if (storms.length===0) return;
  applyStormDamageToNonSnake(getStormZones());
}

function applyStormDamageToNonSnake(zones) {
  for (var i=enemies.length-1;i>=0;i--) {
    if (zones.some(function(z){return z.x===enemies[i].x&&z.y===enemies[i].y;})) {
      var killed=enemies.splice(i,1)[0];
      killCount++;if(killCount>=4){killCount=0;vacuumSuck();}
      var rd=killed.type==='wombat'?4110:6870;
      setTimeout(function(kt){return function rE(){if(gameOver)return;var pos;while(true){pos={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};if(Math.abs(pos.x-snake[0].x)+Math.abs(pos.y-snake[0].y)>=5&&!snake.some(function(s2){return s2.x===pos.x&&s2.y===pos.y;}))break;}enemies.push({x:pos.x,y:pos.y,dir:DIRS[Math.floor(Math.random()*4)],type:kt});if(currentScreen==='main')draw();};}(killed.type),rd);
    }
  }
  if (beaver&&zones.some(function(z){return z.x===beaver.x&&z.y===beaver.y;})) {
    beaver=null;beaverLogs=[];if(beaverLogInterval){clearInterval(beaverLogInterval);beaverLogInterval=null;}
  }
}

function drawStorms() {
  storms.forEach(function(s){
    var cx1=s.x*GRID+GRID/2,cx2=(s.x+1)*GRID+GRID/2,cy=s.y*GRID+GRID/2-2;
    ctx.fillStyle='#555';
    ctx.beginPath();ctx.arc(cx1,cy,8,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(cx2,cy,8,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc((cx1+cx2)/2,cy-4,7,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(100,180,255,0.6)';ctx.lineWidth=1;
    for(var dx=0;dx<2;dx++)for(var dy=1;dy<=6;dy++){var rx=(s.x+dx)*GRID,ry=(s.y+dy)*GRID;if(ry<canvas.height)for(var r=0;r<3;r++){var ox=rx+Math.random()*GRID,oy=ry+Math.random()*GRID;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox-1,oy+5);ctx.stroke();}}
    ctx.fillStyle='rgba(100,180,255,0.08)';
    for(var dx2=0;dx2<2;dx2++)for(var dy2=0;dy2<=6;dy2++){var tx=s.x+dx2,ty=s.y+dy2;if(tx<COLS&&ty<ROWS)ctx.fillRect(tx*GRID,ty*GRID,GRID,GRID);}
  });
}

function moveBullets() {
  bullets=bullets.filter(function(b){return b.x>=0&&b.x<COLS&&b.y>=0&&b.y<ROWS;});
  bullets=bullets.filter(function(b){
    var hitIdx=enemies.findIndex(function(e){return e.x===b.x&&e.y===b.y;});
    if (hitIdx!==-1) {
      var killed=enemies.splice(hitIdx,1)[0];killCount++;if(killCount>=4){killCount=0;vacuumSuck();}
      var rd=killed.type==='wombat'?4110:6870;
      setTimeout(function(kt){return function(){if(gameOver)return;var pos;while(true){pos={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};if(Math.abs(pos.x-snake[0].x)+Math.abs(pos.y-snake[0].y)>=5&&!snake.some(function(s){return s.x===pos.x&&s.y===pos.y;}))break;}enemies.push({x:pos.x,y:pos.y,dir:DIRS[Math.floor(Math.random()*4)],type:kt});if(currentScreen==='main')draw();};}(killed.type),rd);
      return false;
    }
    return true;
  });
}

function drawBullet(bx,by) {
  var cx=bx*GRID+GRID/2,cy=by*GRID+GRID/2;
  ctx.fillStyle='#ff8c00';ctx.beginPath();ctx.arc(cx,cy,5,0,Math.PI);ctx.fill();
  ctx.strokeStyle='#ff6600';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,5,0,Math.PI);ctx.stroke();
  ctx.strokeStyle='#ffe0a0';ctx.lineWidth=0.7;
  for(var a=0.2;a<Math.PI;a+=0.5){ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*4,cy+Math.sin(a)*4);ctx.stroke();}
}

function placeWanderer() {
  while (true) {
    wanderer={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};
    if (!snake.some(function(s){return s.x===wanderer.x&&s.y===wanderer.y;})&&!(food.x===wanderer.x&&food.y===wanderer.y)) break;
  }
}

var DIRS=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];

function spawnEnemy() {
  var spawnCount=enemies.length+1;
  var type=(spawnCount%2===0)?'wombat':'raccoon';
  var pos;
  while(true){pos={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};if(Math.abs(pos.x-snake[0].x)+Math.abs(pos.y-snake[0].y)>=5&&!snake.some(function(s){return s.x===pos.x&&s.y===pos.y;}))break;}
  enemies.push({x:pos.x,y:pos.y,dir:DIRS[Math.floor(Math.random()*4)],type:type});
}

function moveEnemies() {
  enemies.forEach(function(e){
    if(Math.random()<0.3)e.dir=DIRS[Math.floor(Math.random()*4)];
    var nx=e.x+e.dir.x,ny=e.y+e.dir.y;
    if(nx<0||nx>=COLS||ny<0||ny>=ROWS){e.dir={x:-e.dir.x,y:-e.dir.y};e.x+=e.dir.x;e.y+=e.dir.y;}else{e.x=nx;e.y=ny;}
  });
}

function drawRaccoon(rx,ry) {
  ctx.fillStyle='#888';ctx.beginPath();ctx.arc(rx,ry,8,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#333';ctx.beginPath();ctx.ellipse(rx-3,ry-2,3,2.5,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(rx+3,ry-2,3,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(rx-3,ry-2,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(rx+3,ry-2,1.5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';ctx.beginPath();ctx.arc(rx-3,ry-2,0.7,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(rx+3,ry-2,0.7,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#666';ctx.beginPath();ctx.arc(rx-6,ry-7,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(rx+6,ry-7,3,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#222';ctx.beginPath();ctx.arc(rx,ry+3,2,0,Math.PI*2);ctx.fill();
}

function drawWombat(wx,wy) {
  ctx.fillStyle='#4a3728';ctx.beginPath();ctx.arc(wx,wy,8,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#3a2a1e';ctx.beginPath();ctx.arc(wx-6,wy-6,2.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(wx+6,wy-6,2.5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#c4956a';ctx.beginPath();ctx.arc(wx-6,wy-6,1.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(wx+6,wy-6,1.2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';ctx.beginPath();ctx.arc(wx-3,wy-1,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(wx+3,wy-1,1.5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#2a1a10';ctx.fillRect(wx-3,wy+1,6,4);
  ctx.fillStyle='#1a0f08';ctx.beginPath();ctx.arc(wx-1.2,wy+3,0.8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(wx+1.2,wy+3,0.8,0,Math.PI*2);ctx.fill();
}

function drawEnemies() {
  enemies.forEach(function(e){var ex=e.x*GRID+GRID/2,ey=e.y*GRID+GRID/2;if(e.type==='wombat')drawWombat(ex,ey);else drawRaccoon(ex,ey);});
}

function scheduleBeaver() {
  var delay=(Math.random()<0.5?11:13)*1000;
  beaverTimer=setTimeout(function(){
    if(gameOver||currentScreen!=='main')return;
    var roll=Math.random(),bType;
    if(roll<0.08)bType='purple';else if(roll<0.24)bType='gold';else if(roll<0.62)bType='hostile';else bType='hunter';
    var pos;while(true){pos={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};if(Math.abs(pos.x-snake[0].x)+Math.abs(pos.y-snake[0].y)>=4&&!snake.some(function(s){return s.x===pos.x&&s.y===pos.y;}))break;}
    beaver={x:pos.x,y:pos.y,type:bType};beaverLogs=[];
    if(bType==='hostile'||bType==='gold'||bType==='purple'){
      beaverLogInterval=setInterval(function(){if(!beaver||gameOver)return;var d=DIRS[Math.floor(Math.random()*4)];beaverLogs.push({x:beaver.x,y:beaver.y,dx:d.x,dy:d.y,gold:bType==='gold',purple:bType==='purple'});},200);
    }
    setTimeout(function(){beaver=null;beaverLogs=[];if(beaverLogInterval){clearInterval(beaverLogInterval);beaverLogInterval=null;}if(!gameOver&&currentScreen==='main'){draw();scheduleBeaver();}},4000);
    draw();
  },delay);
}

function moveBeaver() {
  if(!beaver)return;
  if(beaver.type==='hunter'&&enemies.length>0){
    var nearest=null,bestDist=Infinity;
    enemies.forEach(function(e){var d=Math.abs(e.x-beaver.x)+Math.abs(e.y-beaver.y);if(d<bestDist){bestDist=d;nearest=e;}});
    if(nearest){
      var dx=Math.sign(nearest.x-beaver.x),dy=Math.sign(nearest.y-beaver.y);
      if(Math.abs(nearest.x-beaver.x)>=Math.abs(nearest.y-beaver.y))beaver.x+=dx;else beaver.y+=dy;
      var cIdx=enemies.findIndex(function(e){return e.x===beaver.x&&e.y===beaver.y;});
      if(cIdx!==-1){var caught=enemies.splice(cIdx,1)[0];killCount++;if(killCount>=4){killCount=0;vacuumSuck();}
        setTimeout(function(ct){return function(){if(gameOver)return;var p;while(true){p={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};if(Math.abs(p.x-snake[0].x)+Math.abs(p.y-snake[0].y)>=5&&!snake.some(function(s){return s.x===p.x&&s.y===p.y;}))break;}enemies.push({x:p.x,y:p.y,dir:DIRS[Math.floor(Math.random()*4)],type:ct});if(currentScreen==='main')draw();};}(caught.type),7000);
      }
    }
  }
}

function moveBeaverLogs(){beaverLogs.forEach(function(l){l.x+=l.dx;l.y+=l.dy;});beaverLogs=beaverLogs.filter(function(l){return l.x>=0&&l.x<COLS&&l.y>=0&&l.y<ROWS;});}

function checkBeaverLogHits() {
  beaverLogs=beaverLogs.filter(function(l){
    if(l.purple){
      var sIdx=storms.findIndex(function(s){for(var dx=0;dx<2;dx++)for(var dy=0;dy<=6;dy++)if(s.x+dx===l.x&&s.y+dy===l.y)return true;return false;});
      if(sIdx!==-1){storms.splice(sIdx,1);return false;}
      if(snake.some(function(s){return s.x===l.x&&s.y===l.y;})){purpleShieldEnd=Date.now()+6000;return false;}
      return true;
    }
    if(l.gold){
      var hIdx=enemies.findIndex(function(e){return e.x===l.x&&e.y===l.y;});
      if(hIdx!==-1){var killed=enemies.splice(hIdx,1)[0];killCount++;if(killCount>=4){killCount=0;vacuumSuck();}
        var rd=killed.type==='wombat'?4110:6870;
        setTimeout(function(kt){return function(){if(gameOver)return;var pos;while(true){pos={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};if(Math.abs(pos.x-snake[0].x)+Math.abs(pos.y-snake[0].y)>=5&&!snake.some(function(s){return s.x===pos.x&&s.y===pos.y;}))break;}enemies.push({x:pos.x,y:pos.y,dir:DIRS[Math.floor(Math.random()*4)],type:kt});if(currentScreen==='main')draw();};}(killed.type),rd);
        return false;
      }
    }
    if(snake.some(function(s){return s.x===l.x&&s.y===l.y;})){
      if(Date.now()<purpleShieldEnd)return false;
      if(goldCount>0){goldCount=Math.max(0,goldCount-3);score=goldCount;scoreEl.textContent=score;var kl=1+Math.max(1,goldCount);if(snake.length>kl)snake.length=kl;}
      else{var nb=snake.length-1;if(nb<6)die();else snake.length=snake.length-6;}
      return false;
    }
    return true;
  });
}

function drawBeaver(bx,by) {
  var isGold=beaver&&beaver.type==='gold',isPurple=beaver&&beaver.type==='purple';
  ctx.fillStyle=isPurple?'#9b59b6':isGold?'#ffd700':'#8B4513';
  if(isGold){ctx.shadowColor='#ffd700';ctx.shadowBlur=8;}if(isPurple){ctx.shadowColor='#9b59b6';ctx.shadowBlur=10;}
  ctx.beginPath();ctx.arc(bx,by,8,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle=isPurple?'#7d3c98':isGold?'#daa520':'#6B3410';
  ctx.beginPath();ctx.arc(bx-6,by-6,2.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(bx+6,by-6,2.5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=isPurple?'#e8daef':'#111';ctx.beginPath();ctx.arc(bx-3,by-2,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(bx+3,by-2,1.5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.fillRect(bx-2,by+3,2,3);ctx.fillRect(bx,by+3,2,3);
  ctx.strokeStyle=isPurple?'#7d3c98':isGold?'#b8860b':'#aaa';ctx.lineWidth=0.5;ctx.strokeRect(bx-2,by+3,2,3);ctx.strokeRect(bx,by+3,2,3);
}

function drawBeaverLog(lx,ly,isGold,isPurple) {
  var cx=lx*GRID+GRID/2,cy=ly*GRID+GRID/2;
  ctx.fillStyle=isPurple?'#9b59b6':isGold?'#ffd700':'#8B0000';
  ctx.shadowColor=isPurple?'#9b59b6':isGold?'#ffd700':'#ff0000';ctx.shadowBlur=4;
  ctx.fillRect(cx-6,cy-3,12,6);ctx.shadowBlur=0;
  ctx.strokeStyle=isPurple?'#6c3483':isGold?'#b8860b':'#5a0000';ctx.lineWidth=0.5;
  ctx.beginPath();ctx.moveTo(cx-5,cy-1);ctx.lineTo(cx+5,cy-1);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-4,cy+1);ctx.lineTo(cx+4,cy+1);ctx.stroke();
}

function drawSpikes(cx,cy,segIdx,snakeArr) {
  var prev=snakeArr[segIdx-1],cur=snakeArr[segIdx];
  var connDx=prev?prev.x-cur.x:0,connDy=prev?prev.y-cur.y:0;
  ctx.fillStyle='#c0c0c0';ctx.strokeStyle='#888';ctx.lineWidth=0.5;
  var spikeLen=5;
  var dirs=[{dx:0,dy:-1},{dx:0,dy:1},{dx:-1,dy:0},{dx:1,dy:0}];
  dirs.forEach(function(d){
    if(d.dx===connDx&&d.dy===connDy)return;
    var bx2=cx+d.dx*8,by2=cy+d.dy*8;
    var tx=cx+d.dx*(8+spikeLen),ty=cy+d.dy*(8+spikeLen);
    for(var s=-1;s<=1;s++){
      var ox=d.dy*s*4,oy=d.dx*s*4;
      ctx.beginPath();ctx.moveTo(bx2+ox-d.dy*2,by2+oy-d.dx*2);ctx.lineTo(tx+ox,ty+oy);ctx.lineTo(bx2+ox+d.dy*2,by2+oy+d.dx*2);ctx.closePath();ctx.fill();ctx.stroke();
    }
  });
}
