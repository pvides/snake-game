
// === CAPY 2 ===
var capy2Oranges=[],capy2Capybaras=[],capy2Enemies=[],capy2GoldOranges=[],capy2Beaver=null,capy2Tick=0,capy2TimerEnd=0,mainGameState=null;
var capy2Running=false;

function enterCapy2() {
  if(!mainGameState)mainGameState=getGameState();
  currentScreen='capy2';clearInterval(tickInterval);
  capy2TimerEnd=Date.now()+(2*60+31)*1000;
  var mid=Math.floor(ROWS/2);
  snake=[{x:5,y:mid}];for(var i=1;i<=goldCount+1;i++)snake.push({x:5-i,y:mid});
  dir={x:1,y:0};nextDir={x:1,y:0};
  capy2Oranges=[];for(var i2=0;i2<41;i2++){var o;do{o={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};}while(snake.some(function(s){return s.x===o.x&&s.y===o.y;}));capy2Oranges.push(o);}
  capy2Capybaras=[];for(var i3=0;i3<32;i3++){var c;do{c={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};}while(snake.some(function(s){return s.x===c.x&&s.y===c.y;})||capy2Oranges.some(function(o2){return o2.x===c.x&&o2.y===c.y;})||capy2Capybaras.some(function(p){return p.x===c.x&&p.y===c.y;}));capy2Capybaras.push(c);}
  capy2Enemies=[];var types=['wombat','wombat','wombat','wombat','wombat','wombat','raccoon','raccoon'];
  types.forEach(function(type){var e2;do{e2={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};}while(snake.some(function(s){return s.x===e2.x&&s.y===e2.y;})||capy2Oranges.some(function(o3){return o3.x===e2.x&&o3.y===e2.y;})||capy2Capybaras.some(function(p2){return p2.x===e2.x&&p2.y===e2.y;})||capy2Enemies.some(function(f){return f.x===e2.x&&f.y===e2.y;}));capy2Enemies.push({x:e2.x,y:e2.y,dir:DIRS[Math.floor(Math.random()*4)],type:type});});
  capy2GoldOranges=[];for(var i4=0;i4<11;i4++){var g;do{g={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};}while(snake.some(function(s){return s.x===g.x&&s.y===g.y;})||capy2GoldOranges.some(function(go){return go.x===g.x&&go.y===g.y;}));capy2GoldOranges.push(g);}
  var bPos;do{bPos={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};}while(snake.some(function(s){return s.x===bPos.x&&s.y===bPos.y;}));
  capy2Beaver={x:bPos.x,y:bPos.y};
  capy2Running=false;capy2Tick=0;
  tickInterval=setInterval(stepCapy2,parseInt(speedEl.value));drawCapy2();
  msgEl.textContent='Capy 2 — Arrow keys to move, ESC to return';
}

function stepCapy2() {
  if(!capy2Running||currentScreen!=='capy2')return;
  if(Date.now()>=capy2TimerEnd){if(capy2Enemies.length>0){returnToMainGame();return;}}
  if(capy2Enemies.length===0){spikeCount++;saveGame();returnToMainGame();msgEl.textContent='Enemies cleared! Spike earned!';setTimeout(function(){if(!gameOver)msgEl.textContent='';},2000);return;}
  dir={x:nextDir.x,y:nextDir.y};var head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  if(head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS)return die();
  if(snake.some(function(s){return s.x===head.x&&s.y===head.y;}))return die();
  capy2Tick++;
  capy2Enemies.forEach(function(e){if(e.type==='raccoon'&&Math.random()>0.79)return;if(Math.random()<0.3)e.dir=DIRS[Math.floor(Math.random()*4)];var nx=e.x+e.dir.x,ny=e.y+e.dir.y;if(nx<0||nx>=COLS||ny<0||ny>=ROWS){e.dir={x:-e.dir.x,y:-e.dir.y};e.x+=e.dir.x;e.y+=e.dir.y;}else{e.x=nx;e.y=ny;}});
  if(capy2Beaver){capy2Enemies.filter(function(e){return e.type==='raccoon';}).forEach(function(e){if(Math.random()<0.5){var dx=Math.sign(capy2Beaver.x-e.x),dy=Math.sign(capy2Beaver.y-e.y);if(Math.abs(capy2Beaver.x-e.x)>=Math.abs(capy2Beaver.y-e.y)){var nx=e.x+dx;if(nx>=0&&nx<COLS)e.x=nx;}else{var ny=e.y+dy;if(ny>=0&&ny<ROWS)e.y=ny;}}});var cb=capy2Enemies.some(function(e){return e.type==='raccoon'&&e.x===capy2Beaver.x&&e.y===capy2Beaver.y;});if(cb)capy2Beaver=null;}
  if(capy2Beaver){var wombats=capy2Enemies.filter(function(e){return e.type==='wombat';});if(wombats.length>0){var near=null,bd=Infinity;wombats.forEach(function(w){var d=Math.abs(w.x-capy2Beaver.x)+Math.abs(w.y-capy2Beaver.y);if(d<bd){bd=d;near=w;}});if(near){var dx2=Math.sign(near.x-capy2Beaver.x),dy2=Math.sign(near.y-capy2Beaver.y);if(Math.abs(near.x-capy2Beaver.x)>=Math.abs(near.y-capy2Beaver.y))capy2Beaver.x+=dx2;else capy2Beaver.y+=dy2;var ci=capy2Enemies.findIndex(function(e){return e.type==='wombat'&&e.x===capy2Beaver.x&&e.y===capy2Beaver.y;});if(ci!==-1)capy2Enemies.splice(ci,1);}}}
  var hitR=capy2Enemies.some(function(e){return e.type==='raccoon'&&(snake.some(function(s){return s.x===e.x&&s.y===e.y;})||(head.x===e.x&&head.y===e.y));});
  var hitW=capy2Enemies.some(function(e){return e.type==='wombat'&&(snake.some(function(s){return s.x===e.x&&s.y===e.y;})||(head.x===e.x&&head.y===e.y));});
  if(hitW){if(goldCount<=1)return die();goldCount-=2;score=goldCount;scoreEl.textContent=score;var kl=1+Math.max(1,goldCount);if(snake.length>kl)snake.length=kl;}
  if(hitR){if(goldCount<=0)return die();goldCount--;score=goldCount;scoreEl.textContent=score;var kl2=1+Math.max(1,goldCount);if(snake.length>kl2)snake.length=kl2;}
  snake.unshift(head);
  if((head.x===COLS-1||head.x===COLS-2)&&(head.y===0||head.y===1)&&(capy2Beaver||creativeMode)){enterCapy4();return;}
  var oIdx=capy2Oranges.findIndex(function(o4){return o4.x===head.x&&o4.y===head.y;});
  if(oIdx!==-1){capy2Oranges.splice(oIdx,1);goldCount++;score=goldCount;scoreEl.textContent=score;if(score>best){best=score;bestEl.textContent=best;}snake.pop();}
  else{var gIdx=capy2GoldOranges.findIndex(function(g2){return g2.x===head.x&&g2.y===head.y;});
    if(gIdx!==-1){capy2GoldOranges.splice(gIdx,1);shooting=true;shootEnd=Date.now()+8340;snake.pop();}
    else{var cIdx=capy2Capybaras.findIndex(function(c2){return c2.x===head.x&&c2.y===head.y;});if(cIdx!==-1)capy2Capybaras.splice(cIdx,1);else snake.pop();}
  }
  if(shooting){bullets=[];var h=snake[0];var bx=h.x+dir.x,by=h.y+dir.y;while(bx>=0&&bx<COLS&&by>=0&&by<ROWS){bullets.push({x:bx,y:by});bx+=dir.x;by+=dir.y;}bullets.forEach(function(b){var hi=capy2Enemies.findIndex(function(e){return e.x===b.x&&e.y===b.y;});if(hi!==-1)capy2Enemies.splice(hi,1);});if(Date.now()>=shootEnd){shooting=false;bullets=[];}}
  drawCapy2();
}

function returnToMainGame() {
  if(!mainGameState){init();return;}
  clearInterval(tickInterval);if(capy4StormTimer){clearTimeout(capy4StormTimer);capy4StormTimer=null;}
  snake=mainGameState.snake;dir=mainGameState.dir;nextDir=mainGameState.nextDir;food=mainGameState.food;
  score=mainGameState.score;goldCount=mainGameState.goldCount;
  wanderer=mainGameState.wanderer;
  if(!wanderer){setTimeout(function rWR(){if(gameOver)return;if(currentScreen!=='main'){setTimeout(rWR,1000);return;}placeWanderer();draw();},2170);}
  enemies=mainGameState.enemies;lastEnemyThreshold=mainGameState.lastEnemyThreshold;running=mainGameState.running;
  killCount=mainGameState.killCount;spikeCount=mainGameState.spikeCount||0;rupees=mainGameState.rupees||0;extraLives=mainGameState.extraLives||0;
  currentScreen='main';gameOver=false;bullets=[];shooting=false;shootEnd=0;goldOrange=null;beaver=null;beaverLogs=[];storms=[];purpleShieldEnd=0;vacuumEnd=0;lastGoldOrangeEatTime=0;
  scoreEl.textContent=score;if(score>best){best=score;bestEl.textContent=best;}
  scheduleGoldOrange();scheduleBeaver();startAutoSave();restartTimer();draw();
  msgEl.textContent='Returned from landscape';setTimeout(function(){if(!gameOver&&currentScreen==='main')msgEl.textContent='';},1500);
  mainGameState=null;
}

function drawCapy2() {
  ctx.fillStyle='#0f0f23';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle='#16213e';ctx.lineWidth=0.5;
  for(var i=0;i<=COLS;i++){ctx.beginPath();ctx.moveTo(i*GRID,0);ctx.lineTo(i*GRID,canvas.height);ctx.stroke();}
  for(var i2=0;i2<=ROWS;i2++){ctx.beginPath();ctx.moveTo(0,i2*GRID);ctx.lineTo(canvas.width,i2*GRID);ctx.stroke();}
  capy2Oranges.forEach(function(o){var fx=o.x*GRID+GRID/2,fy=o.y*GRID+GRID/2,r=GRID/2-2;ctx.fillStyle='#ff8c00';ctx.shadowColor='#ff8c00';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(fx,fy,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#2ecc71';ctx.beginPath();ctx.ellipse(fx+2,fy-r-1,3,5,Math.PI/6,0,Math.PI*2);ctx.fill();});
  capy2GoldOranges.forEach(function(g){var gx=g.x*GRID+GRID/2,gy=g.y*GRID+GRID/2;ctx.shadowColor='#ffd700';ctx.shadowBlur=14;ctx.fillStyle='#ffd700';ctx.beginPath();ctx.arc(gx,gy,GRID/2-2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#2ecc71';ctx.beginPath();ctx.ellipse(gx+2,gy-(GRID/2-2)-1,3,5,Math.PI/6,0,Math.PI*2);ctx.fill();});
  if(capy2Beaver){var bx=capy2Beaver.x*GRID+GRID/2,by=capy2Beaver.y*GRID+GRID/2;ctx.fillStyle='#00ff88';ctx.shadowColor='#00ff88';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(bx,by,8,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#00cc66';ctx.beginPath();ctx.arc(bx-6,by-6,2.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(bx+6,by-6,2.5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(bx-3,by-2,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(bx+3,by-2,1.5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(bx-2,by+3,2,3);ctx.fillRect(bx,by+3,2,3);}
  capy2Enemies.forEach(function(e){var ex=e.x*GRID+GRID/2,ey=e.y*GRID+GRID/2;if(e.type==='wombat')drawWombat(ex,ey);else drawRaccoon(ex,ey);});
  capy2Capybaras.forEach(function(c){var cx=c.x*GRID+GRID/2,cy=c.y*GRID+GRID/2;ctx.fillStyle='#8B6914';ctx.beginPath();ctx.arc(cx,cy,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#6B4F10';ctx.beginPath();ctx.arc(cx-5,cy-7,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+5,cy-7,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(cx-3,cy-2,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+3,cy-2,1.5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#5a3e1b';ctx.beginPath();ctx.ellipse(cx,cy+3,3,2,0,0,Math.PI*2);ctx.fill();});
  bullets.forEach(function(b){drawBullet(b.x,b.y);});
  snake.forEach(function(seg,i){var sx=seg.x*GRID,sy=seg.y*GRID;if(i===0){var cx=sx+GRID/2,cy=sy+GRID/2;ctx.fillStyle='#3b2314';ctx.beginPath();ctx.arc(cx,cy-2,9,Math.PI,0);ctx.fill();ctx.fillStyle='#f5cba7';ctx.beginPath();ctx.arc(cx,cy,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3b2314';ctx.beginPath();ctx.ellipse(cx,cy-6,8,4,0,0,Math.PI);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(cx-3,cy-1,2.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+3,cy-1,2.2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#2c3e50';ctx.beginPath();ctx.arc(cx-3,cy-1,1.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+3,cy-1,1.2,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#c0392b';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy+2,3,0.1*Math.PI,0.9*Math.PI);ctx.stroke();}else{var isG=i<=goldCount;var cx2=sx+GRID/2,cy2=sy+GRID/2;ctx.fillStyle=isG?'#ffd700':'#8B6914';ctx.beginPath();ctx.arc(cx2,cy2,8,0,Math.PI*2);ctx.fill();ctx.fillStyle=isG?'#daa520':'#6B4F10';ctx.beginPath();ctx.arc(cx2-5,cy2-7,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx2+5,cy2-7,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(cx2-3,cy2-2,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx2+3,cy2-2,1.5,0,Math.PI*2);ctx.fill();ctx.fillStyle=isG?'#b8860b':'#5a3e1b';ctx.beginPath();ctx.ellipse(cx2,cy2+3,3,2,0,0,Math.PI*2);ctx.fill();}});
  ctx.fillStyle='#9b59b6';ctx.shadowColor='#9b59b6';ctx.shadowBlur=20;ctx.font='bold 42px Segoe UI';ctx.textAlign='center';ctx.fillText('Capy 2',canvas.width/2,36);ctx.shadowBlur=0;
  var remaining=Math.max(0,capy2TimerEnd-Date.now());var mins=Math.floor(remaining/60000);var secs=Math.floor((remaining%60000)/1000);ctx.fillStyle=remaining<30000?'#ff4757':'#eee';ctx.font='bold 18px Segoe UI';ctx.fillText(mins+':'+secs.toString().padStart(2,'0'),canvas.width/2,58);
  ctx.fillStyle='#666';ctx.font='14px Segoe UI';ctx.fillText('Press ESC to return',canvas.width/2,canvas.height-15);
  msgEl.textContent='Capy 2 — Press ESC to return';
}

// === SAVE SYSTEM ===
var currentGameId=null;
function getAllGames(){return JSON.parse(localStorage.getItem('crawlingCapysGames')||'[]');}
function saveAllGames(games){localStorage.setItem('crawlingCapysGames',JSON.stringify(games));}
function getCurrentGame(){var games=getAllGames();return games.find(function(g){return g.id===currentGameId;})||null;}

function getGameState(){return{snake:JSON.parse(JSON.stringify(snake)),dir:{x:dir.x,y:dir.y},nextDir:{x:nextDir.x,y:nextDir.y},food:{x:food.x,y:food.y},score:score,goldCount:goldCount,wanderer:wanderer?{x:wanderer.x,y:wanderer.y}:null,enemies:JSON.parse(JSON.stringify(enemies)),lastEnemyThreshold:lastEnemyThreshold,running:running,killCount:killCount,spikeCount:spikeCount,rupees:rupees,extraLives:extraLives,currentScreen:currentScreen,timestamp:Date.now()};}

function saveGame(){if(gameOver||!currentGameId)return;var state=getGameState();var games=getAllGames();var gm=games.find(function(g){return g.id===currentGameId;});if(!gm)return;gm.saves.unshift(state);if(gm.saves.length>MAX_SAVES)gm.saves.length=MAX_SAVES;saveAllGames(games);msgEl.textContent='Game saved! ('+gm.saves.length+'/'+MAX_SAVES+' slots)';setTimeout(function(){if(!gameOver)msgEl.textContent='';},1500);}

function loadGame(slotIndex){var gm=getCurrentGame();if(!gm||slotIndex>=gm.saves.length)return;var state=gm.saves[slotIndex];clearInterval(tickInterval);if(goldOrangeTimer)clearTimeout(goldOrangeTimer);if(beaverTimer)clearTimeout(beaverTimer);if(beaverLogInterval)clearInterval(beaverLogInterval);if(autoSaveInterval)clearInterval(autoSaveInterval);snake=state.snake;dir=state.dir;nextDir=state.nextDir;food=state.food;score=state.score;goldCount=state.goldCount;wanderer=state.wanderer;if(!wanderer){setTimeout(function rWL(){if(gameOver)return;if(currentScreen!=='main'){setTimeout(rWL,1000);return;}placeWanderer();draw();},2170);}enemies=state.enemies;lastEnemyThreshold=state.lastEnemyThreshold;running=true;killCount=state.killCount;spikeCount=state.spikeCount||0;rupees=state.rupees||0;extraLives=state.extraLives||0;var savedScreen=state.currentScreen||'main';currentScreen='main';gameOver=false;menuActive=false;saveMenuOpen=false;goldOrange=null;bullets=[];shooting=false;shootEnd=0;beaver=null;beaverLogs=[];storms=[];purpleShieldEnd=0;vacuumEnd=0;lastGoldOrangeEatTime=0;scoreEl.textContent=score;if(score>best){best=score;bestEl.textContent=best;}
  if(savedScreen==='capy2'){mainGameState=getGameState();enterCapy2();}
  else if(savedScreen==='capy3'){mainGameState=getGameState();enterCapy3();}
  else if(savedScreen==='capy4'){mainGameState=getGameState();enterCapy4();}
  else if(savedScreen==='capy5'){mainGameState=getGameState();enterCapy5();}
  else if(savedScreen==='capy7'){mainGameState=getGameState();enterCapy7();}
  else{scheduleGoldOrange();scheduleBeaver();startAutoSave();restartTimer();draw();}
  msgEl.textContent='Game loaded!';setTimeout(function(){if(!gameOver)msgEl.textContent='';},1500);}

function getSavesList(){var gm=getCurrentGame();return gm?gm.saves:[];}

function showSaveMenu(){var saves=getSavesList();ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.textAlign='center';if(deleteMode2){ctx.fillStyle='#ff4757';ctx.font='bold 22px Segoe UI';ctx.fillText('Delete Save (press 1-'+Math.max(saves.length,1)+')',canvas.width/2,40);}else{ctx.fillStyle='#00ff88';ctx.font='bold 22px Segoe UI';ctx.fillText('Saves',canvas.width/2,40);}if(saves.length===0){ctx.fillStyle='#888';ctx.font='16px Segoe UI';ctx.fillText('No saves yet',canvas.width/2,canvas.height/2);}else{saves.forEach(function(s,i){var y=75+i*50;var date=new Date(s.timestamp);var ts=date.toLocaleTimeString();ctx.fillStyle=deleteMode2?'#ff6b7a':'#eee';ctx.font='16px Segoe UI';ctx.fillText('['+(i+1)+'] Score: '+s.score+' | Gold: '+s.goldCount+' | '+ts,canvas.width/2,y);});}ctx.fillStyle='#666';ctx.font='13px Segoe UI';ctx.fillText(deleteMode2?'Press number to delete | ESC cancel':'Press number to load | X to delete | Space to resume',canvas.width/2,canvas.height-20);msgEl.textContent=deleteMode2?'Delete mode':'Saves — Space to resume';}

function startAutoSave(){if(autoSaveInterval)clearInterval(autoSaveInterval);autoSaveInterval=setInterval(function(){if(!gameOver&&running&&currentScreen==='main')saveGame();},34000);}

// === CUTSCENE ===
var cutsceneActive=false,cutsceneFrame=0,cutsceneTimer2=null,cutsceneCallback=null;
var CUTSCENE_SCENES=[{duration:3000,draw:drawScene1},{duration:3000,draw:drawScene2},{duration:2500,draw:drawScene3},{duration:2500,draw:drawScene4},{duration:2500,draw:drawScene5},{duration:2000,draw:drawScene6},{duration:1500,draw:drawScene7}];
function startCutscene(callback){cutsceneActive=true;cutsceneFrame=0;cutsceneCallback=callback;menuActive=false;playCutsceneFrame();}
function playCutsceneFrame(){if(!cutsceneActive)return;if(cutsceneFrame>=CUTSCENE_SCENES.length){cutsceneActive=false;if(cutsceneCallback)cutsceneCallback();return;}var scene=CUTSCENE_SCENES[cutsceneFrame];scene.draw();ctx.fillStyle='#555';ctx.font='12px Segoe UI';ctx.textAlign='right';ctx.fillText('Press X to skip',canvas.width-10,canvas.height-10);cutsceneTimer2=setTimeout(function(){cutsceneFrame++;playCutsceneFrame();},scene.duration);}
function skipCutscene(){if(!cutsceneActive)return;cutsceneActive=false;if(cutsceneTimer2)clearTimeout(cutsceneTimer2);if(cutsceneCallback)cutsceneCallback();}

function drawCutsceneCapybara(x,y,color,hasCrown){
  // Body (oval, wider than tall)
  var bodyColor=color==='#ffd700'?'#c4a24a':color==='#ff69b4'?'#c46a8a':color==='#9b59b6'?'#7a4590':'#8B6914';
  var lightColor=color==='#ffd700'?'#dab85a':color==='#ff69b4'?'#d88aa0':color==='#9b59b6'?'#a070b0':'#a07a2a';
  var darkColor=color==='#ffd700'?'#a08030':color==='#ff69b4'?'#a05070':color==='#9b59b6'?'#5a3570':'#6a4e10';
  // Shadow
  ctx.fillStyle='rgba(0,0,0,0.15)';ctx.beginPath();ctx.ellipse(x+2,y+12,11,4,0,0,Math.PI*2);ctx.fill();
  // Body
  ctx.fillStyle=bodyColor;ctx.beginPath();ctx.ellipse(x,y+4,10,8,0,0,Math.PI*2);ctx.fill();
  // Head (slightly overlapping body, rounder)
  ctx.fillStyle=bodyColor;ctx.beginPath();ctx.arc(x,y-4,9,0,Math.PI*2);ctx.fill();
  // Lighter belly/chin
  ctx.fillStyle=lightColor;ctx.beginPath();ctx.ellipse(x,y+6,6,4,0,0,Math.PI*2);ctx.fill();
  // Lighter snout area
  ctx.fillStyle=lightColor;ctx.beginPath();ctx.ellipse(x,y+1,6,4,0,0,Math.PI*2);ctx.fill();
  // Ears (small rounded, set back)
  ctx.fillStyle=darkColor;
  ctx.beginPath();ctx.ellipse(x-7,y-10,3,4,-.3,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+7,y-10,3,4,.3,0,Math.PI*2);ctx.fill();
  // Inner ears
  ctx.fillStyle=color==='#9b59b6'?'#c8a0d8':'#c4956a';
  ctx.beginPath();ctx.ellipse(x-7,y-10,1.5,2.5,-.3,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+7,y-10,1.5,2.5,.3,0,Math.PI*2);ctx.fill();
  // Eyes (larger, more expressive)
  ctx.fillStyle='#1a1008';
  ctx.beginPath();ctx.ellipse(x-4,y-5,2.2,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+4,y-5,2.2,2.5,0,0,Math.PI*2);ctx.fill();
  // Eye shine
  ctx.fillStyle='rgba(255,255,255,0.7)';
  ctx.beginPath();ctx.arc(x-3.2,y-6,0.8,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+4.8,y-6,0.8,0,Math.PI*2);ctx.fill();
  // Nose (wide, flat, distinctive capybara nose)
  ctx.fillStyle=darkColor;
  ctx.beginPath();ctx.ellipse(x,y+1,4,2.5,0,0,Math.PI*2);ctx.fill();
  // Nostrils
  ctx.fillStyle='#2a1a08';
  ctx.beginPath();ctx.ellipse(x-1.5,y+1,1,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+1.5,y+1,1,0.8,0,0,Math.PI*2);ctx.fill();
  // Mouth line
  ctx.strokeStyle=darkColor;ctx.lineWidth=0.5;
  ctx.beginPath();ctx.moveTo(x-2,y+3.5);ctx.quadraticCurveTo(x,y+5,x+2,y+3.5);ctx.stroke();
  // Whisker dots
  ctx.fillStyle=darkColor;
  ctx.beginPath();ctx.arc(x-5,y,0.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x-6,y+1.5,0.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+5,y,0.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+6,y+1.5,0.5,0,Math.PI*2);ctx.fill();
  // Tiny front legs
  ctx.fillStyle=bodyColor;
  ctx.beginPath();ctx.ellipse(x-5,y+10,2.5,3,-.2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+5,y+10,2.5,3,.2,0,Math.PI*2);ctx.fill();
  // Crown
  if(hasCrown){
    ctx.fillStyle='#ffd700';
    ctx.beginPath();ctx.moveTo(x-8,y-12);ctx.lineTo(x-6,y-19);ctx.lineTo(x-3,y-14);ctx.lineTo(x,y-20);ctx.lineTo(x+3,y-14);ctx.lineTo(x+6,y-19);ctx.lineTo(x+8,y-12);ctx.closePath();ctx.fill();
    // Crown base
    ctx.fillStyle='#daa520';ctx.fillRect(x-8,y-13,16,3);
    // Jewels
    ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(x,y-13,1.5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#3498db';ctx.beginPath();ctx.arc(x-4,y-13,1,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(x+4,y-13,1,0,Math.PI*2);ctx.fill();
  }
}
function drawCutscenePerson(x,y){
  // Shadow
  ctx.fillStyle='rgba(0,0,0,0.1)';ctx.beginPath();ctx.ellipse(x+1,y+14,6,2.5,0,0,Math.PI*2);ctx.fill();
  // Body/shirt
  ctx.fillStyle='#5b7daa';ctx.beginPath();ctx.ellipse(x,y+6,5,6,0,0,Math.PI*2);ctx.fill();
  // Arms (shirt color)
  ctx.fillStyle='#5b7daa';
  ctx.beginPath();ctx.ellipse(x-6,y+5,2,4,0.2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+6,y+5,2,4,-0.2,0,Math.PI*2);ctx.fill();
  // Hands
  ctx.fillStyle='#f0c8a0';
  ctx.beginPath();ctx.arc(x-6,y+9,1.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+6,y+9,1.5,0,Math.PI*2);ctx.fill();
  // Pants
  ctx.fillStyle='#4a6a8a';
  ctx.fillRect(x-4,y+11,3,4);ctx.fillRect(x+1,y+11,3,4);
  // Shoes
  ctx.fillStyle='#3a2a1a';
  ctx.beginPath();ctx.ellipse(x-3,y+15,2.5,1.2,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+3,y+15,2.5,1.2,0,0,Math.PI*2);ctx.fill();
  // Head
  ctx.fillStyle='#f5cba7';ctx.beginPath();ctx.arc(x,y-4,7,0,Math.PI*2);ctx.fill();
  // Hair
  ctx.fillStyle='#3b2314';
  ctx.beginPath();ctx.ellipse(x,y-9,7,4,0,0,Math.PI);ctx.fill();
  ctx.beginPath();ctx.arc(x,y-7,7,Math.PI,0);ctx.fill();
  // Eyes (friendly, rounder)
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(x-2.5,y-5,2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+2.5,y-5,2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#4a6a3a';
  ctx.beginPath();ctx.arc(x-2.5,y-5,1,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+2.5,y-5,1,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.arc(x-2.5,y-5,0.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+2.5,y-5,0.5,0,Math.PI*2);ctx.fill();
  // Friendly smile
  ctx.strokeStyle='#c07060';ctx.lineWidth=0.8;
  ctx.beginPath();ctx.arc(x,y-1.5,2,0.1*Math.PI,0.9*Math.PI);ctx.stroke();
  // Nose (simple dot)
  ctx.fillStyle='#e0b898';ctx.beginPath();ctx.arc(x,y-3,1,0,Math.PI*2);ctx.fill();
}

function drawCutsceneRaccoon(x,y){
  // Shadow
  ctx.fillStyle='rgba(0,0,0,0.12)';ctx.beginPath();ctx.ellipse(x+1,y+12,9,3,0,0,Math.PI*2);ctx.fill();
  // Body
  ctx.fillStyle='#7a7a7a';ctx.beginPath();ctx.ellipse(x,y+4,8,7,0,0,Math.PI*2);ctx.fill();
  // Lighter belly
  ctx.fillStyle='#9a9a9a';ctx.beginPath();ctx.ellipse(x,y+6,5,4,0,0,Math.PI*2);ctx.fill();
  // Head
  ctx.fillStyle='#8a8a8a';ctx.beginPath();ctx.arc(x,y-4,9,0,Math.PI*2);ctx.fill();
  // Ears (pointy)
  ctx.fillStyle='#6a6a6a';
  ctx.beginPath();ctx.moveTo(x-7,y-8);ctx.lineTo(x-10,y-16);ctx.lineTo(x-3,y-10);ctx.fill();
  ctx.beginPath();ctx.moveTo(x+7,y-8);ctx.lineTo(x+10,y-16);ctx.lineTo(x+3,y-10);ctx.fill();
  // Inner ears
  ctx.fillStyle='#b0a0a0';
  ctx.beginPath();ctx.moveTo(x-6.5,y-9);ctx.lineTo(x-8.5,y-14);ctx.lineTo(x-4,y-10);ctx.fill();
  ctx.beginPath();ctx.moveTo(x+6.5,y-9);ctx.lineTo(x+8.5,y-14);ctx.lineTo(x+4,y-10);ctx.fill();
  // Dark mask (signature raccoon feature)
  ctx.fillStyle='#2a2a2a';
  ctx.beginPath();ctx.ellipse(x-4,y-5,4,3.5,0.1,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+4,y-5,4,3.5,-0.1,0,Math.PI*2);ctx.fill();
  // White around mask
  ctx.fillStyle='#c0c0c0';
  ctx.beginPath();ctx.ellipse(x,y-3,3,2,0,0,Math.PI*2);ctx.fill();
  // Eyes in mask (beady, menacing)
  ctx.fillStyle='#ff3030';
  ctx.beginPath();ctx.arc(x-4,y-5,2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.arc(x-4,y-5,1,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#ff3030';
  ctx.beginPath();ctx.arc(x+4,y-5,2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.arc(x+4,y-5,1,0,Math.PI*2);ctx.fill();
  // Eye shine
  ctx.fillStyle='rgba(255,255,255,0.5)';
  ctx.beginPath();ctx.arc(x-3.5,y-5.8,0.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+4.5,y-5.8,0.5,0,Math.PI*2);ctx.fill();
  // Nose
  ctx.fillStyle='#1a1a1a';ctx.beginPath();ctx.ellipse(x,y-1,2,1.5,0,0,Math.PI*2);ctx.fill();
  // Snout whiskers
  ctx.strokeStyle='#aaa';ctx.lineWidth=0.3;
  ctx.beginPath();ctx.moveTo(x-2,y);ctx.lineTo(x-8,y-1);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-2,y+1);ctx.lineTo(x-8,y+2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+2,y);ctx.lineTo(x+8,y-1);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+2,y+1);ctx.lineTo(x+8,y+2);ctx.stroke();
  // Striped tail
  ctx.lineWidth=3;
  ctx.strokeStyle='#7a7a7a';ctx.beginPath();ctx.moveTo(x+8,y+6);ctx.quadraticCurveTo(x+18,y+2,x+16,y-4);ctx.stroke();
  ctx.strokeStyle='#2a2a2a';ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(x+14,y+2,0,0,Math.PI*2);ctx.stroke();
  for(var ti=0;ti<3;ti++){var tx=x+10+ti*3,ty=y+4-ti*3;ctx.fillStyle='#2a2a2a';ctx.fillRect(tx,ty,2,3);}
  // Front paws
  ctx.fillStyle='#5a5a5a';
  ctx.beginPath();ctx.ellipse(x-5,y+9,2.5,3,-.1,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+5,y+9,2.5,3,.1,0,Math.PI*2);ctx.fill();
}

function drawCutsceneWombat(x,y){
  // Shadow
  ctx.fillStyle='rgba(0,0,0,0.12)';ctx.beginPath();ctx.ellipse(x+1,y+12,10,3,0,0,Math.PI*2);ctx.fill();
  // Body (stocky, round)
  ctx.fillStyle='#5a4030';ctx.beginPath();ctx.ellipse(x,y+3,10,8,0,0,Math.PI*2);ctx.fill();
  // Lighter belly
  ctx.fillStyle='#7a6050';ctx.beginPath();ctx.ellipse(x,y+6,6,4,0,0,Math.PI*2);ctx.fill();
  // Head (squarish, broad)
  ctx.fillStyle='#5a4030';ctx.beginPath();ctx.ellipse(x,y-5,10,8,0,0,Math.PI*2);ctx.fill();
  // Lighter face
  ctx.fillStyle='#6a5040';ctx.beginPath();ctx.ellipse(x,y-2,7,5,0,0,Math.PI*2);ctx.fill();
  // Small rounded ears
  ctx.fillStyle='#4a3020';
  ctx.beginPath();ctx.arc(x-8,y-10,3.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+8,y-10,3.5,0,Math.PI*2);ctx.fill();
  // Inner ears
  ctx.fillStyle='#c49570';
  ctx.beginPath();ctx.arc(x-8,y-10,1.8,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+8,y-10,1.8,0,Math.PI*2);ctx.fill();
  // Eyes (small, deep set)
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.ellipse(x-4,y-5,2,2.2,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+4,y-5,2,2.2,0,0,Math.PI*2);ctx.fill();
  // Eye shine
  ctx.fillStyle='rgba(255,255,255,0.4)';
  ctx.beginPath();ctx.arc(x-3.5,y-5.8,0.6,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+4.5,y-5.8,0.6,0,Math.PI*2);ctx.fill();
  // Big square nose (distinctive wombat feature)
  ctx.fillStyle='#3a2518';
  ctx.beginPath();ctx.roundRect ? ctx.roundRect(x-4,y-2,8,5,2) : ctx.fillRect(x-4,y-2,8,5);ctx.fill();
  // Nostrils
  ctx.fillStyle='#2a1a0a';
  ctx.beginPath();ctx.ellipse(x-1.5,y+0.5,1,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+1.5,y+0.5,1,0.8,0,0,Math.PI*2);ctx.fill();
  // Mouth
  ctx.strokeStyle='#3a2518';ctx.lineWidth=0.5;
  ctx.beginPath();ctx.moveTo(x-2,y+4);ctx.lineTo(x,y+5);ctx.lineTo(x+2,y+4);ctx.stroke();
  // Stubby legs
  ctx.fillStyle='#4a3020';
  ctx.beginPath();ctx.ellipse(x-6,y+9,3,3.5,-.1,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+6,y+9,3,3.5,.1,0,Math.PI*2);ctx.fill();
  // Claws
  ctx.strokeStyle='#2a1a0a';ctx.lineWidth=0.5;
  for(var ci=0;ci<3;ci++){ctx.beginPath();ctx.moveTo(x-8+ci*1.5,y+12);ctx.lineTo(x-8+ci*1.5,y+14);ctx.stroke();}
  for(var ci2=0;ci2<3;ci2++){ctx.beginPath();ctx.moveTo(x+4+ci2*1.5,y+12);ctx.lineTo(x+4+ci2*1.5,y+14);ctx.stroke();}
}

function drawScene1(){
  // Sky gradient
  var skyGrad=ctx.createLinearGradient(0,0,0,canvas.height*0.6);
  skyGrad.addColorStop(0,'#4a90d9');skyGrad.addColorStop(0.5,'#87CEEB');skyGrad.addColorStop(1,'#b8e4f0');
  ctx.fillStyle=skyGrad;ctx.fillRect(0,0,canvas.width,canvas.height);
  // Sun
  ctx.fillStyle='rgba(255,230,100,0.3)';ctx.beginPath();ctx.arc(320,60,50,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#ffe866';ctx.beginPath();ctx.arc(320,60,25,0,Math.PI*2);ctx.fill();
  // Clouds
  ctx.fillStyle='rgba(255,255,255,0.7)';
  ctx.beginPath();ctx.arc(80,50,18,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(100,45,22,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(120,50,16,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(250,70,14,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(268,65,18,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(285,70,14,0,Math.PI*2);ctx.fill();
  // Rolling hills
  var hillGrad=ctx.createLinearGradient(0,canvas.height*0.55,0,canvas.height);
  hillGrad.addColorStop(0,'#4ade80');hillGrad.addColorStop(0.5,'#2ecc71');hillGrad.addColorStop(1,'#1a9956');
  ctx.fillStyle=hillGrad;
  ctx.beginPath();ctx.moveTo(0,canvas.height*0.65);ctx.quadraticCurveTo(100,canvas.height*0.55,200,canvas.height*0.62);ctx.quadraticCurveTo(300,canvas.height*0.58,400,canvas.height*0.63);ctx.lineTo(400,canvas.height);ctx.lineTo(0,canvas.height);ctx.fill();
  // Flowers
  var flowerColors=['#ff6b9d','#ffd93d','#ff8c42','#c084fc'];
  for(var fi=0;fi<12;fi++){var fx2=20+fi*33,fy2=270+Math.sin(fi*1.5)*10;ctx.fillStyle=flowerColors[fi%4];ctx.beginPath();ctx.arc(fx2,fy2,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#15803d';ctx.fillRect(fx2-0.5,fy2,1,6);}
  // Castle with more detail
  ctx.fillStyle='#d4b896';ctx.fillRect(145,105,110,135);
  ctx.fillStyle='#c0a882';ctx.fillRect(150,85,25,55);ctx.fillRect(225,85,25,55);
  // Castle windows
  ctx.fillStyle='#5a4a3a';ctx.fillRect(165,130,15,20);ctx.fillRect(220,130,15,20);ctx.fillRect(190,160,20,25);
  // Window glow
  ctx.fillStyle='rgba(255,200,100,0.4)';ctx.fillRect(166,131,13,18);ctx.fillRect(221,131,13,18);ctx.fillRect(191,161,18,23);
  // Castle door
  ctx.fillStyle='#6b4f3a';ctx.beginPath();ctx.arc(200,240,15,Math.PI,0);ctx.fill();ctx.fillRect(185,225,30,15);
  // Battlements
  ctx.fillStyle='#b89a78';for(var bi=0;bi<6;bi++)ctx.fillRect(148+bi*20,100,8,12);
  // Tower tops
  ctx.fillStyle='#9b59b6';
  ctx.beginPath();ctx.moveTo(150,85);ctx.lineTo(162,60);ctx.lineTo(175,85);ctx.fill();
  ctx.beginPath();ctx.moveTo(225,85);ctx.lineTo(237,60);ctx.lineTo(250,85);ctx.fill();
  // Flags
  ctx.fillStyle='#9b59b6';ctx.fillRect(162,48,12,10);ctx.fillRect(237,48,12,10);
  ctx.fillStyle='#ffd700';ctx.beginPath();ctx.arc(168,53,2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(243,53,2,0,Math.PI*2);ctx.fill();
  // Thrones and royals
  ctx.fillStyle='#8b4513';ctx.fillRect(170,195,20,25);ctx.fillRect(210,195,20,25);
  ctx.fillStyle='#ffd700';ctx.fillRect(172,193,16,4);ctx.fillRect(212,193,16,4);
  drawCutsceneCapybara(180,205,'#ffd700',true);drawCutsceneCapybara(220,205,'#ff69b4',true);
  // People and capybaras in foreground
  for(var i=0;i<6;i++){drawCutsceneCapybara(25+i*32,310,'#8B6914',false);drawCutscenePerson(42+i*32,308);}
  // Path
  ctx.fillStyle='#d4a86a';ctx.beginPath();ctx.moveTo(185,240);ctx.lineTo(170,320);ctx.lineTo(230,320);ctx.lineTo(215,240);ctx.fill();
  // Text with shadow
  ctx.fillStyle='rgba(0,0,0,0.3)';ctx.font='bold 18px Segoe UI';ctx.textAlign='center';ctx.fillText('The Kingdom of Capybara lived in peace...',canvas.width/2+1,41);
  ctx.fillStyle='#1a4a1a';ctx.fillText('The Kingdom of Capybara lived in peace...',canvas.width/2,40);
}
function drawScene2(){
  // Dark red sky gradient
  var skyGrad=ctx.createLinearGradient(0,0,0,canvas.height);
  skyGrad.addColorStop(0,'#1a0505');skyGrad.addColorStop(0.3,'#4a1515');skyGrad.addColorStop(0.7,'#3a1a0a');skyGrad.addColorStop(1,'#2a1a0a');
  ctx.fillStyle=skyGrad;ctx.fillRect(0,0,canvas.width,canvas.height);
  // Burning castle in background
  ctx.fillStyle='#3a2a1a';ctx.fillRect(160,120,80,120);ctx.fillRect(165,100,20,40);ctx.fillRect(220,100,20,40);
  // Fire on castle
  for(var fi=0;fi<8;fi++){var fx2=155+Math.random()*90,fy2=100+Math.random()*40;ctx.fillStyle='rgba(255,'+(150+Math.floor(Math.random()*100))+',0,'+(0.3+Math.random()*0.4)+')';ctx.beginPath();ctx.arc(fx2,fy2,5+Math.random()*10,0,Math.PI*2);ctx.fill();}
  // Smoke
  ctx.fillStyle='rgba(80,80,80,0.2)';for(var si=0;si<5;si++){ctx.beginPath();ctx.arc(170+Math.random()*60,60+Math.random()*50,15+Math.random()*20,0,Math.PI*2);ctx.fill();}
  // Ground
  ctx.fillStyle='#2a1a0a';ctx.fillRect(0,canvas.height*0.65,canvas.width,canvas.height*0.35);
  // Embers floating
  ctx.fillStyle='rgba(255,150,0,0.6)';for(var ei=0;ei<15;ei++){ctx.beginPath();ctx.arc(Math.random()*canvas.width,50+Math.random()*200,1+Math.random()*2,0,Math.PI*2);ctx.fill();}
  // Army of raccoons and wombats
  for(var i=0;i<4;i++){drawCutsceneRaccoon(30+i*45,260);drawCutsceneWombat(50+i*45,285);}
  for(var j=0;j<3;j++){drawCutsceneRaccoon(250+j*45,260);drawCutsceneWombat(260+j*45,285);}
  // Scared capybaras running
  for(var k=0;k<4;k++){drawCutsceneCapybara(140+k*30,300,'#8B6914',false);}
  // Dramatic red glow at bottom
  ctx.fillStyle='rgba(255,50,0,0.08)';ctx.fillRect(0,canvas.height*0.7,canvas.width,canvas.height*0.3);
  // Text
  ctx.fillStyle='rgba(0,0,0,0.5)';ctx.font='bold 20px Segoe UI';ctx.textAlign='center';ctx.fillText('Until the raccoons and wombats attacked!',canvas.width/2+1,41);
  ctx.fillStyle='#ff4757';ctx.fillText('Until the raccoons and wombats attacked!',canvas.width/2,40);
}
function drawScene3(){
  // Dark dungeon scene
  var bg=ctx.createLinearGradient(0,0,0,canvas.height);bg.addColorStop(0,'#0d0808');bg.addColorStop(1,'#1a1010');
  ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);
  // Stone floor
  ctx.fillStyle='#2a2020';ctx.fillRect(0,canvas.height*0.6,canvas.width,canvas.height*0.4);
  // Floor tiles
  ctx.strokeStyle='rgba(60,40,40,0.3)';ctx.lineWidth=1;
  for(var ti=0;ti<10;ti++)for(var tj=0;tj<5;tj++){ctx.strokeRect(ti*40,canvas.height*0.6+tj*20,40,20);}
  // Torch on left wall
  ctx.fillStyle='#5a4030';ctx.fillRect(40,140,6,30);ctx.fillStyle='#ff8c00';ctx.beginPath();ctx.arc(43,135,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,200,50,0.15)';ctx.beginPath();ctx.arc(43,135,40,0,Math.PI*2);ctx.fill();
  // Torch on right wall
  ctx.fillStyle='#5a4030';ctx.fillRect(354,140,6,30);ctx.fillStyle='#ff8c00';ctx.beginPath();ctx.arc(357,135,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,200,50,0.15)';ctx.beginPath();ctx.arc(357,135,40,0,Math.PI*2);ctx.fill();
  // Raccoons carrying king with chains
  drawCutsceneRaccoon(110,200);drawCutsceneRaccoon(210,200);
  // Chains
  ctx.strokeStyle='#888';ctx.lineWidth=2;
  for(var ci=0;ci<5;ci++){ctx.beginPath();ctx.arc(125+ci*8,195,3,0,Math.PI*2);ctx.stroke();}
  for(var ci2=0;ci2<5;ci2++){ctx.beginPath();ctx.arc(175+ci2*8,195,3,0,Math.PI*2);ctx.stroke();}
  drawCutsceneCapybara(160,200,'#ffd700',true);
  // Wombats carrying queen with chains
  drawCutsceneWombat(240,200);drawCutsceneWombat(340,200);
  for(var ci3=0;ci3<5;ci3++){ctx.beginPath();ctx.arc(255+ci3*8,195,3,0,Math.PI*2);ctx.stroke();}
  for(var ci4=0;ci4<5;ci4++){ctx.beginPath();ctx.arc(305+ci4*8,195,3,0,Math.PI*2);ctx.stroke();}
  drawCutsceneCapybara(290,200,'#ff69b4',true);
  // Tears (small blue dots)
  ctx.fillStyle='rgba(100,180,255,0.7)';
  ctx.beginPath();ctx.arc(163,208,2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(293,208,2,0,Math.PI*2);ctx.fill();
  // Text
  ctx.fillStyle='rgba(0,0,0,0.5)';ctx.font='bold 20px Segoe UI';ctx.textAlign='center';ctx.fillText('The King and Queen were taken!',canvas.width/2+1,41);
  ctx.fillStyle='#ff6b6b';ctx.fillText('The King and Queen were taken!',canvas.width/2,40);
}
function drawScene4(){
  // Night battlefield
  var bg=ctx.createLinearGradient(0,0,0,canvas.height);bg.addColorStop(0,'#0a0a20');bg.addColorStop(0.6,'#151530');bg.addColorStop(1,'#1a1a2a');
  ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);
  // Stars
  ctx.fillStyle='rgba(255,255,255,0.4)';for(var si=0;si<25;si++){ctx.beginPath();ctx.arc(Math.random()*canvas.width,Math.random()*canvas.height*0.4,0.5+Math.random(),0,Math.PI*2);ctx.fill();}
  // Moon
  ctx.fillStyle='rgba(200,210,230,0.2)';ctx.beginPath();ctx.arc(50,50,30,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#c8d6e6';ctx.beginPath();ctx.arc(50,50,18,0,Math.PI*2);ctx.fill();
  // Ground
  ctx.fillStyle='#1a1a2a';ctx.fillRect(0,canvas.height*0.65,canvas.width,canvas.height*0.35);
  // You fighting with sword
  drawCutscenePerson(180,230);
  // Sword with slash effect
  ctx.strokeStyle='#e0e0f0';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(195,225);ctx.lineTo(230,205);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(215,215,25,3.5,4.5);ctx.stroke();ctx.beginPath();ctx.arc(215,215,30,3.3,4.7);ctx.stroke();
  // Purple soldier capybaras in formation
  for(var i=0;i<5;i++){drawCutsceneCapybara(60+i*28,270,'#9b59b6',false);}
  // Their swords
  ctx.strokeStyle='#c0c0d0';ctx.lineWidth=1.5;for(var si2=0;si2<5;si2++){ctx.beginPath();ctx.moveTo(68+si2*28,265);ctx.lineTo(78+si2*28,255);ctx.stroke();}
  // Enemies surrounding
  for(var j=0;j<3;j++){drawCutsceneRaccoon(280+j*35,220);}
  for(var k=0;k<4;k++){drawCutsceneWombat(260+k*35,260);}
  // Sparks from clashing
  ctx.fillStyle='rgba(255,255,100,0.6)';for(var sp=0;sp<6;sp++){ctx.beginPath();ctx.arc(220+Math.random()*20,210+Math.random()*15,1,0,Math.PI*2);ctx.fill();}
  // Text
  ctx.fillStyle='rgba(0,0,0,0.5)';ctx.font='bold 20px Segoe UI';ctx.textAlign='center';ctx.fillText('You tried to fight back...',canvas.width/2+1,41);
  ctx.fillStyle='#c8d6f0';ctx.fillText('You tried to fight back...',canvas.width/2,40);
}
function drawScene5(){
  // Dark scene with cannon
  var bg=ctx.createLinearGradient(0,0,0,canvas.height);bg.addColorStop(0,'#0a0a1e');bg.addColorStop(1,'#1a1a2e');
  ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#1a1a28';ctx.fillRect(0,canvas.height*0.7,canvas.width,canvas.height*0.3);
  // Cannon - detailed
  ctx.fillStyle='#3a3a4a';ctx.fillRect(40,265,70,20);
  ctx.fillStyle='#2a2a3a';ctx.beginPath();ctx.arc(40,275,12,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#4a4a5a';ctx.beginPath();ctx.ellipse(110,275,8,12,0,0,Math.PI*2);ctx.fill();
  // Cannon wheels
  ctx.strokeStyle='#5a4a3a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(55,290,10,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(85,290,10,0,Math.PI*2);ctx.stroke();
  // Explosion from cannon
  ctx.fillStyle='rgba(255,200,0,0.4)';ctx.beginPath();ctx.arc(125,270,25,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,150,0,0.6)';ctx.beginPath();ctx.arc(130,268,15,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,200,0.8)';ctx.beginPath();ctx.arc(128,270,6,0,Math.PI*2);ctx.fill();
  // You and soldiers flying through air - spread apart
  drawCutscenePerson(250,100);
  drawCutsceneCapybara(190,140,'#9b59b6',false);
  drawCutsceneCapybara(300,130,'#9b59b6',false);
  drawCutsceneCapybara(340,160,'#9b59b6',false);
  // Motion lines
  ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=1;
  for(var ml=0;ml<8;ml++){var my=90+ml*20;ctx.beginPath();ctx.moveTo(135,my+10);ctx.lineTo(165,my);ctx.stroke();}
  // Smoke trail
  ctx.fillStyle='rgba(100,100,100,0.15)';
  for(var sm=0;sm<6;sm++){ctx.beginPath();ctx.arc(140+sm*15,260-sm*20,8+sm*2,0,Math.PI*2);ctx.fill();}
  // Text
  ctx.fillStyle='rgba(0,0,0,0.5)';ctx.font='bold 17px Segoe UI';ctx.textAlign='center';ctx.fillText('But you were rounded up and shot from a cannon!',canvas.width/2+1,41);
  ctx.fillStyle='#ff8c42';ctx.fillText('But you were rounded up and shot from a cannon!',canvas.width/2,40);
}
function drawScene6(){
  // Desolate night landscape
  var bg=ctx.createLinearGradient(0,0,0,canvas.height);bg.addColorStop(0,'#050510');bg.addColorStop(0.5,'#0a0a1a');bg.addColorStop(1,'#101020');
  ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);
  // Stars with twinkle
  for(var si=0;si<40;si++){var sx2=(si*97+13)%400,sy2=(si*53+7)%250;var bright=0.2+Math.random()*0.5;ctx.fillStyle='rgba(255,255,255,'+bright+')';ctx.beginPath();ctx.arc(sx2,sy2,0.5+Math.random()*1.2,0,Math.PI*2);ctx.fill();}
  // Distant mountains
  ctx.fillStyle='#0d0d1a';ctx.beginPath();ctx.moveTo(0,300);ctx.lineTo(60,260);ctx.lineTo(120,280);ctx.lineTo(200,240);ctx.lineTo(280,270);ctx.lineTo(340,250);ctx.lineTo(400,275);ctx.lineTo(400,400);ctx.lineTo(0,400);ctx.fill();
  // Barren ground
  ctx.fillStyle='#121218';ctx.fillRect(0,310,canvas.width,90);
  // Small rocks
  ctx.fillStyle='#1a1a25';ctx.beginPath();ctx.arc(80,340,4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(300,335,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(350,345,5,0,Math.PI*2);ctx.fill();
  // You alone, small, in center
  drawCutscenePerson(200,330);
  // Faint glow around person
  ctx.fillStyle='rgba(200,180,150,0.05)';ctx.beginPath();ctx.arc(200,330,30,0,Math.PI*2);ctx.fill();
  // Moon casting light
  ctx.fillStyle='rgba(180,190,210,0.15)';ctx.beginPath();ctx.arc(320,40,22,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(200,210,230,0.8)';ctx.beginPath();ctx.arc(320,40,12,0,Math.PI*2);ctx.fill();
  // Text fading in
  ctx.fillStyle='rgba(170,170,190,0.8)';ctx.font='bold 20px Segoe UI';ctx.textAlign='center';ctx.fillText('You landed alone...',canvas.width/2,280);
}
function drawScene7(){
  // Fade to black with text
  ctx.fillStyle='#000';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='rgba(100,100,120,0.5)';ctx.font='16px Segoe UI';ctx.textAlign='center';ctx.fillText('Your journey begins...',canvas.width/2,canvas.height/2);
}

function createNewGame(name){var games=getAllGames();var newGame={id:Date.now().toString(),name:name||'Game '+(games.length+1),saves:[],created:Date.now()};games.push(newGame);saveAllGames(games);currentGameId=newGame.id;creativeMode=(newGame.name==='CapyBopyCIG');startCutscene(function(){menuActive=false;init();restartTimer();});}

// === CAPY 3 ===
var capy3Running=false,capy3Rocks=[],capy3Raindrops=[];
function placeCapy3Rocks(){capy3Rocks=[];for(var i=0;i<25;i++){var r;do{r={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};}while(snake.some(function(s){return s.x===r.x&&s.y===r.y;})||capy3Rocks.some(function(rk){return rk.x===r.x&&rk.y===r.y;})||(Math.abs(r.x-snake[0].x)+Math.abs(r.y-snake[0].y)<3));capy3Rocks.push(r);}}

function enterCapy3(){if(!mainGameState)mainGameState=getGameState();currentScreen='capy3';clearInterval(tickInterval);if(capy4StormTimer){clearTimeout(capy4StormTimer);capy4StormTimer=null;}var mid=Math.floor(ROWS/2);snake=[{x:5,y:mid}];for(var i=1;i<=goldCount+1;i++)snake.push({x:5-i,y:mid});placeCapy3Rocks();capy3Raindrops=[];var startX=5;while(snake.some(function(s){return capy3Rocks.some(function(r){return r.x===s.x&&r.y===s.y;});})){startX++;snake=[{x:startX,y:mid}];for(var j=1;j<=goldCount+1;j++)snake.push({x:startX-j,y:mid});}dir={x:1,y:0};nextDir={x:1,y:0};bullets=[];shooting=false;slothPos={x:Math.floor(COLS/2),y:Math.floor(ROWS/2)};capy3Running=false;tickInterval=setInterval(stepCapy3,parseInt(speedEl.value));drawCapy3();msgEl.textContent='Capy 3 — Arrow keys to move, ESC to return';}

function stepCapy3(){if(!capy3Running||currentScreen!=='capy3')return;dir={x:nextDir.x,y:nextDir.y};var head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS)return die();if(snake.some(function(s){return s.x===head.x&&s.y===head.y;}))return die();if(capy3Rocks.some(function(r){return r.x===head.x&&r.y===head.y;}))return die();snake.unshift(head);snake.pop();if(Math.random()<0.3){var type=Math.random()<1/3?'pink':'blue';capy3Raindrops.push({x:Math.floor(Math.random()*COLS),y:0,type:type});}for(var i=capy3Raindrops.length-1;i>=0;i--){var drop=capy3Raindrops[i];var ny=drop.y+1;if(ny>=ROWS||capy3Rocks.some(function(r){return r.x===drop.x&&r.y===ny;})){capy3Raindrops.splice(i,1);continue;}drop.y=ny;if(snake.some(function(s){return s.x===drop.x&&s.y===drop.y;})){capy3Raindrops.splice(i,1);if(drop.type==='pink'){goldCount++;score=goldCount;scoreEl.textContent=score;if(score>best){best=score;bestEl.textContent=best;}snake.push({x:snake[snake.length-1].x,y:snake[snake.length-1].y});}else{if(Math.random()<0.5){if(goldCount>0){goldCount--;score=goldCount;scoreEl.textContent=score;}}else{if(snake.length-1-goldCount>0)snake.pop();}if(snake.length<=1&&goldCount<=0){die();return;}}}}if(checkSlothCollision()){openSlothShop();return;}drawCapy3();}

function drawCapy3(){ctx.fillStyle='#0d0d1f';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.strokeStyle='#1a1a3e';ctx.lineWidth=0.5;for(var i=0;i<=COLS;i++){ctx.beginPath();ctx.moveTo(i*GRID,0);ctx.lineTo(i*GRID,canvas.height);ctx.stroke();}for(var i2=0;i2<=ROWS;i2++){ctx.beginPath();ctx.moveTo(0,i2*GRID);ctx.lineTo(canvas.width,i2*GRID);ctx.stroke();}capy3Rocks.forEach(function(r){var rx=r.x*GRID,ry=r.y*GRID;ctx.fillStyle='#4a4a5a';ctx.fillRect(rx+1,ry+1,GRID-2,GRID-2);ctx.fillStyle='#5a5a6a';ctx.fillRect(rx+3,ry+3,6,5);ctx.fillRect(rx+11,ry+10,5,4);ctx.fillStyle='#3a3a4a';ctx.fillRect(rx+10,ry+3,4,3);ctx.fillRect(rx+3,ry+11,5,3);});capy3Raindrops.forEach(function(d){ctx.fillStyle=d.type==='pink'?'rgba(255,50,150,0.8)':'rgba(100,180,255,0.7)';ctx.shadowColor=d.type==='pink'?'#ff3296':'#64b4ff';ctx.shadowBlur=4;ctx.fillRect(d.x*GRID+4,d.y*GRID+2,GRID-8,GRID-4);ctx.shadowBlur=0;});ctx.strokeStyle='rgba(100,160,255,0.15)';ctx.lineWidth=1;for(var r2=0;r2<30;r2++){var rx2=Math.random()*canvas.width,ry2=Math.random()*canvas.height;ctx.beginPath();ctx.moveTo(rx2,ry2);ctx.lineTo(rx2-1,ry2+8);ctx.stroke();}snake.forEach(function(seg,i){var sx=seg.x*GRID,sy=seg.y*GRID;if(i===0){var cx=sx+GRID/2,cy=sy+GRID/2;ctx.fillStyle='#3b2314';ctx.beginPath();ctx.arc(cx,cy-2,9,Math.PI,0);ctx.fill();ctx.fillStyle='#f5cba7';ctx.beginPath();ctx.arc(cx,cy,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3b2314';ctx.beginPath();ctx.ellipse(cx,cy-6,8,4,0,0,Math.PI);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(cx-3,cy-1,2.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+3,cy-1,2.2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#2c3e50';ctx.beginPath();ctx.arc(cx-3,cy-1,1.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+3,cy-1,1.2,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#c0392b';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy+2,3,0.1*Math.PI,0.9*Math.PI);ctx.stroke();}else{var isG=i<=goldCount;var cx2=sx+GRID/2,cy2=sy+GRID/2;ctx.fillStyle=isG?'#ffd700':'#8B6914';ctx.beginPath();ctx.arc(cx2,cy2,8,0,Math.PI*2);ctx.fill();ctx.fillStyle=isG?'#daa520':'#6B4F10';ctx.beginPath();ctx.arc(cx2-5,cy2-7,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx2+5,cy2-7,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(cx2-3,cy2-2,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx2+3,cy2-2,1.5,0,Math.PI*2);ctx.fill();ctx.fillStyle=isG?'#b8860b':'#5a3e1b';ctx.beginPath();ctx.ellipse(cx2,cy2+3,3,2,0,0,Math.PI*2);ctx.fill();}});if(slothPos)drawSloth(slothPos.x,slothPos.y);ctx.fillStyle='#6496ff';ctx.shadowColor='#6496ff';ctx.shadowBlur=15;ctx.font='bold 42px Segoe UI';ctx.textAlign='center';ctx.fillText('Capy 3',canvas.width/2,36);ctx.shadowBlur=0;ctx.fillStyle='#666';ctx.font='14px Segoe UI';ctx.fillText('Press ESC to return',canvas.width/2,canvas.height-15);}

// === CAPY 4 ===
var capy4Running=false,capy4Frogs=[],capy4Storms=[],capy4StormTimer=null;

function scheduleCapy4Storm(){var delay=2000+Math.random()*3000;capy4StormTimer=setTimeout(function(){if(currentScreen!=='capy4'||gameOver)return;var sx,att=0;do{sx=Math.floor(Math.random()*(COLS-1));att++;}while(att<50&&(function(){var hx=snake[0].x,hy=snake[0].y;for(var dx=0;dx<2;dx++)for(var dy=0;dy<=6;dy++){if(Math.abs(sx+dx-hx)<=3&&Math.abs(dy-hy)<=3)return true;}return false;})());var roll=Math.random(),type;if(roll<0.3)type='deadly';else if(roll<0.3+0.7*0.2)type='capy3';else type='capy5';capy4Storms.push({x:sx,y:0,type:type});setTimeout(function(){capy4Storms=capy4Storms.filter(function(s){return s.x!==sx;});if(currentScreen==='capy4'&&!gameOver){drawCapy4();scheduleCapy4Storm();}},3000);drawCapy4();},delay);}

function checkCapy4Storms(){var head=snake[0];for(var i=capy4Storms.length-1;i>=0;i--){var s=capy4Storms[i];for(var dx=0;dx<2;dx++)for(var dy=1;dy<=6;dy++){if(head.x===s.x+dx&&head.y===s.y+dy){if(s.type==='deadly')return die();if(s.type==='capy3'){if(capy4StormTimer)clearTimeout(capy4StormTimer);enterCapy3();return;}if(capy4StormTimer)clearTimeout(capy4StormTimer);enterCapy5();return;}}}}

function drawCapy4Storm(s){var cx1=s.x*GRID+GRID/2,cx2=(s.x+1)*GRID+GRID/2,cy=s.y*GRID+GRID/2-2;ctx.fillStyle='#555';ctx.beginPath();ctx.arc(cx1,cy,8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx2,cy,8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc((cx1+cx2)/2,cy-4,7,0,Math.PI*2);ctx.fill();if(s.type==='capy3'||s.type==='capy5'){var rx=(cx1+cx2)/2,ry=cy-6;var colors=['#ff0000','#ff8800','#ffff00','#00ff00','#0088ff','#8800ff'];colors.forEach(function(c,ci){ctx.strokeStyle=c;ctx.lineWidth=0.8;ctx.beginPath();ctx.arc(rx,ry,4+ci,Math.PI,0);ctx.stroke();});}ctx.strokeStyle=s.type==='deadly'?'rgba(255,70,70,0.5)':'rgba(100,180,255,0.5)';ctx.lineWidth=1;for(var dx=0;dx<2;dx++)for(var dy=1;dy<=6;dy++){var rx2=(s.x+dx)*GRID,ry2=(s.y+dy)*GRID;if(ry2<canvas.height)for(var r=0;r<3;r++){var ox=rx2+Math.random()*GRID,oy=ry2+Math.random()*GRID;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox-1,oy+5);ctx.stroke();}}ctx.fillStyle=s.type==='deadly'?'rgba(255,50,50,0.06)':'rgba(100,255,200,0.06)';for(var dx2=0;dx2<2;dx2++)for(var dy2=0;dy2<=6;dy2++){var tx=s.x+dx2,ty=s.y+dy2;if(tx<COLS&&ty<ROWS)ctx.fillRect(tx*GRID,ty*GRID,GRID,GRID);}}

function placeFrogs(){capy4Frogs=[];for(var i=0;i<2;i++){var f;do{f={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS),jumpCooldown:0,hitCooldown:0};}while(snake.some(function(s){return Math.abs(s.x-f.x)<=2&&Math.abs(s.y-f.y)<=2;})||capy4Frogs.some(function(fr){return fr.x===f.x&&fr.y===f.y;}));capy4Frogs.push(f);}}

function moveFrogs(){capy4Frogs.forEach(function(f){f.jumpCooldown--;if(f.jumpCooldown>0)return;var jumpDist=2+Math.floor(Math.random()*3);var d=DIRS[Math.floor(Math.random()*4)];var nx=f.x+d.x*jumpDist,ny=f.y+d.y*jumpDist;f.x=Math.max(0,Math.min(COLS-1,nx));f.y=Math.max(0,Math.min(ROWS-1,ny));f.jumpCooldown=3+Math.floor(Math.random()*3);});}

function checkFrogHits(){capy4Frogs.forEach(function(f){if(f.hitCooldown>0){f.hitCooldown--;return;}for(var si=0;si<snake.length;si++){var s=snake[si];if(Math.abs(s.x-f.x)<=1&&Math.abs(s.y-f.y)<=1){f.hitCooldown=10;var nonGold=snake.length-1-goldCount;if(nonGold>=2){snake.pop();snake.pop();}else if(nonGold===1){snake.pop();if(goldCount>0){goldCount--;score=goldCount;scoreEl.textContent=score;}}else{if(goldCount>0){goldCount--;score=goldCount;scoreEl.textContent=score;}}if(snake.length<=1&&goldCount<=0){die();return;}break;}}});}

function drawFrog(fx,fy){var cx=fx*GRID+GRID/2,cy=fy*GRID+GRID/2;ctx.fillStyle='#27ae60';ctx.beginPath();ctx.arc(cx,cy,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(cx-4,cy-5,3.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+4,cy-5,3.5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(cx-4,cy-5,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+4,cy-5,1.5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#1a7a3a';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy+2,4,0.1*Math.PI,0.9*Math.PI);ctx.stroke();ctx.strokeStyle='rgba(255,70,70,0.2)';ctx.lineWidth=1;ctx.strokeRect((fx-1)*GRID,(fy-1)*GRID,GRID*3,GRID*3);}

function enterCapy4(){currentScreen='capy4';clearInterval(tickInterval);var mid=Math.floor(ROWS/2);snake=[{x:5,y:mid}];for(var i=1;i<=goldCount+1;i++)snake.push({x:5-i,y:mid});dir={x:1,y:0};nextDir={x:1,y:0};bullets=[];shooting=false;placeFrogs();capy4Storms=[];if(capy4StormTimer)clearTimeout(capy4StormTimer);scheduleCapy4Storm();slothPos={x:COLS-3,y:ROWS-3};capy4Running=false;tickInterval=setInterval(stepCapy4,parseInt(speedEl.value));drawCapy4();msgEl.textContent='Capy 4 — Arrow keys to move, ESC to return';}

function stepCapy4(){if(!capy4Running||currentScreen!=='capy4')return;dir={x:nextDir.x,y:nextDir.y};var head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS)return die();if(snake.some(function(s){return s.x===head.x&&s.y===head.y;}))return die();snake.unshift(head);snake.pop();moveFrogs();checkFrogHits();checkCapy4Storms();if(checkSlothCollision()){openSlothShop();return;}drawCapy4();}

function drawCapy4(){ctx.fillStyle='#0a1a0a';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.strokeStyle='#1a2e1a';ctx.lineWidth=0.5;for(var i=0;i<=COLS;i++){ctx.beginPath();ctx.moveTo(i*GRID,0);ctx.lineTo(i*GRID,canvas.height);ctx.stroke();}for(var i2=0;i2<=ROWS;i2++){ctx.beginPath();ctx.moveTo(0,i2*GRID);ctx.lineTo(canvas.width,i2*GRID);ctx.stroke();}capy4Storms.forEach(function(s){drawCapy4Storm(s);});capy4Frogs.forEach(function(f){drawFrog(f.x,f.y);});snake.forEach(function(seg,i){var sx=seg.x*GRID,sy=seg.y*GRID;if(i===0){var cx=sx+GRID/2,cy=sy+GRID/2;ctx.fillStyle='#3b2314';ctx.beginPath();ctx.arc(cx,cy-2,9,Math.PI,0);ctx.fill();ctx.fillStyle='#f5cba7';ctx.beginPath();ctx.arc(cx,cy,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3b2314';ctx.beginPath();ctx.ellipse(cx,cy-6,8,4,0,0,Math.PI);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(cx-3,cy-1,2.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+3,cy-1,2.2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#2c3e50';ctx.beginPath();ctx.arc(cx-3,cy-1,1.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+3,cy-1,1.2,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#c0392b';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy+2,3,0.1*Math.PI,0.9*Math.PI);ctx.stroke();}else{var isG=i<=goldCount;var cx2=sx+GRID/2,cy2=sy+GRID/2;ctx.fillStyle=isG?'#ffd700':'#8B6914';ctx.beginPath();ctx.arc(cx2,cy2,8,0,Math.PI*2);ctx.fill();ctx.fillStyle=isG?'#daa520':'#6B4F10';ctx.beginPath();ctx.arc(cx2-5,cy2-7,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx2+5,cy2-7,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(cx2-3,cy2-2,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx2+3,cy2-2,1.5,0,Math.PI*2);ctx.fill();ctx.fillStyle=isG?'#b8860b':'#5a3e1b';ctx.beginPath();ctx.ellipse(cx2,cy2+3,3,2,0,0,Math.PI*2);ctx.fill();}});if(slothPos)drawSloth(slothPos.x,slothPos.y);ctx.fillStyle='#2ecc71';ctx.shadowColor='#2ecc71';ctx.shadowBlur=15;ctx.font='bold 42px Segoe UI';ctx.textAlign='center';ctx.fillText('Capy 4',canvas.width/2,36);ctx.shadowBlur=0;ctx.fillStyle='#666';ctx.font='14px Segoe UI';ctx.fillText('Press ESC to return',canvas.width/2,canvas.height-15);}

// === CAPY 5 ===
var capy5Running=false,capy5Enemies=[],capy5Boss=null,capy5Player=null,capy5MoveQueued=false,capy5HP=5,capy5Portals=[],capy5Victory=false,capy5Present=null;
var shieldUses=3,shieldActive5=false,shieldRechargeEnd=0,swordUses=5,swordSpinActive=false,swordSpinEnd=0,swordSpinHit=false,swordRechargeEnd=0;

function placeCapy5Enemies(){capy5Enemies=[];for(var i=0;i<5;i++){var e;do{e={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};}while((capy5Player&&Math.abs(capy5Player.x-e.x)+Math.abs(capy5Player.y-e.y)<4)||capy5Enemies.some(function(f){return f.x===e.x&&f.y===e.y;}));capy5Enemies.push({x:e.x,y:e.y,dir:DIRS[Math.floor(Math.random()*4)],type:'raccoon',hp:1,hitCooldown:0});}var bx,by;do{bx=Math.floor(Math.random()*(COLS-1));by=Math.floor(Math.random()*(ROWS-1));}while(capy5Player&&Math.abs(capy5Player.x-bx)+Math.abs(capy5Player.y-by)<5);capy5Boss={x:bx,y:by,dir:DIRS[Math.floor(Math.random()*4)],armor:3,hitCooldown:0};}

function moveCapy5Enemies(){capy5Enemies.forEach(function(e){if(Math.random()>0.78)return;if(Math.random()<0.3)e.dir=DIRS[Math.floor(Math.random()*4)];var nx=e.x+e.dir.x,ny=e.y+e.dir.y;if(nx<0||nx>=COLS||ny<0||ny>=ROWS){e.dir={x:-e.dir.x,y:-e.dir.y};e.x+=e.dir.x;e.y+=e.dir.y;}else{e.x=nx;e.y=ny;}});if(capy5Boss&&Math.random()<0.5){if(Math.random()<0.3)capy5Boss.dir=DIRS[Math.floor(Math.random()*4)];var nx=capy5Boss.x+capy5Boss.dir.x,ny=capy5Boss.y+capy5Boss.dir.y;if(nx<0||nx>=COLS-1||ny<0||ny>=ROWS-1){capy5Boss.dir={x:-capy5Boss.dir.x,y:-capy5Boss.dir.y};capy5Boss.x+=capy5Boss.dir.x;capy5Boss.y+=capy5Boss.dir.y;}else{capy5Boss.x=nx;capy5Boss.y=ny;}}}

function checkCapy5PlayerHits(){if(!capy5Player||shieldActive5)return;var hitR=capy5Enemies.some(function(e){if(e.hitCooldown>0){e.hitCooldown--;return false;}if(e.x===capy5Player.x&&e.y===capy5Player.y){e.hitCooldown=2;return true;}return false;});if(hitR){capy5HP-=1;if(capy5HP<=0)return die();}if(capy5Boss){if(capy5Boss.hitCooldown>0){capy5Boss.hitCooldown--;return;}var hitB=capy5Player.x>=capy5Boss.x&&capy5Player.x<=capy5Boss.x+1&&capy5Player.y>=capy5Boss.y&&capy5Player.y<=capy5Boss.y+1;if(hitB){capy5HP-=capy5Boss.armor;capy5Boss.hitCooldown=6;if(capy5HP<=0)return die();}}}

function drawCapy5Boss(){if(!capy5Boss)return;var bx=capy5Boss.x*GRID,by=capy5Boss.y*GRID,cx=bx+GRID,cy=by+GRID,w=GRID*2,h=GRID*2;ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(bx+3,by+3,w,h);var grad=ctx.createLinearGradient(bx,by,bx+w,by+h);grad.addColorStop(0,'#7a7a8a');grad.addColorStop(0.3,'#9a9aaa');grad.addColorStop(0.5,'#b0b0c0');grad.addColorStop(0.7,'#8a8a9a');grad.addColorStop(1,'#606070');ctx.fillStyle=grad;ctx.fillRect(bx+1,by+1,w-2,h-2);ctx.strokeStyle='#c0c0d0';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(bx+1,by+h-1);ctx.lineTo(bx+1,by+1);ctx.lineTo(bx+w-1,by+1);ctx.stroke();ctx.strokeStyle='#404050';ctx.beginPath();ctx.moveTo(bx+w-1,by+1);ctx.lineTo(bx+w-1,by+h-1);ctx.lineTo(bx+1,by+h-1);ctx.stroke();ctx.fillStyle='#888';ctx.beginPath();ctx.arc(cx,cy,12,0,Math.PI*2);ctx.fill();ctx.fillStyle='#333';ctx.beginPath();ctx.ellipse(cx-5,cy-3,5,4,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(cx+5,cy-3,5,4,0,0,Math.PI*2);ctx.fill();ctx.shadowColor='#ff0000';ctx.shadowBlur=6;ctx.fillStyle='#f00';ctx.beginPath();ctx.arc(cx-5,cy-3,2.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+5,cy-3,2.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#111';ctx.beginPath();ctx.arc(cx-5,cy-3,1.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+5,cy-3,1.2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#666';ctx.beginPath();ctx.arc(cx-10,cy-11,4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+10,cy-11,4,0,Math.PI*2);ctx.fill();ctx.fillStyle='#222';ctx.beginPath();ctx.arc(cx,cy+5,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ff4757';ctx.shadowColor='#ff4757';ctx.shadowBlur=4;ctx.font='bold 12px Segoe UI';ctx.textAlign='center';var diamonds='';for(var d=0;d<capy5Boss.armor;d++)diamonds+='\u2666';ctx.fillText(diamonds,cx,by-3);ctx.shadowBlur=0;}

function enterCapy5(){if(!mainGameState)mainGameState=getGameState();currentScreen='capy5';clearInterval(tickInterval);if(capy4StormTimer){clearTimeout(capy4StormTimer);capy4StormTimer=null;}var mid=Math.floor(ROWS/2);capy5Player={x:5,y:mid,facing:{x:1,y:0}};dir={x:1,y:0};nextDir={x:1,y:0};bullets=[];shooting=false;capy5MoveQueued=false;capy5HP=5;capy5Portals=[];capy5Victory=false;capy5Present=null;shieldUses=3;shieldActive5=false;shieldRechargeEnd=0;swordUses=5;swordSpinActive=false;swordSpinEnd=0;swordSpinHit=false;swordRechargeEnd=0;placeCapy5Enemies();capy5Running=false;tickInterval=setInterval(stepCapy5,parseInt(speedEl.value));drawCapy5();msgEl.textContent='Capy 5 — Arrow keys to move, ESC to return';}

function stepCapy5(){if(!capy5Running||currentScreen!=='capy5')return;if(shieldUses<=0&&Date.now()>=shieldRechargeEnd)shieldUses=3;if(swordUses<=0&&Date.now()>=swordRechargeEnd)swordUses=5;if(swordSpinActive&&Date.now()>=swordSpinEnd){swordSpinActive=false;swordSpinHit=false;}if(swordSpinActive&&capy5Player&&!swordSpinHit){swordSpinHit=true;for(var i=capy5Enemies.length-1;i>=0;i--){var e=capy5Enemies[i];if(Math.abs(e.x-capy5Player.x)<=1&&Math.abs(e.y-capy5Player.y)<=1){e.hp--;if(e.hp<=0){capy5Enemies.splice(i,1);rupees+=1;}}}if(capy5Boss&&Math.abs(capy5Boss.x-capy5Player.x)<=2&&Math.abs(capy5Boss.y-capy5Player.y)<=2){capy5Boss.armor--;if(capy5Boss.armor<=0){capy5Boss=null;rupees+=3;}}}if(!capy5Victory&&capy5Enemies.length===0&&!capy5Boss){capy5Victory=true;capy5Portals=[{x:5,y:Math.floor(ROWS/2),label:'Capy 6',color:'#ff6b6b',dest:'capy6'},{x:10,y:Math.floor(ROWS/2),label:'Capy 7',color:'#ffd93d',dest:'capy7'},{x:15,y:Math.floor(ROWS/2),label:'Capy 8',color:'#6bcb77',dest:'capy8'}];capy5Present={x:capy5Player.x+2,y:capy5Player.y};capy5Present.x=Math.max(0,Math.min(COLS-1,capy5Present.x));}if(!capy5MoveQueued){moveCapy5Enemies();checkCapy5PlayerHits();drawCapy5();return;}capy5MoveQueued=false;dir={x:nextDir.x,y:nextDir.y};capy5Player.facing={x:dir.x,y:dir.y};var nx=capy5Player.x+dir.x*(capy5Victory?1:2),ny=capy5Player.y+dir.y*(capy5Victory?1:2);capy5Player.x=Math.max(0,Math.min(COLS-1,nx));capy5Player.y=Math.max(0,Math.min(ROWS-1,ny));moveCapy5Enemies();checkCapy5PlayerHits();if(!capy5Victory&&capy5Enemies.length===0&&!capy5Boss){capy5Victory=true;capy5Portals=[{x:5,y:Math.floor(ROWS/2),label:'Capy 6',color:'#ff6b6b',dest:'capy6'},{x:10,y:Math.floor(ROWS/2),label:'Capy 7',color:'#ffd93d',dest:'capy7'},{x:15,y:Math.floor(ROWS/2),label:'Capy 8',color:'#6bcb77',dest:'capy8'}];capy5Present={x:capy5Player.x+2,y:capy5Player.y};capy5Present.x=Math.max(0,Math.min(COLS-1,capy5Present.x));}if(capy5Present&&capy5Player&&capy5Player.x===capy5Present.x&&capy5Player.y===capy5Present.y){rupees+=2;msgEl.textContent='+2 rupees!';setTimeout(function(){if(!gameOver)msgEl.textContent='';},1000);capy5Present=null;}if(capy5Victory&&capy5Player){var hitP=capy5Portals.find(function(p){return p.x===capy5Player.x&&p.y===capy5Player.y;});if(hitP){clearInterval(tickInterval);if(hitP.dest==='capy6'){enterCapy6();}else if(hitP.dest==='capy7'){enterCapy7();}else if(hitP.dest==='capy8'){enterCapy8();}else{msgEl.textContent=hitP.label+' — Coming Soon!';}drawCapy5();return;}}drawCapy5();}

function drawCapy5(){ctx.fillStyle='#0d0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.strokeStyle='#1a1a30';ctx.lineWidth=0.5;for(var i=0;i<=COLS;i++){ctx.beginPath();ctx.moveTo(i*GRID,0);ctx.lineTo(i*GRID,canvas.height);ctx.stroke();}for(var i2=0;i2<=ROWS;i2++){ctx.beginPath();ctx.moveTo(0,i2*GRID);ctx.lineTo(canvas.width,i2*GRID);ctx.stroke();}ctx.fillStyle='rgba(255,255,255,0.3)';for(var s=0;s<15;s++){var sx2=((s*97+13)%COLS)*GRID+10,sy2=((s*53+7)%ROWS)*GRID+10;ctx.beginPath();ctx.arc(sx2,sy2,1,0,Math.PI*2);ctx.fill();}capy5Portals.forEach(function(p){var px=p.x*GRID,py=p.y*GRID;ctx.shadowColor=p.color;ctx.shadowBlur=10;ctx.fillStyle=p.color;ctx.fillRect(px+2,py+2,GRID-4,GRID-4);ctx.shadowBlur=0;ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.strokeRect(px+2,py+2,GRID-4,GRID-4);ctx.fillStyle='#fff';ctx.font='bold 8px Segoe UI';ctx.textAlign='center';ctx.fillText(p.label,px+GRID/2,py-3);});if(capy5Present){var prx=capy5Present.x*GRID,pry=capy5Present.y*GRID;ctx.fillStyle='#e74c3c';ctx.fillRect(prx+3,pry+5,GRID-6,GRID-8);ctx.fillStyle='#c0392b';ctx.fillRect(prx+GRID/2-1,pry+3,2,GRID-4);ctx.fillRect(prx+3,pry+GRID/2-1,GRID-6,2);ctx.fillStyle='#ffd700';ctx.beginPath();ctx.moveTo(prx+GRID/2-4,pry+4);ctx.lineTo(prx+GRID/2,pry);ctx.lineTo(prx+GRID/2+4,pry+4);ctx.fill();ctx.shadowColor='#ffd700';ctx.shadowBlur=6;ctx.fillStyle='#ffd700';ctx.font='bold 8px Segoe UI';ctx.textAlign='center';ctx.fillText('2R',prx+GRID/2,pry-2);ctx.shadowBlur=0;}capy5Enemies.forEach(function(e){drawRaccoon(e.x*GRID+GRID/2,e.y*GRID+GRID/2);});drawCapy5Boss();if(capy5Player){var px2=capy5Player.x*GRID+GRID/2,py2=capy5Player.y*GRID+GRID/2,f=capy5Player.facing;var shX=px2-f.y*10,shY=py2+f.x*10;ctx.fillStyle='#a0a0d0';ctx.beginPath();ctx.ellipse(shX,shY,5,7,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#9090c0';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(shX,shY,5,7,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#d470ff';ctx.beginPath();ctx.arc(shX,shY,2,0,Math.PI*2);ctx.fill();var sbX=px2+f.y*8,sbY=py2-f.x*8,stX=sbX+f.x*14,stY=sbY+f.y*14;ctx.strokeStyle='#e0e0f0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sbX,sbY);ctx.lineTo(stX,stY);ctx.stroke();ctx.strokeStyle='#ffd700';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sbX-f.y*3,sbY+f.x*3);ctx.lineTo(sbX+f.y*3,sbY-f.x*3);ctx.stroke();ctx.strokeStyle='#8B4513';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(sbX,sbY);ctx.lineTo(sbX-f.x*5,sbY-f.y*5);ctx.stroke();ctx.fillStyle='#9b59b6';ctx.beginPath();ctx.arc(px2,py2,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#7d3c98';ctx.beginPath();ctx.arc(px2-5,py2-6,2.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px2+5,py2-6,2.5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(px2-3,py2-2,1.8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px2+3,py2-2,1.8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(px2-3,py2-2,0.9,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px2+3,py2-2,0.9,0,Math.PI*2);ctx.fill();ctx.fillStyle='#6c3483';ctx.beginPath();ctx.ellipse(px2,py2+2,2.5,1.5,0,0,Math.PI*2);ctx.fill();}if(shieldActive5&&capy5Player){ctx.strokeStyle='rgba(100,150,255,0.6)';ctx.shadowColor='#6496ff';ctx.shadowBlur=12;ctx.lineWidth=3;ctx.beginPath();ctx.arc(capy5Player.x*GRID+GRID/2,capy5Player.y*GRID+GRID/2,14,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;}if(swordSpinActive&&capy5Player){var px3=capy5Player.x*GRID+GRID/2,py3=capy5Player.y*GRID+GRID/2;var angle=(Date.now()%300)/300*Math.PI*2;
  // Circular slash trail (fading arc)
  for(var t=0;t<8;t++){var ta=angle-t*0.25;var alpha=0.5-t*0.06;ctx.strokeStyle='rgba(220,220,255,'+alpha+')';ctx.lineWidth=2-t*0.2;ctx.beginPath();ctx.arc(px3,py3,14+t*0.5,ta-0.3,ta+0.3);ctx.stroke();}
  // Sword blade extending outward
  var tipX=px3+Math.cos(angle)*18,tipY=py3+Math.sin(angle)*18;
  var baseX=px3+Math.cos(angle)*6,baseY=py3+Math.sin(angle)*6;
  // Blade glow
  ctx.shadowColor='#fff';ctx.shadowBlur=6;
  ctx.strokeStyle='#e0e0f0';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(baseX,baseY);ctx.lineTo(tipX,tipY);ctx.stroke();
  // Blade highlight
  ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(baseX+Math.cos(angle+0.2)*1,baseY+Math.sin(angle+0.2)*1);ctx.lineTo(tipX,tipY);ctx.stroke();
  ctx.shadowBlur=0;
  // Guard (cross piece, perpendicular)
  var gx1=baseX+Math.cos(angle+Math.PI/2)*4,gy1=baseY+Math.sin(angle+Math.PI/2)*4;
  var gx2=baseX+Math.cos(angle-Math.PI/2)*4,gy2=baseY+Math.sin(angle-Math.PI/2)*4;
  ctx.strokeStyle='#ffd700';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gx1,gy1);ctx.lineTo(gx2,gy2);ctx.stroke();
  // Sparks at tip
  ctx.fillStyle='rgba(255,255,200,0.7)';
  for(var sp=0;sp<3;sp++){var sa=angle+Math.random()*0.5-0.25;var sd=16+Math.random()*5;ctx.beginPath();ctx.arc(px3+Math.cos(sa)*sd,py3+Math.sin(sa)*sd,1,0,Math.PI*2);ctx.fill();}
}ctx.fillStyle='#d470ff';ctx.shadowColor='#d470ff';ctx.shadowBlur=15;ctx.font='bold 42px Segoe UI';ctx.textAlign='center';ctx.fillText('Capy 5',canvas.width/2,36);ctx.shadowBlur=0;ctx.textAlign='left';ctx.font='12px Segoe UI';ctx.fillStyle=capy5HP>=4?'#2ecc71':capy5HP>=3?'#f1c40f':'#e74c3c';var hearts='';for(var hi=0;hi<capy5HP;hi++)hearts+='\u2665';for(var hj=0;hj<Math.max(0,5-capy5HP);hj++)hearts+='\u2661';ctx.fillText(hearts,8,canvas.height-44);var shDisp=shieldUses>0?shieldUses:(Date.now()<shieldRechargeEnd?'wait':3);ctx.fillStyle=shieldUses>0?'#6496ff':'#555';ctx.fillText('Shield: '+shDisp,8,canvas.height-28);var swDisp=swordUses>0?swordUses:(Date.now()<swordRechargeEnd?'wait':5);ctx.fillStyle=swordUses>0?'#e0e0f0':'#555';ctx.fillText('Sword: '+swDisp,8,canvas.height-12);ctx.textAlign='center';ctx.fillStyle='#666';ctx.font='14px Segoe UI';ctx.fillText('CapsLock=Shield | Ctrl=Sword | Shift=Super | ESC=return',canvas.width/2,canvas.height-15);}

// === CAPY 6 ===
var capy6Running=false,capy6CutsceneActive=false,capy6CutsceneFrame=0,capy6KnightX=0;

function enterCapy6(){
  if(!mainGameState)mainGameState=getGameState();
  currentScreen='capy6';clearInterval(tickInterval);
  capy6CutsceneActive=true;capy6CutsceneFrame=0;capy6KnightX=0;capy6Running=false;
  tickInterval=setInterval(stepCapy6,100);drawCapy6();
}

function stepCapy6(){
  if(currentScreen!=='capy6')return;
  if(capy6CutsceneActive){
    capy6CutsceneFrame++;
    if(capy6CutsceneFrame<60)capy6KnightX=capy6CutsceneFrame*3;
    drawCastleCutscene(capy6KnightX,capy6CutsceneFrame,'Capy 6');
    if(capy6CutsceneFrame>=120){capy6CutsceneActive=false;startCapy6Snake();}
    return;
  }
  if(!capy6Running)return;
  dir={x:nextDir.x,y:nextDir.y};
  var head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  if(head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS)return die();
  if(snake.some(function(s){return s.x===head.x&&s.y===head.y;}))return die();
  snake.unshift(head);snake.pop();drawCapy6Game();
}

function startCapy6Snake(){
  var mid=Math.floor(ROWS/2);
  snake=[{x:5,y:mid}];for(var i=1;i<=goldCount+1;i++)snake.push({x:5-i,y:mid});
  dir={x:1,y:0};nextDir={x:1,y:0};capy6Running=false;
  drawCapy6Game();msgEl.textContent='Capy 6 — Arrow keys to move, ESC to return';
}

function drawCapy6Game(){
  ctx.fillStyle='#1a0a0a';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle='#2e1a1a';ctx.lineWidth=0.5;
  for(var i=0;i<=COLS;i++){ctx.beginPath();ctx.moveTo(i*GRID,0);ctx.lineTo(i*GRID,canvas.height);ctx.stroke();}
  for(var i2=0;i2<=ROWS;i2++){ctx.beginPath();ctx.moveTo(0,i2*GRID);ctx.lineTo(canvas.width,i2*GRID);ctx.stroke();}
  snake.forEach(function(seg,i){var sx=seg.x*GRID,sy=seg.y*GRID;if(i===0){var cx=sx+GRID/2,cy=sy+GRID/2;ctx.fillStyle='#3b2314';ctx.beginPath();ctx.arc(cx,cy-2,9,Math.PI,0);ctx.fill();ctx.fillStyle='#f5cba7';ctx.beginPath();ctx.arc(cx,cy,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3b2314';ctx.beginPath();ctx.ellipse(cx,cy-6,8,4,0,0,Math.PI);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(cx-3,cy-1,2.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+3,cy-1,2.2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#2c3e50';ctx.beginPath();ctx.arc(cx-3,cy-1,1.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+3,cy-1,1.2,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#c0392b';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy+2,3,0.1*Math.PI,0.9*Math.PI);ctx.stroke();}else{var isG=i<=goldCount;var cx2=sx+GRID/2,cy2=sy+GRID/2;ctx.fillStyle=isG?'#ffd700':'#8B6914';ctx.beginPath();ctx.arc(cx2,cy2,8,0,Math.PI*2);ctx.fill();ctx.fillStyle=isG?'#daa520':'#6B4F10';ctx.beginPath();ctx.arc(cx2-5,cy2-7,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx2+5,cy2-7,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(cx2-3,cy2-2,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx2+3,cy2-2,1.5,0,Math.PI*2);ctx.fill();ctx.fillStyle=isG?'#b8860b':'#5a3e1b';ctx.beginPath();ctx.ellipse(cx2,cy2+3,3,2,0,0,Math.PI*2);ctx.fill();}});
  ctx.fillStyle='#ff6b6b';ctx.shadowColor='#ff6b6b';ctx.shadowBlur=15;ctx.font='bold 42px Segoe UI';ctx.textAlign='center';ctx.fillText('Capy 6',canvas.width/2,36);ctx.shadowBlur=0;
  ctx.fillStyle='#666';ctx.font='14px Segoe UI';ctx.fillText('Coming Soon — Press ESC to return',canvas.width/2,canvas.height-15);
}

// === CAPY 8 ===
var capy8Running=false,capy8CutsceneActive=false,capy8CutsceneFrame=0,capy8KnightX=0;

function enterCapy8(){
  if(!mainGameState)mainGameState=getGameState();
  currentScreen='capy8';clearInterval(tickInterval);
  capy8CutsceneActive=true;capy8CutsceneFrame=0;capy8KnightX=0;capy8Running=false;
  tickInterval=setInterval(stepCapy8,100);drawCapy8();
}

function stepCapy8(){
  if(currentScreen!=='capy8')return;
  if(capy8CutsceneActive){
    capy8CutsceneFrame++;
    if(capy8CutsceneFrame<60)capy8KnightX=capy8CutsceneFrame*3;
    drawCastleCutscene(capy8KnightX,capy8CutsceneFrame,'Capy 8');
    if(capy8CutsceneFrame>=120){capy8CutsceneActive=false;startCapy8Snake();}
    return;
  }
  if(!capy8Running)return;
  dir={x:nextDir.x,y:nextDir.y};
  var head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  if(head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS)return die();
  if(snake.some(function(s){return s.x===head.x&&s.y===head.y;}))return die();
  snake.unshift(head);snake.pop();drawCapy8Game();
}

function startCapy8Snake(){
  var mid=Math.floor(ROWS/2);
  snake=[{x:5,y:mid}];for(var i=1;i<=goldCount+1;i++)snake.push({x:5-i,y:mid});
  dir={x:1,y:0};nextDir={x:1,y:0};capy8Running=false;
  drawCapy8Game();msgEl.textContent='Capy 8 — Arrow keys to move, ESC to return';
}

function drawCapy8Game(){
  ctx.fillStyle='#0a1a0a';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle='#1a2e1a';ctx.lineWidth=0.5;
  for(var i=0;i<=COLS;i++){ctx.beginPath();ctx.moveTo(i*GRID,0);ctx.lineTo(i*GRID,canvas.height);ctx.stroke();}
  for(var i2=0;i2<=ROWS;i2++){ctx.beginPath();ctx.moveTo(0,i2*GRID);ctx.lineTo(canvas.width,i2*GRID);ctx.stroke();}
  snake.forEach(function(seg,i){var sx=seg.x*GRID,sy=seg.y*GRID;if(i===0){var cx=sx+GRID/2,cy=sy+GRID/2;ctx.fillStyle='#3b2314';ctx.beginPath();ctx.arc(cx,cy-2,9,Math.PI,0);ctx.fill();ctx.fillStyle='#f5cba7';ctx.beginPath();ctx.arc(cx,cy,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3b2314';ctx.beginPath();ctx.ellipse(cx,cy-6,8,4,0,0,Math.PI);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(cx-3,cy-1,2.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+3,cy-1,2.2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#2c3e50';ctx.beginPath();ctx.arc(cx-3,cy-1,1.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+3,cy-1,1.2,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#c0392b';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy+2,3,0.1*Math.PI,0.9*Math.PI);ctx.stroke();}else{var isG=i<=goldCount;var cx2=sx+GRID/2,cy2=sy+GRID/2;ctx.fillStyle=isG?'#ffd700':'#8B6914';ctx.beginPath();ctx.arc(cx2,cy2,8,0,Math.PI*2);ctx.fill();ctx.fillStyle=isG?'#daa520':'#6B4F10';ctx.beginPath();ctx.arc(cx2-5,cy2-7,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx2+5,cy2-7,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(cx2-3,cy2-2,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx2+3,cy2-2,1.5,0,Math.PI*2);ctx.fill();ctx.fillStyle=isG?'#b8860b':'#5a3e1b';ctx.beginPath();ctx.ellipse(cx2,cy2+3,3,2,0,0,Math.PI*2);ctx.fill();}});
  ctx.fillStyle='#6bcb77';ctx.shadowColor='#6bcb77';ctx.shadowBlur=15;ctx.font='bold 42px Segoe UI';ctx.textAlign='center';ctx.fillText('Capy 8',canvas.width/2,36);ctx.shadowBlur=0;
  ctx.fillStyle='#666';ctx.font='14px Segoe UI';ctx.fillText('Coming Soon — Press ESC to return',canvas.width/2,canvas.height-15);
}

// Shared castle cutscene for Capy 6/8
function drawCastleCutscene(knightX,frame,title){
  ctx.fillStyle='#87CEEB';ctx.fillRect(0,0,canvas.width,canvas.height*0.4);
  ctx.fillStyle='#2ecc71';ctx.fillRect(0,canvas.height*0.4,canvas.width,canvas.height*0.6);
  ctx.fillStyle='#c0a882';ctx.fillRect(300,canvas.height*0.25,60,canvas.height*0.2);
  ctx.fillStyle='#a08862';ctx.fillRect(310,canvas.height*0.18,15,30);ctx.fillRect(340,canvas.height*0.18,15,30);
  ctx.fillStyle='#9b59b6';ctx.fillRect(313,canvas.height*0.14,10,8);ctx.fillRect(343,canvas.height*0.14,10,8);
  var kx=Math.min(knightX,280);
  ctx.fillStyle='#9b59b6';ctx.beginPath();ctx.arc(kx+20,canvas.height*0.38,10,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#7d3c98';ctx.beginPath();ctx.arc(kx+16,canvas.height*0.38-8,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(kx+24,canvas.height*0.38-8,3,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(kx+18,canvas.height*0.38-3,2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(kx+22,canvas.height*0.38-3,2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';ctx.beginPath();ctx.arc(kx+18,canvas.height*0.38-3,1,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(kx+22,canvas.height*0.38-3,1,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#9a8aba';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(kx+20,canvas.height*0.38,12,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#2c3e50';ctx.font='bold 16px Segoe UI';ctx.textAlign='center';
  if(frame<60){ctx.fillText('The knight reaches the castle...',canvas.width/2,40);}
  else{ctx.fillText('"I will wait here for my fellow knights."',canvas.width/2,40);ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(kx+20,canvas.height*0.38-30,80,15,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#333';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(kx+20,canvas.height*0.38-30,80,15,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#333';ctx.font='10px Segoe UI';ctx.fillText('I will wait here for my fellow knights.',kx+20,canvas.height*0.38-27);}
  ctx.fillStyle='#555';ctx.font='12px Segoe UI';ctx.fillText(title+' — Press X to skip',canvas.width/2,canvas.height-15);
}

// === CAPY 7 ===
var capy7Running=false,capy7Player=null,capy7Logs=[],capy7Won=false,capy7CutsceneFrame=0,capy7CutsceneActive=false,capy7KnightX=0;
var C7_ROWS=25;
var C7_ISLAND_TOP=2;
var C7_ISLAND_BOT=C7_ROWS-2;
var C7_WATER_START=C7_ISLAND_TOP+1;
var C7_WATER_END=C7_ISLAND_BOT-1;

function enterCapy7(){
  if(!mainGameState)mainGameState=getGameState();
  currentScreen='capy7';clearInterval(tickInterval);
  capy7Player={x:Math.floor(COLS/2),y:C7_ISLAND_BOT};
  capy7Won=false;capy7CutsceneActive=false;capy7Running=false;
  slothPos={x:Math.floor(COLS/2)-3,y:C7_ISLAND_BOT};
  // Create log rows - each row has logs moving left or right
  capy7Logs=[];
  for(var row=C7_WATER_START;row<=C7_WATER_END;row++){
    var speed=(0.5+Math.random()*1.5)*(row%2===0?1:-1);
    var logLen=2+Math.floor(Math.random()*3);
    var numLogs=Math.floor(COLS/(logLen+3))+1;
    for(var li=0;li<numLogs;li++){
      capy7Logs.push({x:li*(logLen+2+Math.random()*2),y:row,len:logLen,speed:speed});
    }
  }
  tickInterval=setInterval(stepCapy7,120);
  drawCapy7();msgEl.textContent='Capy 7 — Cross the ocean!';
}

function stepCapy7(){
  if(currentScreen!=='capy7')return;
  if(capy7CutsceneActive){stepCapy7Cutscene();return;}
  if(!capy7Running)return;
  // Move logs
  capy7Logs.forEach(function(l){l.x+=l.speed*0.15;if(l.x>COLS+2)l.x=-l.len-1;if(l.x+l.len<-2)l.x=COLS+1;});
  // Check if player is on a log (moves with it)
  if(capy7Player.y>=C7_WATER_START&&capy7Player.y<=C7_WATER_END){
    var onLog=false;
    capy7Logs.forEach(function(l){if(l.y===capy7Player.y&&capy7Player.x>=Math.floor(l.x)&&capy7Player.x<Math.floor(l.x)+l.len){onLog=true;capy7Player.x+=l.speed*0.15;}});
    if(!onLog)die();
    if(capy7Player.x<0||capy7Player.x>=COLS)die();
  }
  // Check win
  if(capy7Player.y<=C7_ISLAND_TOP){capy7Won=true;capy7CutsceneActive=true;capy7CutsceneFrame=0;capy7KnightX=0;}
  // Check sloth
  if(slothPos&&Math.floor(capy7Player.x)===slothPos.x&&capy7Player.y===slothPos.y){openSlothShop();return;}
  drawCapy7();
}

function stepCapy7Cutscene(){
  capy7CutsceneFrame++;
  if(capy7CutsceneFrame<60){capy7KnightX=capy7CutsceneFrame*3;}
  drawCapy7Cutscene();
  if(capy7CutsceneFrame>=120){clearInterval(tickInterval);msgEl.textContent='Press ESC to return';}
}

function drawCapy7(){
  var cellH=canvas.height/C7_ROWS;
  // Sky
  ctx.fillStyle='#87CEEB';ctx.fillRect(0,0,canvas.width,C7_ISLAND_TOP*cellH);
  // Top island
  ctx.fillStyle='#2ecc71';ctx.fillRect(0,C7_ISLAND_TOP*cellH,canvas.width,cellH);
  // Castle on top island
  ctx.fillStyle='#c0a882';ctx.fillRect(canvas.width/2-20,(C7_ISLAND_TOP)*cellH-10,40,cellH+8);
  ctx.fillStyle='#9b59b6';ctx.fillRect(canvas.width/2-5,(C7_ISLAND_TOP)*cellH-18,10,10);
  // Water
  for(var wy=C7_WATER_START;wy<=C7_WATER_END;wy++){
    var waveOff=Math.sin(Date.now()/500+wy)*2;
    ctx.fillStyle=wy%2===0?'#2980b9':'#3498db';
    ctx.fillRect(0,wy*cellH,canvas.width,cellH);
    // Wave shimmer
    ctx.fillStyle='rgba(255,255,255,0.05)';
    ctx.fillRect(waveOff*5,wy*cellH,canvas.width,cellH/2);
  }
  // Logs
  ctx.fillStyle='#8B6914';
  capy7Logs.forEach(function(l){
    var lx=Math.floor(l.x)*GRID,ly=l.y*cellH;
    ctx.fillStyle='#6d4c1d';ctx.fillRect(lx+1,ly+2,l.len*GRID-2,cellH-4);
    ctx.fillStyle='#8B6914';ctx.fillRect(lx+2,ly+3,l.len*GRID-4,cellH-6);
    // Wood grain
    ctx.strokeStyle='#5a3e10';ctx.lineWidth=0.5;
    for(var gi=0;gi<l.len;gi++){ctx.beginPath();ctx.moveTo(lx+gi*GRID+GRID/2,ly+3);ctx.lineTo(lx+gi*GRID+GRID/2,ly+cellH-3);ctx.stroke();}
  });
  // Bottom island
  ctx.fillStyle='#f4d03f';ctx.fillRect(0,C7_ISLAND_BOT*cellH,canvas.width,cellH*2);
  ctx.fillStyle='#2ecc71';
  ctx.beginPath();ctx.ellipse(canvas.width/2,C7_ISLAND_BOT*cellH,canvas.width/2+10,8,0,0,Math.PI*2);ctx.fill();
  // Palm tree
  ctx.fillStyle='#6d4c1d';ctx.fillRect(50,C7_ISLAND_BOT*cellH-25,6,25);
  ctx.fillStyle='#27ae60';
  ctx.beginPath();ctx.ellipse(53,(C7_ISLAND_BOT)*cellH-28,15,6,-.3,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(53,(C7_ISLAND_BOT)*cellH-25,12,5,.3,0,Math.PI*2);ctx.fill();
  // Sloth on island
  if(slothPos)drawSloth(slothPos.x,slothPos.y);
  // Player (purple knight without weapons)
  if(capy7Player){
    var px=Math.floor(capy7Player.x)*GRID+GRID/2,py=capy7Player.y*cellH+cellH/2;
    ctx.fillStyle='#9b59b6';ctx.beginPath();ctx.arc(px,py,7,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#7d3c98';ctx.beginPath();ctx.arc(px-4,py-5,2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px+4,py-5,2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(px-2.5,py-2,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px+2.5,py-2,1.5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(px-2.5,py-2,0.7,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px+2.5,py-2,0.7,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#6c3483';ctx.beginPath();ctx.ellipse(px,py+2,2,1.2,0,0,Math.PI*2);ctx.fill();
    // Armor ring
    ctx.strokeStyle='#9a8aba';ctx.lineWidth=1;ctx.beginPath();ctx.arc(px,py,8,0,Math.PI*2);ctx.stroke();
  }
  // Title
  ctx.fillStyle='#2980b9';ctx.shadowColor='#2980b9';ctx.shadowBlur=10;ctx.font='bold 28px Segoe UI';ctx.textAlign='center';ctx.fillText('Capy 7',canvas.width/2,16);ctx.shadowBlur=0;
  // HUD
  ctx.fillStyle='#eee';ctx.font='11px Segoe UI';ctx.textAlign='left';ctx.fillText('Rupees: '+rupees,5,canvas.height-5);
  ctx.textAlign='center';ctx.fillStyle='#666';ctx.font='12px Segoe UI';ctx.fillText('Arrow keys to move | ESC to return',canvas.width/2,canvas.height-5);
}

function drawCapy7Cutscene(){
  ctx.fillStyle='#87CEEB';ctx.fillRect(0,0,canvas.width,canvas.height*0.4);
  ctx.fillStyle='#2ecc71';ctx.fillRect(0,canvas.height*0.4,canvas.width,canvas.height*0.6);
  // Castle
  ctx.fillStyle='#c0a882';ctx.fillRect(300,canvas.height*0.25,60,canvas.height*0.2);
  ctx.fillStyle='#a08862';ctx.fillRect(310,canvas.height*0.18,15,30);ctx.fillRect(340,canvas.height*0.18,15,30);
  ctx.fillStyle='#9b59b6';ctx.fillRect(313,canvas.height*0.14,10,8);ctx.fillRect(343,canvas.height*0.14,10,8);
  // Knight running
  var kx=Math.min(capy7KnightX,280);
  ctx.fillStyle='#9b59b6';ctx.beginPath();ctx.arc(kx+20,canvas.height*0.38,10,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#7d3c98';ctx.beginPath();ctx.arc(kx+16,canvas.height*0.38-8,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(kx+24,canvas.height*0.38-8,3,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(kx+18,canvas.height*0.38-3,2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(kx+22,canvas.height*0.38-3,2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';ctx.beginPath();ctx.arc(kx+18,canvas.height*0.38-3,1,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(kx+22,canvas.height*0.38-3,1,0,Math.PI*2);ctx.fill();
  // Armor
  ctx.strokeStyle='#9a8aba';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(kx+20,canvas.height*0.38,12,0,Math.PI*2);ctx.stroke();
  // Text
  ctx.fillStyle='#2c3e50';ctx.font='bold 16px Segoe UI';ctx.textAlign='center';
  if(capy7CutsceneFrame<60){
    ctx.fillText('The knight reaches the castle...',canvas.width/2,40);
  }else{
    ctx.fillText('"I will wait here for my fellow knights."',canvas.width/2,40);
    // Speech bubble
    ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(kx+20,canvas.height*0.38-30,80,15,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#333';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(kx+20,canvas.height*0.38-30,80,15,0,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#333';ctx.font='10px Segoe UI';ctx.fillText('I will wait here for my fellow knights.',kx+20,canvas.height*0.38-27);
  }
  ctx.fillStyle='#555';ctx.font='12px Segoe UI';ctx.fillText('Press X to skip | ESC to return',canvas.width/2,canvas.height-15);
}

// === SLOTH SHOP ===
var slothShopOpen=false;
var slothPos=null;
var slothShopSelection=1;

function placeSloth(){
  if(!snake||snake.length===0)return null;
  return{x:snake[0].x,y:snake[0].y};
}

function drawSloth(sx,sy){
  var px=sx*GRID+GRID/2,py=sy*GRID+GRID/2;
  // Body (brown, round, hanging look)
  ctx.fillStyle='#8a7050';ctx.beginPath();ctx.ellipse(px,py+2,8,9,0,0,Math.PI*2);ctx.fill();
  // Lighter belly
  ctx.fillStyle='#a89070';ctx.beginPath();ctx.ellipse(px,py+4,5,5,0,0,Math.PI*2);ctx.fill();
  // Head
  ctx.fillStyle='#8a7050';ctx.beginPath();ctx.arc(px,py-6,7,0,Math.PI*2);ctx.fill();
  // Face markings (dark eye patches)
  ctx.fillStyle='#5a4030';
  ctx.beginPath();ctx.ellipse(px-3,py-6,3,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+3,py-6,3,2.5,0,0,Math.PI*2);ctx.fill();
  // Eyes (sleepy, half-closed)
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.ellipse(px-3,py-6,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+3,py-6,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  // Smile
  ctx.strokeStyle='#5a4030';ctx.lineWidth=0.7;
  ctx.beginPath();ctx.arc(px,py-3,2.5,0.1*Math.PI,0.9*Math.PI);ctx.stroke();
  // Nose
  ctx.fillStyle='#3a2a1a';ctx.beginPath();ctx.arc(px,py-4,1.2,0,Math.PI*2);ctx.fill();
  // Arms (long, reaching out)
  ctx.strokeStyle='#8a7050';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(px-7,py);ctx.quadraticCurveTo(px-14,py-5,px-12,py-10);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px+7,py);ctx.quadraticCurveTo(px+14,py-5,px+12,py-10);ctx.stroke();
  // Claws
  ctx.strokeStyle='#4a3a2a';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(px-12,py-10);ctx.lineTo(px-14,py-12);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px-12,py-10);ctx.lineTo(px-11,py-13);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px+12,py-10);ctx.lineTo(px+14,py-12);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px+12,py-10);ctx.lineTo(px+11,py-13);ctx.stroke();
  // Shop indicator
  ctx.fillStyle='#ffd700';ctx.font='bold 8px Segoe UI';ctx.textAlign='center';
  ctx.fillText('SHOP',px,py-15);
}

function openSlothShop(){
  slothShopOpen=true;slothShopSelection=1;
  clearInterval(tickInterval);
  drawSlothShop();
}

function drawSlothShop(){
  ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.textAlign='center';
  ctx.fillStyle='#ffd700';ctx.font='bold 24px Segoe UI';
  ctx.fillText('Sloth Shop',canvas.width/2,40);
  ctx.fillStyle='#2ecc71';ctx.font='16px Segoe UI';
  ctx.fillText('Rupees: '+rupees,canvas.width/2,70);
  var items=[
    {name:'Gold Orange',desc:'Activates shooting',cost:3},
    {name:'Extra Life',desc:'Revive + 3 capybaras',cost:7},
    {name:'Spike',desc:'Adds spike to tail',cost:12}
  ];
  items.forEach(function(item,i){
    var y=110+i*80;var num=i+1;
    var canBuy=rupees>=item.cost;var selected=slothShopSelection===num;
    ctx.fillStyle=selected?(canBuy?'#1a3a1a':'#2a1a1a'):(canBuy?'#1a2a1a':'#1a1a1a');
    ctx.fillRect(60,y-15,280,60);
    ctx.strokeStyle=selected?'#ffd700':(canBuy?'#2ecc71':'#333');ctx.lineWidth=selected?2:1;
    ctx.strokeRect(60,y-15,280,60);
    if(selected){ctx.fillStyle='#ffd700';ctx.font='bold 16px Segoe UI';ctx.textAlign='left';ctx.fillText('>',50,y+8);}
    ctx.fillStyle=canBuy?'#eee':'#555';ctx.font='bold 18px Segoe UI';ctx.textAlign='left';
    ctx.fillText(item.name,75,y+5);
    ctx.fillStyle=canBuy?'#aaa':'#444';ctx.font='13px Segoe UI';
    ctx.fillText(item.desc,75,y+25);
    ctx.fillStyle=canBuy?'#2ecc71':'#555';ctx.font='bold 16px Segoe UI';ctx.textAlign='right';
    ctx.fillText(item.cost+' rupees',330,y+10);
  });
  ctx.textAlign='center';ctx.fillStyle='#666';ctx.font='13px Segoe UI';
  ctx.fillText('Up/Down to select | Enter to buy | Alt to close',canvas.width/2,canvas.height-20);
  if(slothShopMsg){ctx.fillStyle='#ffd700';ctx.font='bold 14px Segoe UI';ctx.fillText(slothShopMsg,canvas.width/2,canvas.height-40);}
  msgEl.textContent='Sloth Shop — Rupees: '+rupees;
}

var slothShopMsg='';

function buyFromSloth(itemNum){
  if(itemNum===1&&rupees>=3){
    rupees-=3;shooting=true;shootEnd=Date.now()+8340;
    slothShopMsg='Gold Orange purchased!';
  }else if(itemNum===2&&rupees>=7){
    rupees-=7;extraLives++;
    slothShopMsg='Extra Life purchased! ('+extraLives+' total)';
  }else if(itemNum===3&&rupees>=12){
    rupees-=12;spikeCount++;
    slothShopMsg='Spike purchased!';
  }else{
    slothShopMsg='Not enough rupees!';
  }
  drawSlothShop();
  setTimeout(function(){slothShopMsg='';if(slothShopOpen)drawSlothShop();},1500);
}

function checkSlothCollision(){
  if(!slothPos||!snake||snake.length===0)return false;
  return snake[0].x===slothPos.x&&snake[0].y===slothPos.y;
}

// === MENU ===
var menuActive=true,gameSelectActive=false,gameDeleteMode=false,namingActive=false,nameInput='',renamingGameIdx=-1;

function drawMenu(){ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#00ff88';ctx.shadowColor='#00ff88';ctx.shadowBlur=20;ctx.font='bold 48px Segoe UI';ctx.textAlign='center';ctx.fillText('CrawlingCapys',canvas.width/2,100);ctx.shadowBlur=0;var cx=canvas.width/2;ctx.fillStyle='#8B6914';ctx.beginPath();ctx.arc(cx,160,20,0,Math.PI*2);ctx.fill();ctx.fillStyle='#6B4F10';ctx.beginPath();ctx.arc(cx-12,145,6,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+12,145,6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(cx-6,157,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+6,157,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#5a3e1b';ctx.beginPath();ctx.ellipse(cx,167,6,4,0,0,Math.PI*2);ctx.fill();var games=getAllGames();ctx.font='bold 22px Segoe UI';ctx.fillStyle='#00ff88';ctx.fillText('[1] New Game',cx,240);if(games.length>0){ctx.fillStyle='#ffd700';ctx.fillText('[2] Play Old Game',cx,285);ctx.font='14px Segoe UI';ctx.fillStyle='#888';ctx.fillText('('+games.length+' game'+(games.length>1?'s':'')+')',cx,310);}else{ctx.fillStyle='#555';ctx.font='18px Segoe UI';ctx.fillText('No old games yet',cx,285);}ctx.fillStyle='#555';ctx.font='13px Segoe UI';ctx.fillText('Capybara Snake — collect oranges, avoid danger',cx,canvas.height-20);msgEl.textContent='Press 1 for New Game, 2 for Old Game';}

function drawNamingScreen(){ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);var cx=canvas.width/2;ctx.fillStyle='#00ff88';ctx.font='bold 26px Segoe UI';ctx.textAlign='center';ctx.fillText('Name Your Game',cx,100);ctx.fillStyle='#16213e';ctx.fillRect(cx-140,140,280,40);ctx.strokeStyle='#00ff88';ctx.lineWidth=2;ctx.strokeRect(cx-140,140,280,40);ctx.fillStyle='#eee';ctx.font='20px Segoe UI';ctx.fillText(nameInput+(Math.floor(Date.now()/500)%2===0?'|':''),cx,167);ctx.fillStyle='#888';ctx.font='14px Segoe UI';ctx.fillText('Type a name and press Enter',cx,220);ctx.fillText('Press ESC to cancel',cx,245);msgEl.textContent='Type a name for your game';}

function drawRenameScreen(){ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);var cx=canvas.width/2;var games=getAllGames();var oldName=renamingGameIdx<games.length?games[renamingGameIdx].name:'';ctx.fillStyle='#ffd700';ctx.font='bold 26px Segoe UI';ctx.textAlign='center';ctx.fillText('Rename Game',cx,80);ctx.fillStyle='#888';ctx.font='14px Segoe UI';ctx.fillText('Current: '+oldName,cx,115);ctx.fillStyle='#16213e';ctx.fillRect(cx-140,140,280,40);ctx.strokeStyle='#ffd700';ctx.lineWidth=2;ctx.strokeRect(cx-140,140,280,40);ctx.fillStyle='#eee';ctx.font='20px Segoe UI';ctx.fillText(nameInput+(Math.floor(Date.now()/500)%2===0?'|':''),cx,167);ctx.fillStyle='#888';ctx.font='14px Segoe UI';ctx.fillText('Type new name and press Enter',cx,220);ctx.fillText('Press ESC to cancel',cx,245);msgEl.textContent='Rename your game';}

function drawGameSelect(){var games=getAllGames();ctx.fillStyle='rgba(0,0,0,0.9)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.textAlign='center';ctx.fillStyle='#ffd700';ctx.font='bold 22px Segoe UI';ctx.fillText('Select a Game',canvas.width/2,40);if(games.length===0){ctx.fillStyle='#888';ctx.font='16px Segoe UI';ctx.fillText('No games yet',canvas.width/2,canvas.height/2);}else{games.forEach(function(g,i){if(i>=9)return;var y=75+i*40;var date=new Date(g.created);var ds=date.toLocaleDateString();var sc=g.saves.length;var bs=sc>0?Math.max.apply(null,g.saves.map(function(s){return s.score;})):0;ctx.fillStyle='#eee';ctx.font='15px Segoe UI';ctx.fillText('['+(i+1)+'] '+g.name+' | Saves: '+sc+' | Best: '+bs+' | '+ds,canvas.width/2,y);});}ctx.fillStyle='#666';ctx.font='13px Segoe UI';if(gameDeleteMode){ctx.fillStyle='#ff4757';ctx.fillText('DELETE — Press number to delete | ESC to cancel',canvas.width/2,canvas.height-20);msgEl.textContent='Delete mode';}else{ctx.fillText('Number=select | R+num=rename | X=delete | ESC=back',canvas.width/2,canvas.height-20);msgEl.textContent='Pick a game';}}

document.addEventListener('keydown',function menuHandler(e){
  if(!menuActive)return;
  if(namingActive){if(e.key==='Escape'){namingActive=false;nameInput='';drawMenu();return;}if(e.key==='Enter'){var name=nameInput.trim()||'Game '+(getAllGames().length+1);namingActive=false;nameInput='';createNewGame(name);return;}if(e.key==='Backspace'){e.preventDefault();nameInput=nameInput.slice(0,-1);drawNamingScreen();return;}if(e.key.length===1&&nameInput.length<20){nameInput+=e.key;drawNamingScreen();}return;}
  if(renamingGameIdx>=0){if(e.key==='Escape'){renamingGameIdx=-1;nameInput='';drawGameSelect();return;}if(e.key==='Enter'){var games=getAllGames();if(renamingGameIdx<games.length&&nameInput.trim()){games[renamingGameIdx].name=nameInput.trim();saveAllGames(games);}renamingGameIdx=-1;nameInput='';drawGameSelect();return;}if(e.key==='Backspace'){e.preventDefault();nameInput=nameInput.slice(0,-1);drawRenameScreen();return;}if(e.key.length===1&&nameInput.length<20){nameInput+=e.key;drawRenameScreen();}return;}
  if(gameSelectActive){if(e.key==='Escape'){if(gameDeleteMode){gameDeleteMode=false;drawGameSelect();}else{gameSelectActive=false;drawMenu();}return;}if((e.key==='x'||e.key==='X')&&!gameDeleteMode){gameDeleteMode=true;drawGameSelect();return;}if(gameDeleteMode){var slot=parseInt(e.key)-1;var games2=getAllGames();if(slot>=0&&slot<games2.length){games2.splice(slot,1);saveAllGames(games2);gameDeleteMode=false;if(games2.length===0){gameSelectActive=false;drawMenu();}else drawGameSelect();}return;}if(e.key==='r'||e.key==='R'){msgEl.textContent='Press number of game to rename...';var rh=function(e2){document.removeEventListener('keydown',rh,true);var sl=parseInt(e2.key)-1;var gms=getAllGames();if(sl>=0&&sl<gms.length){renamingGameIdx=sl;nameInput=gms[sl].name;drawRenameScreen();}else drawGameSelect();e2.stopPropagation();e2.preventDefault();};document.addEventListener('keydown',rh,true);return;}var slot2=parseInt(e.key)-1;var games3=getAllGames();if(slot2>=0&&slot2<games3.length){gameSelectActive=false;menuActive=false;currentGameId=games3[slot2].id;creativeMode=(games3[slot2].name==='CapyBopyCIG');gameOver=false;if(games3[slot2].saves.length>0){saveMenuOpen=true;deleteMode2=false;showSaveMenu();}else{init();restartTimer();}}return;}
  if(e.key==='1'){namingActive=true;nameInput='';drawNamingScreen();}
  else if(e.key==='2'){var games4=getAllGames();if(games4.length>0){gameSelectActive=true;gameDeleteMode=false;drawGameSelect();}}
});

drawMenu();
