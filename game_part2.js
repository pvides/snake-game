
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
  if(capy2Enemies.length===0){returnToMainGame();spikeCount++;saveGame();msgEl.textContent='Enemies cleared! Spike earned!';setTimeout(function(){if(!gameOver)msgEl.textContent='';},2000);return;}
  dir={x:nextDir.x,y:nextDir.y};var head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  if(head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS)return die();
  if(snake.some(function(s){return s.x===head.x&&s.y===head.y;}))return die();
  capy2Tick++;
  capy2Enemies.forEach(function(e){if(e.type==='raccoon'&&Math.random()>0.79)return;if(Math.random()<0.3)e.dir=DIRS[Math.floor(Math.random()*4)];var nx=e.x+e.dir.x,ny=e.y+e.dir.y;if(nx<0||nx>=COLS||ny<0||ny>=ROWS){e.dir={x:-e.dir.x,y:-e.dir.y};e.x+=e.dir.x;e.y+=e.dir.y;}else{e.x=nx;e.y=ny;}});
  if(capy2Beaver){capy2Enemies.filter(function(e){return e.type==='raccoon';}).forEach(function(e){if(Math.random()<0.5){var dx=Math.sign(capy2Beaver.x-e.x),dy=Math.sign(capy2Beaver.y-e.y);if(Math.abs(capy2Beaver.x-e.x)>=Math.abs(capy2Beaver.y-e.y)){var nx=e.x+dx;if(nx>=0&&nx<COLS)e.x=nx;}else{var ny=e.y+dy;if(ny>=0&&ny<ROWS)e.y=ny;}}});var cb=capy2Enemies.some(function(e){return e.type==='raccoon'&&e.x===capy2Beaver.x&&e.y===capy2Beaver.y;});if(cb)capy2Beaver=null;}
  if(capy2Beaver){var wombats=capy2Enemies.filter(function(e){return e.type==='wombat';});if(wombats.length>0){var near=null,bd=Infinity;wombats.forEach(function(w){var d=Math.abs(w.x-capy2Beaver.x)+Math.abs(w.y-capy2Beaver.y);if(d<bd){bd=d;near=w;}});if(near){var dx2=Math.sign(near.x-capy2Beaver.x),dy2=Math.sign(near.y-capy2Beaver.y);if(Math.abs(near.x-capy2Beaver.x)>=Math.abs(near.y-capy2Beaver.y))capy2Beaver.x+=dx2;else capy2Beaver.y+=dy2;var ci=capy2Enemies.findIndex(function(e){return e.type==='wombat'&&e.x===capy2Beaver.x&&e.y===capy2Beaver.y;});if(ci!==-1){capy2Enemies.splice(ci,1);totalWombatKills++;}}}}
  var hitR=capy2Enemies.some(function(e){return e.type==='raccoon'&&(snake.some(function(s){return s.x===e.x&&s.y===e.y;})||(head.x===e.x&&head.y===e.y));});
  var hitW=capy2Enemies.some(function(e){return e.type==='wombat'&&(snake.some(function(s){return s.x===e.x&&s.y===e.y;})||(head.x===e.x&&head.y===e.y));});
  if(hitW){if(goldCount<=1)return die();goldCount-=2;score=goldCount;scoreEl.textContent=score;var kl=1+Math.max(1,goldCount);if(snake.length>kl)snake.length=kl;}
  if(hitR){if(goldCount<=0)return die();goldCount--;score=goldCount;scoreEl.textContent=score;var kl2=1+Math.max(1,goldCount);if(snake.length>kl2)snake.length=kl2;}
  snake.unshift(head);
  if((head.x===COLS-1||head.x===COLS-2)&&(head.y===0||head.y===1)&&(capy2Beaver||creativeMode)){enterCapy4();return;}
  var oIdx=capy2Oranges.findIndex(function(o4){return o4.x===head.x&&o4.y===head.y;});
  if(oIdx!==-1){capy2Oranges.splice(oIdx,1);goldCount++;score=goldCount;scoreEl.textContent=score;if(score>best){best=score;bestEl.textContent=best;}dailyOrangesEaten++;snake.pop();}
  else{var gIdx=capy2GoldOranges.findIndex(function(g2){return g2.x===head.x&&g2.y===head.y;});
    if(gIdx!==-1){capy2GoldOranges.splice(gIdx,1);shooting=true;shootEnd=Date.now()+8340;dailyShootsActivated++;snake.pop();}
    else{var cIdx=capy2Capybaras.findIndex(function(c2){return c2.x===head.x&&c2.y===head.y;});if(cIdx!==-1)capy2Capybaras.splice(cIdx,1);else snake.pop();}
  }
  if(shooting){bullets=[];var h=snake[0];var bx=h.x+dir.x,by=h.y+dir.y;while(bx>=0&&bx<COLS&&by>=0&&by<ROWS){bullets.push({x:bx,y:by});bx+=dir.x;by+=dir.y;}bullets.forEach(function(b){var hi=capy2Enemies.findIndex(function(e){return e.x===b.x&&e.y===b.y;});if(hi!==-1){var kt=capy2Enemies[hi].type;capy2Enemies.splice(hi,1);if(kt==='raccoon')totalRaccoonKills++;else if(kt==='wombat')totalWombatKills++;}});if(Date.now()>=shootEnd){shooting=false;bullets=[];}}
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
  killCount=mainGameState.killCount;spikeCount=mainGameState.spikeCount||0;rupees=mainGameState.rupees||0;extraLives=mainGameState.extraLives||0;ownedPortals=mainGameState.ownedPortals||[];happyBeaverCount=mainGameState.happyBeaverCount||0;
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
function saveAllGames(games){try{localStorage.setItem('crawlingCapysGames',JSON.stringify(games));}catch(e){msgEl.textContent='Save failed — storage full!';setTimeout(function(){if(!gameOver)msgEl.textContent='';},2000);}}
function getCurrentGame(){var games=getAllGames();return games.find(function(g){return g.id===currentGameId;})||null;}

function getGameState(){return{snake:JSON.parse(JSON.stringify(snake)),dir:{x:dir.x,y:dir.y},nextDir:{x:nextDir.x,y:nextDir.y},food:{x:food.x,y:food.y},score:score,goldCount:goldCount,wanderer:wanderer?{x:wanderer.x,y:wanderer.y}:null,enemies:JSON.parse(JSON.stringify(enemies)),lastEnemyThreshold:lastEnemyThreshold,running:running,killCount:killCount,spikeCount:spikeCount,rupees:rupees,extraLives:extraLives,ownedPortals:JSON.parse(JSON.stringify(ownedPortals)),happyBeaverCount:happyBeaverCount,totalRaccoonKills:totalRaccoonKills,totalWombatKills:totalWombatKills,capy5Beaten:capy5Beaten,capy7Beaten:capy7Beaten,claimedQuests:JSON.parse(JSON.stringify(claimedQuests)),dailyOrangesEaten:dailyOrangesEaten,dailyShootsActivated:dailyShootsActivated,currentScreen:currentScreen,timestamp:Date.now()};}

function saveGame(){if(gameOver||!currentGameId)return;var state=getGameState();var games=getAllGames();var gm=games.find(function(g){return g.id===currentGameId;});if(!gm)return;gm.saves.unshift(state);if(gm.saves.length>MAX_SAVES)gm.saves.length=MAX_SAVES;saveAllGames(games);msgEl.textContent='Game saved! ('+gm.saves.length+'/'+MAX_SAVES+' slots)';setTimeout(function(){if(!gameOver)msgEl.textContent='';},1500);}

function loadGame(slotIndex){var gm=getCurrentGame();if(!gm||slotIndex>=gm.saves.length)return;var state=gm.saves[slotIndex];clearInterval(tickInterval);if(goldOrangeTimer)clearTimeout(goldOrangeTimer);if(beaverTimer)clearTimeout(beaverTimer);if(beaverLogInterval)clearInterval(beaverLogInterval);if(autoSaveInterval)clearInterval(autoSaveInterval);snake=state.snake;dir=state.dir;nextDir=state.nextDir;food=state.food;score=state.score;goldCount=state.goldCount;wanderer=state.wanderer;if(!wanderer){setTimeout(function rWL(){if(gameOver)return;if(currentScreen!=='main'){setTimeout(rWL,1000);return;}placeWanderer();draw();},2170);}enemies=state.enemies;lastEnemyThreshold=state.lastEnemyThreshold;running=true;killCount=state.killCount;spikeCount=state.spikeCount||0;rupees=state.rupees||0;extraLives=state.extraLives||0;ownedPortals=state.ownedPortals||[];happyBeaverCount=state.happyBeaverCount||0;totalRaccoonKills=state.totalRaccoonKills||0;totalWombatKills=state.totalWombatKills||0;capy5Beaten=state.capy5Beaten||false;capy7Beaten=state.capy7Beaten||false;claimedQuests=state.claimedQuests||[];dailyOrangesEaten=state.dailyOrangesEaten||0;dailyShootsActivated=state.dailyShootsActivated||0;var savedScreen=state.currentScreen||'main';currentScreen='main';gameOver=false;menuActive=false;saveMenuOpen=false;cutsceneActive=false;deathChoicePending=false;slothShopOpen=false;questShopOpen=false;saveBrowseActive=false;goldOrange=null;bullets=[];shooting=false;shootEnd=0;beaver=null;beaverLogs=[];storms=[];purpleShieldEnd=0;vacuumEnd=0;lastGoldOrangeEatTime=0;scoreEl.textContent=score;if(score>best){best=score;bestEl.textContent=best;}
  if(savedScreen==='capy2'){mainGameState=getGameState();enterCapy2();}
  else if(savedScreen==='capy3'){mainGameState=getGameState();enterCapy3();}
  else if(savedScreen==='capy4'){mainGameState=getGameState();enterCapy4();}
  else if(savedScreen==='capy5'){mainGameState=getGameState();enterCapy5();}
  else if(savedScreen==='capy7'){mainGameState=getGameState();enterCapy7();}
  else if(savedScreen==='capy6'){mainGameState=getGameState();enterCapy6();}
  else if(savedScreen==='capy8'){mainGameState=getGameState();enterCapy8();}
  else if(savedScreen==='sloth2'){mainGameState=getGameState();enterSloth2();}
  else{scheduleGoldOrange();scheduleBeaver();startAutoSave();restartTimer();draw();}
  msgEl.textContent='Game loaded!';setTimeout(function(){if(!gameOver)msgEl.textContent='';},1500);}

function getSavesList(){var gm=getCurrentGame();return gm?gm.saves:[];}

function showSaveMenu(){var saves=getSavesList();var isDel=deleteMode2||saveBrowseDelete;ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.textAlign='center';if(isDel){ctx.fillStyle='#ff4757';ctx.font='bold 22px Segoe UI';ctx.fillText('Delete Save',canvas.width/2,40);}else{ctx.fillStyle='#00ff88';ctx.font='bold 22px Segoe UI';ctx.fillText('Saves',canvas.width/2,40);}if(saves.length===0){ctx.fillStyle='#888';ctx.font='16px Segoe UI';ctx.fillText('No saves yet',canvas.width/2,canvas.height/2);}else{var maxShow=Math.min(saves.length,7);for(var i=0;i<maxShow;i++){var y=75+i*50;var date=new Date(saves[i].timestamp);var ts=date.toLocaleTimeString();ctx.fillStyle=isDel?'#ff6b7a':'#eee';ctx.font='16px Segoe UI';ctx.fillText('['+(i+1)+'] Score: '+saves[i].score+' | Gold: '+saves[i].goldCount+' | '+ts,canvas.width/2,y);}if(saves.length>7){ctx.fillStyle='#888';ctx.font='12px Segoe UI';ctx.fillText('('+(saves.length-7)+' more saves...)',canvas.width/2,75+7*50);}}ctx.fillStyle='#666';ctx.font='13px Segoe UI';ctx.fillText(isDel?'Number/click to delete | ESC cancel':'Number/click to load | X delete | Space resume | ESC back',canvas.width/2,canvas.height-20);msgEl.textContent=isDel?'Delete mode':'Pick a save';}

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

function stepCapy5(){if(!capy5Running||currentScreen!=='capy5')return;if(shieldUses<=0&&Date.now()>=shieldRechargeEnd)shieldUses=3;if(swordUses<=0&&Date.now()>=swordRechargeEnd)swordUses=5;if(swordSpinActive&&Date.now()>=swordSpinEnd){swordSpinActive=false;swordSpinHit=false;}if(swordSpinActive&&capy5Player&&!swordSpinHit){swordSpinHit=true;for(var i=capy5Enemies.length-1;i>=0;i--){var e=capy5Enemies[i];if(Math.abs(e.x-capy5Player.x)<=1&&Math.abs(e.y-capy5Player.y)<=1){e.hp--;if(e.hp<=0){capy5Enemies.splice(i,1);rupees+=1;}}}if(capy5Boss&&Math.abs(capy5Boss.x-capy5Player.x)<=2&&Math.abs(capy5Boss.y-capy5Player.y)<=2){capy5Boss.armor--;if(capy5Boss.armor<=0){capy5Boss=null;rupees+=3;}}}if(!capy5Victory&&capy5Enemies.length===0&&!capy5Boss){capy5Victory=true;capy5Beaten=true;capy5Portals=[{x:5,y:Math.floor(ROWS/2),label:'Sloth 1',color:'#ff6b6b',dest:'capy6'},{x:10,y:Math.floor(ROWS/2),label:'Capy 7',color:'#ffd93d',dest:'capy7'},{x:15,y:Math.floor(ROWS/2),label:'Sloth 3',color:'#6bcb77',dest:'capy8'}];capy5Present={x:capy5Player.x+2,y:capy5Player.y};capy5Present.x=Math.max(0,Math.min(COLS-1,capy5Present.x));}if(!capy5MoveQueued){moveCapy5Enemies();checkCapy5PlayerHits();drawCapy5();return;}capy5MoveQueued=false;dir={x:nextDir.x,y:nextDir.y};capy5Player.facing={x:dir.x,y:dir.y};var nx=capy5Player.x+dir.x*(capy5Victory?1:2),ny=capy5Player.y+dir.y*(capy5Victory?1:2);capy5Player.x=Math.max(0,Math.min(COLS-1,nx));capy5Player.y=Math.max(0,Math.min(ROWS-1,ny));moveCapy5Enemies();checkCapy5PlayerHits();if(!capy5Victory&&capy5Enemies.length===0&&!capy5Boss){capy5Victory=true;capy5Beaten=true;capy5Portals=[{x:5,y:Math.floor(ROWS/2),label:'Sloth 1',color:'#ff6b6b',dest:'capy6'},{x:10,y:Math.floor(ROWS/2),label:'Capy 7',color:'#ffd93d',dest:'capy7'},{x:15,y:Math.floor(ROWS/2),label:'Sloth 3',color:'#6bcb77',dest:'capy8'}];capy5Present={x:capy5Player.x+2,y:capy5Player.y};capy5Present.x=Math.max(0,Math.min(COLS-1,capy5Present.x));}if(capy5Present&&capy5Player&&capy5Player.x===capy5Present.x&&capy5Player.y===capy5Present.y){rupees+=2;msgEl.textContent='+2 rupees!';setTimeout(function(){if(!gameOver)msgEl.textContent='';},1000);capy5Present=null;}if(capy5Victory&&capy5Player){var hitP=capy5Portals.find(function(p){return p.x===capy5Player.x&&p.y===capy5Player.y;});if(hitP){clearInterval(tickInterval);if(hitP.dest==='capy6'){enterCapy6();}else if(hitP.dest==='capy7'){enterCapy7();}else if(hitP.dest==='capy8'){enterCapy8();}else{msgEl.textContent=hitP.label+' — Coming Soon!';}drawCapy5();return;}}drawCapy5();}

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

// === CAPY 6 (Sloth 1) ===
var capy6Running=false,capy6CutsceneActive=false,capy6CutsceneFrame=0,capy6KnightX=0,capy6Player=null,capy6MoveQueued=false,sloth1Merchants=[],sloth1RedSloth=null;

function enterCapy6(){
  if(!mainGameState)mainGameState=getGameState();
  currentScreen='capy6';clearInterval(tickInterval);
  capy6CutsceneActive=true;capy6CutsceneFrame=0;capy6KnightX=0;capy6Running=false;capy6MoveQueued=false;
  tickInterval=setInterval(stepCapy6,100);
}

function stepCapy6(){
  if(currentScreen!=='capy6')return;
  if(capy6CutsceneActive){
    capy6CutsceneFrame++;
    if(capy6CutsceneFrame<60)capy6KnightX=capy6CutsceneFrame*3;
    drawCastleCutscene(capy6KnightX,capy6CutsceneFrame,'Sloth 1');
    if(capy6CutsceneFrame>=120){capy6CutsceneActive=false;startCapy6();}
    return;
  }
  if(!capy6Running||!capy6MoveQueued){drawCapy6Game();return;}
  capy6MoveQueued=false;
  var nx=capy6Player.x+nextDir.x,ny=capy6Player.y+nextDir.y;
  if(nx>=0&&nx<COLS&&ny>=0&&ny<ROWS){capy6Player.x=nx;capy6Player.y=ny;}
  var hitM1=null;sloth1Merchants.forEach(function(m){if(m.x===capy6Player.x&&m.y===capy6Player.y)hitM1=m;});
  if(hitM1){slothPos=capy6Player;if(hitM1.purple){openBeaverShop();}else if(hitM1.yellow){openGamble();}else if(hitM1.orange){openInfoShop();}else if(hitM1.scam){openScamShop();}else if(hitM1.blue&&isBlueHour()){openBlueShop();}else{openSlothShop();}return;}
  if(sloth1RedSloth&&capy6Player.x===sloth1RedSloth.x&&capy6Player.y===sloth1RedSloth.y){openPortalShop([{name:'Sloth 2',cost:13,dest:'sloth2'},{name:'Sloth 3',cost:11,dest:'capy8'}]);return;}
  drawCapy6Game();
}

function startCapy6(){
  capy6Player={x:Math.floor(COLS/2),y:Math.floor(ROWS/2)};
  capy6Running=false;capy6MoveQueued=false;
  sloth1Merchants=[];
  for(var si=0;si<7;si++){var sx,sy;do{sx=2+Math.floor(Math.random()*(COLS-4));sy=2+Math.floor(Math.random()*(ROWS-4));}while(sx===capy6Player.x&&sy===capy6Player.y||sloth1Merchants.some(function(m){return m.x===sx&&m.y===sy;}));sloth1Merchants.push({x:sx,y:sy,purple:si===0,blue:si===3,yellow:si===4,orange:si===5,scam:si===6});}
  var rsx,rsy;do{rsx=2+Math.floor(Math.random()*(COLS-4));rsy=2+Math.floor(Math.random()*(ROWS-4));}while(rsx===capy6Player.x&&rsy===capy6Player.y||sloth1Merchants.some(function(m){return m.x===rsx&&m.y===rsy;}));sloth1RedSloth={x:rsx,y:rsy};
  drawCapy6Game();msgEl.textContent='Sloth 1 — Arrow keys to move, ESC to return';
}

function drawCapy6Game(){
  ctx.fillStyle='#1a0a0a';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle='#2e1a1a';ctx.lineWidth=0.5;
  for(var i=0;i<=COLS;i++){ctx.beginPath();ctx.moveTo(i*GRID,0);ctx.lineTo(i*GRID,canvas.height);ctx.stroke();}
  for(var i2=0;i2<=ROWS;i2++){ctx.beginPath();ctx.moveTo(0,i2*GRID);ctx.lineTo(canvas.width,i2*GRID);ctx.stroke();}
  if(capy6Player){
    var px=capy6Player.x*GRID+GRID/2,py=capy6Player.y*GRID+GRID/2;
    ctx.fillStyle='#f5cba7';ctx.beginPath();ctx.arc(px,py,7,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#3b2314';ctx.beginPath();ctx.ellipse(px,py-5,7,3.5,0,0,Math.PI);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(px-2.5,py-2,1.8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px+2.5,py-2,1.8,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#4a6a3a';ctx.beginPath();ctx.arc(px-2.5,py-2,0.9,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px+2.5,py-2,0.9,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#c07060';ctx.lineWidth=0.8;ctx.beginPath();ctx.arc(px,py+1,2,0.1*Math.PI,0.9*Math.PI);ctx.stroke();
    ctx.fillStyle='#5b7daa';ctx.beginPath();ctx.ellipse(px,py+8,5,5,0,0,Math.PI*2);ctx.fill();
  }
  sloth1Merchants.forEach(function(m){if(m.purple)drawPurpleSloth(m.x,m.y);else if(m.yellow)drawYellowSloth(m.x,m.y);else if(m.orange)drawOrangeSloth(m.x,m.y);else if(m.scam)drawScamSloth(m.x,m.y);else if(m.blue&&isBlueHour())drawBlueSloth(m.x,m.y);else drawSloth(m.x,m.y);});
  if(sloth1RedSloth)drawRedSloth(sloth1RedSloth.x,sloth1RedSloth.y);
  ctx.fillStyle='#ff6b6b';ctx.shadowColor='#ff6b6b';ctx.shadowBlur=15;ctx.font='bold 42px Segoe UI';ctx.textAlign='center';ctx.fillText('Sloth 1',canvas.width/2,36);ctx.shadowBlur=0;
  ctx.fillStyle='#666';ctx.font='14px Segoe UI';ctx.fillText('Coming Soon — Press ESC to return',canvas.width/2,canvas.height-15);
}

// === CAPY 8 (Sloth 3) ===
var capy8Running=false,capy8CutsceneActive=false,capy8CutsceneFrame=0,capy8KnightX=0,capy8Player=null,capy8MoveQueued=false,sloth3Merchants=[],sloth3RedSloth=null;

function enterCapy8(){
  if(!mainGameState)mainGameState=getGameState();
  currentScreen='capy8';clearInterval(tickInterval);
  capy8CutsceneActive=true;capy8CutsceneFrame=0;capy8KnightX=0;capy8Running=false;capy8MoveQueued=false;
  tickInterval=setInterval(stepCapy8,100);
}

function stepCapy8(){
  if(currentScreen!=='capy8')return;
  if(capy8CutsceneActive){
    capy8CutsceneFrame++;
    if(capy8CutsceneFrame<60)capy8KnightX=capy8CutsceneFrame*3;
    drawCastleCutscene(capy8KnightX,capy8CutsceneFrame,'Sloth 3');
    if(capy8CutsceneFrame>=120){capy8CutsceneActive=false;startCapy8();}
    return;
  }
  if(!capy8Running||!capy8MoveQueued){drawCapy8Game();return;}
  capy8MoveQueued=false;
  var nx=capy8Player.x+nextDir.x,ny=capy8Player.y+nextDir.y;
  if(nx>=0&&nx<COLS&&ny>=0&&ny<ROWS){capy8Player.x=nx;capy8Player.y=ny;}
  var hitM3=null;sloth3Merchants.forEach(function(m){if(m.x===capy8Player.x&&m.y===capy8Player.y)hitM3=m;});
  if(hitM3){slothPos=capy8Player;if(hitM3.purple){openBeaverShop();}else if(hitM3.yellow){openGamble();}else if(hitM3.orange){openInfoShop();}else if(hitM3.scam){openScamShop();}else if(hitM3.blue&&isBlueHour()){openBlueShop();}else{openSlothShop();}return;}
  if(sloth3RedSloth&&capy8Player.x===sloth3RedSloth.x&&capy8Player.y===sloth3RedSloth.y){openPortalShop([{name:'Sloth 1',cost:11,dest:'capy6'},{name:'Sloth 2',cost:13,dest:'sloth2'}]);return;}
  drawCapy8Game();
}

function startCapy8(){
  capy8Player={x:Math.floor(COLS/2),y:Math.floor(ROWS/2)};
  capy8Running=false;capy8MoveQueued=false;
  sloth3Merchants=[];
  for(var si=0;si<7;si++){var sx,sy;do{sx=2+Math.floor(Math.random()*(COLS-4));sy=2+Math.floor(Math.random()*(ROWS-4));}while(sx===capy8Player.x&&sy===capy8Player.y||sloth3Merchants.some(function(m){return m.x===sx&&m.y===sy;}));sloth3Merchants.push({x:sx,y:sy,purple:si===0,blue:si===3,yellow:si===4,orange:si===5,scam:si===6});}
  var rsx2,rsy2;do{rsx2=2+Math.floor(Math.random()*(COLS-4));rsy2=2+Math.floor(Math.random()*(ROWS-4));}while(rsx2===capy8Player.x&&rsy2===capy8Player.y||sloth3Merchants.some(function(m){return m.x===rsx2&&m.y===rsy2;}));sloth3RedSloth={x:rsx2,y:rsy2};
  drawCapy8Game();msgEl.textContent='Sloth 3 — Arrow keys to move, ESC to return';
}

function drawCapy8Game(){
  ctx.fillStyle='#0a1a0a';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle='#1a2e1a';ctx.lineWidth=0.5;
  for(var i=0;i<=COLS;i++){ctx.beginPath();ctx.moveTo(i*GRID,0);ctx.lineTo(i*GRID,canvas.height);ctx.stroke();}
  for(var i2=0;i2<=ROWS;i2++){ctx.beginPath();ctx.moveTo(0,i2*GRID);ctx.lineTo(canvas.width,i2*GRID);ctx.stroke();}
  if(capy8Player){
    var px=capy8Player.x*GRID+GRID/2,py=capy8Player.y*GRID+GRID/2;
    ctx.fillStyle='#f5cba7';ctx.beginPath();ctx.arc(px,py,7,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#3b2314';ctx.beginPath();ctx.ellipse(px,py-5,7,3.5,0,0,Math.PI);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(px-2.5,py-2,1.8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px+2.5,py-2,1.8,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#4a6a3a';ctx.beginPath();ctx.arc(px-2.5,py-2,0.9,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px+2.5,py-2,0.9,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#c07060';ctx.lineWidth=0.8;ctx.beginPath();ctx.arc(px,py+1,2,0.1*Math.PI,0.9*Math.PI);ctx.stroke();
    ctx.fillStyle='#5b7daa';ctx.beginPath();ctx.ellipse(px,py+8,5,5,0,0,Math.PI*2);ctx.fill();
  }
  sloth3Merchants.forEach(function(m){if(m.purple)drawPurpleSloth(m.x,m.y);else if(m.yellow)drawYellowSloth(m.x,m.y);else if(m.orange)drawOrangeSloth(m.x,m.y);else if(m.scam)drawScamSloth(m.x,m.y);else if(m.blue&&isBlueHour())drawBlueSloth(m.x,m.y);else drawSloth(m.x,m.y);});
  if(sloth3RedSloth)drawRedSloth(sloth3RedSloth.x,sloth3RedSloth.y);
  ctx.fillStyle='#6bcb77';ctx.shadowColor='#6bcb77';ctx.shadowBlur=15;ctx.font='bold 42px Segoe UI';ctx.textAlign='center';ctx.fillText('Sloth 3',canvas.width/2,36);ctx.shadowBlur=0;
  ctx.fillStyle='#666';ctx.font='14px Segoe UI';ctx.fillText('Coming Soon — Press ESC to return',canvas.width/2,canvas.height-15);
}

// Shared castle cutscene for Capy 6/8
function drawCastleCutscene(knightX,frame,title){
  // Sky gradient
  var skyGrad=ctx.createLinearGradient(0,0,0,canvas.height*0.4);
  skyGrad.addColorStop(0,'#4a90d9');skyGrad.addColorStop(1,'#87CEEB');
  ctx.fillStyle=skyGrad;ctx.fillRect(0,0,canvas.width,canvas.height*0.4);
  // Clouds
  ctx.fillStyle='rgba(255,255,255,0.6)';
  ctx.beginPath();ctx.arc(80,50,15,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(98,45,18,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(115,50,14,0,Math.PI*2);ctx.fill();
  // Ground
  var groundGrad=ctx.createLinearGradient(0,canvas.height*0.4,0,canvas.height);
  groundGrad.addColorStop(0,'#3ecc71');groundGrad.addColorStop(1,'#1a9956');
  ctx.fillStyle=groundGrad;ctx.fillRect(0,canvas.height*0.4,canvas.width,canvas.height*0.6);
  // Path
  ctx.fillStyle='#d4a86a';ctx.beginPath();ctx.moveTo(0,canvas.height*0.45);ctx.lineTo(330,canvas.height*0.45);ctx.lineTo(330,canvas.height*0.5);ctx.lineTo(0,canvas.height*0.5);ctx.fill();
  // Castle - detailed
  ctx.fillStyle='#d4b896';ctx.fillRect(295,canvas.height*0.2,70,canvas.height*0.25);
  ctx.fillStyle='#c0a882';ctx.fillRect(305,canvas.height*0.12,20,40);ctx.fillRect(345,canvas.height*0.12,20,40);
  // Battlements
  ctx.fillStyle='#b89a78';for(var bi=0;bi<4;bi++)ctx.fillRect(297+bi*18,canvas.height*0.195,7,10);
  // Tower tops
  ctx.fillStyle='#9b59b6';
  ctx.beginPath();ctx.moveTo(305,canvas.height*0.12);ctx.lineTo(315,canvas.height*0.06);ctx.lineTo(325,canvas.height*0.12);ctx.fill();
  ctx.beginPath();ctx.moveTo(345,canvas.height*0.12);ctx.lineTo(355,canvas.height*0.06);ctx.lineTo(365,canvas.height*0.12);ctx.fill();
  // Flags
  ctx.fillStyle='#9b59b6';ctx.fillRect(313,canvas.height*0.04,10,8);ctx.fillRect(353,canvas.height*0.04,10,8);
  // Castle windows
  ctx.fillStyle='rgba(255,200,100,0.4)';ctx.fillRect(315,canvas.height*0.28,10,12);ctx.fillRect(340,canvas.height*0.28,10,12);
  // Castle door
  ctx.fillStyle='#6b4f3a';ctx.beginPath();ctx.arc(330,canvas.height*0.42,12,Math.PI,0);ctx.fill();ctx.fillRect(318,canvas.height*0.42,24,8);
  // Knight capybara - larger, more detailed
  var kx=Math.min(knightX,275);
  var ky=canvas.height*0.42;
  // Shadow
  ctx.fillStyle='rgba(0,0,0,0.2)';ctx.beginPath();ctx.ellipse(kx+25,ky+22,18,5,0,0,Math.PI*2);ctx.fill();
  // Back legs (behind body)
  var legOff=frame%10<5?3:-3;
  ctx.fillStyle='#7d3c98';
  ctx.beginPath();ctx.ellipse(kx+15,ky+16+legOff,3,6,-0.1,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(kx+35,ky+16-legOff,3,6,0.1,0,Math.PI*2);ctx.fill();
  // Tail (small stub)
  ctx.fillStyle='#7d3c98';ctx.beginPath();ctx.ellipse(kx+6,ky+4,4,3,0.5,0,Math.PI*2);ctx.fill();
  // Body with armor (wider oval)
  var armorGrad=ctx.createRadialGradient(kx+25,ky+2,4,kx+25,ky+2,18);
  armorGrad.addColorStop(0,'#9a8aba');armorGrad.addColorStop(0.5,'#7a6a9a');armorGrad.addColorStop(1,'#5a4a7a');
  ctx.fillStyle=armorGrad;ctx.beginPath();ctx.ellipse(kx+25,ky+4,16,12,0,0,Math.PI*2);ctx.fill();
  // Armor details - plate lines
  ctx.strokeStyle='rgba(180,160,200,0.3)';ctx.lineWidth=0.5;
  ctx.beginPath();ctx.moveTo(kx+12,ky+4);ctx.lineTo(kx+38,ky+4);ctx.stroke();
  // Armor rivets
  ctx.fillStyle='#b0a0c0';
  ctx.beginPath();ctx.arc(kx+15,ky,1.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(kx+35,ky,1.5,0,Math.PI*2);ctx.fill();
  // Front legs
  ctx.fillStyle='#7d3c98';
  ctx.beginPath();ctx.ellipse(kx+18,ky+16-legOff,3,6,-0.1,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(kx+32,ky+16+legOff,3,6,0.1,0,Math.PI*2);ctx.fill();
  // Paws
  ctx.fillStyle='#6a2e88';
  ctx.beginPath();ctx.ellipse(kx+18,ky+21-legOff,3.5,2,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(kx+32,ky+21+legOff,3.5,2,0,0,Math.PI*2);ctx.fill();
  // Head (larger)
  ctx.fillStyle='#9b59b6';ctx.beginPath();ctx.arc(kx+30,ky-8,12,0,Math.PI*2);ctx.fill();
  // Lighter face/cheeks
  ctx.fillStyle='#b07acc';ctx.beginPath();ctx.ellipse(kx+32,ky-4,8,5,0,0,Math.PI*2);ctx.fill();
  // Ears
  ctx.fillStyle='#7d3c98';
  ctx.beginPath();ctx.ellipse(kx+21,ky-18,4,5,-0.3,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(kx+39,ky-18,4,5,0.3,0,Math.PI*2);ctx.fill();
  // Inner ears
  ctx.fillStyle='#c8a0d8';
  ctx.beginPath();ctx.ellipse(kx+21,ky-18,2,3,-0.3,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(kx+39,ky-18,2,3,0.3,0,Math.PI*2);ctx.fill();
  // Eyes (larger, more expressive)
  ctx.fillStyle='#1a1008';
  ctx.beginPath();ctx.ellipse(kx+26,ky-10,2.5,3,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(kx+34,ky-10,2.5,3,0,0,Math.PI*2);ctx.fill();
  // Eye shine
  ctx.fillStyle='rgba(255,255,255,0.7)';
  ctx.beginPath();ctx.arc(kx+27,ky-11.5,1,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(kx+35,ky-11.5,1,0,Math.PI*2);ctx.fill();
  // Nose (wide, flat capybara nose)
  ctx.fillStyle='#5a3070';ctx.beginPath();ctx.ellipse(kx+32,ky-4,5,3,0,0,Math.PI*2);ctx.fill();
  // Nostrils
  ctx.fillStyle='#3a1a50';
  ctx.beginPath();ctx.ellipse(kx+30,ky-4,1.2,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(kx+34,ky-4,1.2,0.8,0,0,Math.PI*2);ctx.fill();
  // Mouth
  ctx.strokeStyle='#5a3070';ctx.lineWidth=0.6;
  ctx.beginPath();ctx.moveTo(kx+29,ky-1);ctx.quadraticCurveTo(kx+32,ky+1,kx+35,ky-1);ctx.stroke();
  // Whisker dots
  ctx.fillStyle='#5a3070';
  ctx.beginPath();ctx.arc(kx+24,ky-4,0.6,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(kx+23,ky-2.5,0.6,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(kx+40,ky-4,0.6,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(kx+41,ky-2.5,0.6,0,Math.PI*2);ctx.fill();
  // Armor shine ring
  ctx.strokeStyle='rgba(180,160,220,0.4)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(kx+25,ky+4,17,13,0,0,Math.PI*2);ctx.stroke();
  // Purple glow
  ctx.shadowColor='#9b59b6';ctx.shadowBlur=10;ctx.strokeStyle='rgba(155,89,182,0.2)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(kx+25,ky+2,20,16,0,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;
  // Text
  ctx.fillStyle='#2c3e50';ctx.font='bold 16px Segoe UI';ctx.textAlign='center';
  if(frame<60){ctx.fillText('The knight reaches the castle...',canvas.width/2,30);}
  else{
    ctx.fillText('"I will wait here for my fellow knights."',canvas.width/2,30);
    // Speech bubble
    ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(kx+25,ky-35,85,16,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#333';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(kx+25,ky-35,85,16,0,0,Math.PI*2);ctx.stroke();
    // Bubble tail
    ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(kx+25,ky-19);ctx.lineTo(kx+21,ky-27);ctx.lineTo(kx+29,ky-27);ctx.fill();
    ctx.fillStyle='#333';ctx.font='10px Segoe UI';ctx.fillText('I will wait here for my fellow knights.',kx+25,ky-32);
  }
  ctx.fillStyle='#555';ctx.font='12px Segoe UI';ctx.fillText(title+' — Press X to skip',canvas.width/2,canvas.height-15);
}

// === SLOTH 2 ===
var sloth2Running=false,sloth2Player=null,sloth2MoveQueued=false,sloth2Merchants=[],sloth2RedSloth=null,sloth2QuestSloth=null;

function enterSloth2(){
  if(!mainGameState)mainGameState=getGameState();
  currentScreen='sloth2';clearInterval(tickInterval);
  sloth2Player={x:Math.floor(COLS/2),y:Math.floor(ROWS/2)};
  sloth2Running=false;sloth2MoveQueued=false;
  sloth2Merchants=[];
  sloth2QuestSloth={x:COLS-5,y:1};
  for(var si=0;si<7;si++){var sx,sy;do{sx=2+Math.floor(Math.random()*(COLS-4));sy=2+Math.floor(Math.random()*(ROWS-4));}while(sx===sloth2Player.x&&sy===sloth2Player.y||sloth2Merchants.some(function(m){return m.x===sx&&m.y===sy;})||(sx>=sloth2QuestSloth.x&&sx<=sloth2QuestSloth.x+1&&sy>=sloth2QuestSloth.y&&sy<=sloth2QuestSloth.y+2));sloth2Merchants.push({x:sx,y:sy,discount:si===0,purple:si===1,blue:si===3,yellow:si===4,orange:si===5,scam:si===6});}
  var rsx3,rsy3;do{rsx3=2+Math.floor(Math.random()*(COLS-4));rsy3=2+Math.floor(Math.random()*(ROWS-4));}while(rsx3===sloth2Player.x&&rsy3===sloth2Player.y||sloth2Merchants.some(function(m){return m.x===rsx3&&m.y===rsy3;})||(rsx3>=sloth2QuestSloth.x&&rsx3<=sloth2QuestSloth.x+1&&rsy3>=sloth2QuestSloth.y&&rsy3<=sloth2QuestSloth.y+2));sloth2RedSloth={x:rsx3,y:rsy3};
  tickInterval=setInterval(stepSloth2,100);
  drawSloth2();msgEl.textContent='Sloth 2 — Arrow keys to move, ESC to return';
}

function stepSloth2(){
  if(currentScreen!=='sloth2')return;
  if(!sloth2Running||!sloth2MoveQueued){drawSloth2();return;}
  sloth2MoveQueued=false;
  var nx=sloth2Player.x+nextDir.x,ny=sloth2Player.y+nextDir.y;
  if(nx>=0&&nx<COLS&&ny>=0&&ny<ROWS){sloth2Player.x=nx;sloth2Player.y=ny;}
  var hitMerchant=null;sloth2Merchants.forEach(function(m){if(m.x===sloth2Player.x&&m.y===sloth2Player.y)hitMerchant=m;});
  if(hitMerchant){slothPos=sloth2Player;if(hitMerchant.purple){openBeaverShop();}else if(hitMerchant.yellow){openGamble();}else if(hitMerchant.orange){openInfoShop();}else if(hitMerchant.scam){openScamShop();}else if(hitMerchant.blue&&isBlueHour()){openBlueShop();}else if(hitMerchant.discount){openDiscountShop();}else{openSlothShop();}return;}
  if(sloth2RedSloth&&sloth2Player.x===sloth2RedSloth.x&&sloth2Player.y===sloth2RedSloth.y){openPortalShop([{name:'Sloth 1',cost:11,dest:'capy6'},{name:'Sloth 3',cost:11,dest:'capy8'},{name:'Capy 3',cost:11,dest:'capy3'}]);return;}
  if(sloth2QuestSloth&&sloth2Player.x>=sloth2QuestSloth.x&&sloth2Player.x<=sloth2QuestSloth.x+1&&sloth2Player.y>=sloth2QuestSloth.y&&sloth2Player.y<=sloth2QuestSloth.y+2){openQuestShop();return;}
  drawSloth2();
}

function drawSloth2(){
  ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle='#1a2530';ctx.lineWidth=0.5;
  for(var i=0;i<=COLS;i++){ctx.beginPath();ctx.moveTo(i*GRID,0);ctx.lineTo(i*GRID,canvas.height);ctx.stroke();}
  for(var i2=0;i2<=ROWS;i2++){ctx.beginPath();ctx.moveTo(0,i2*GRID);ctx.lineTo(canvas.width,i2*GRID);ctx.stroke();}
  if(sloth2Player){
    var px=sloth2Player.x*GRID+GRID/2,py=sloth2Player.y*GRID+GRID/2;
    ctx.fillStyle='#f5cba7';ctx.beginPath();ctx.arc(px,py,7,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#3b2314';ctx.beginPath();ctx.ellipse(px,py-5,7,3.5,0,0,Math.PI);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(px-2.5,py-2,1.8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px+2.5,py-2,1.8,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#4a6a3a';ctx.beginPath();ctx.arc(px-2.5,py-2,0.9,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px+2.5,py-2,0.9,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#c07060';ctx.lineWidth=0.8;ctx.beginPath();ctx.arc(px,py+1,2,0.1*Math.PI,0.9*Math.PI);ctx.stroke();
    ctx.fillStyle='#5b7daa';ctx.beginPath();ctx.ellipse(px,py+8,5,5,0,0,Math.PI*2);ctx.fill();
  }
  sloth2Merchants.forEach(function(m){if(m.purple)drawPurpleSloth(m.x,m.y);else if(m.yellow)drawYellowSloth(m.x,m.y);else if(m.orange)drawOrangeSloth(m.x,m.y);else if(m.scam)drawScamSloth(m.x,m.y);else if(m.blue&&isBlueHour())drawBlueSloth(m.x,m.y);else if(m.discount)drawGreenSloth(m.x,m.y);else drawSloth(m.x,m.y);});
  if(sloth2RedSloth)drawRedSloth(sloth2RedSloth.x,sloth2RedSloth.y);
  if(sloth2QuestSloth)drawQuestSloth(sloth2QuestSloth.x,sloth2QuestSloth.y);
  ctx.fillStyle='#3498db';ctx.shadowColor='#3498db';ctx.shadowBlur=15;ctx.font='bold 42px Segoe UI';ctx.textAlign='center';ctx.fillText('Sloth 2',canvas.width/2,36);ctx.shadowBlur=0;
  ctx.fillStyle='#666';ctx.font='14px Segoe UI';ctx.fillText('Coming Soon — Press ESC to return',canvas.width/2,canvas.height-15);
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
    var px=capy7Player.x;
    capy7Logs.forEach(function(l){
      if(l.y===capy7Player.y&&px>=l.x-0.5&&px<l.x+l.len+0.5){
        onLog=true;
        capy7Player.x+=l.speed*0.15;
      }
    });
    // Round player position to prevent drift
    capy7Player.x=Math.round(capy7Player.x*100)/100;
    if(!onLog)die();
    if(capy7Player.x<-1||capy7Player.x>=COLS+1)die();
  }
  // Check win
  if(capy7Player.y<=C7_ISLAND_TOP){capy7Won=true;capy7Beaten=true;capy7CutsceneActive=true;capy7CutsceneFrame=0;capy7KnightX=0;}
  // Check sloth
  if(slothPos&&Math.abs(capy7Player.x-slothPos.x)<1&&capy7Player.y===slothPos.y){openSlothShop();return;}
  drawCapy7();
}

function stepCapy7Cutscene(){
  capy7CutsceneFrame++;
  if(capy7CutsceneFrame<60){capy7KnightX=capy7CutsceneFrame*3;}
  drawCapy7Cutscene();
  if(capy7CutsceneFrame>=120){clearInterval(tickInterval);enterSloth2();}
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
    var px=capy7Player.x*GRID+GRID/2,py=capy7Player.y*cellH+cellH/2;
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
var slothShopDiscount=false;
var slothShopBeaver=false;
var slothShopBlue=false;

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

function drawRedSloth(sx,sy){
  var px=sx*GRID+GRID/2,py=sy*GRID+GRID/2;
  ctx.fillStyle='#a04040';ctx.beginPath();ctx.ellipse(px,py+2,8,9,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#b06060';ctx.beginPath();ctx.ellipse(px,py+4,5,5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#a04040';ctx.beginPath();ctx.arc(px,py-6,7,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#702020';
  ctx.beginPath();ctx.ellipse(px-3,py-6,3,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+3,py-6,3,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.ellipse(px-3,py-6,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+3,py-6,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#702020';ctx.lineWidth=0.7;ctx.beginPath();ctx.arc(px,py-3,2.5,0.1*Math.PI,0.9*Math.PI);ctx.stroke();
  ctx.fillStyle='#501010';ctx.beginPath();ctx.arc(px,py-4,1.2,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#a04040';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(px-7,py);ctx.quadraticCurveTo(px-14,py-5,px-12,py-10);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px+7,py);ctx.quadraticCurveTo(px+14,py-5,px+12,py-10);ctx.stroke();
  ctx.strokeStyle='#602020';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(px-12,py-10);ctx.lineTo(px-14,py-12);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px-12,py-10);ctx.lineTo(px-11,py-13);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px+12,py-10);ctx.lineTo(px+14,py-12);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px+12,py-10);ctx.lineTo(px+11,py-13);ctx.stroke();
  ctx.fillStyle='#ff4757';ctx.font='bold 8px Segoe UI';ctx.textAlign='center';
  ctx.fillText('PORTAL',px,py-15);
}

var portalShopOpen=false,portalShopSelection=1,portalShopItems=[],portalShopMsg2='';

function openPortalShop(items){
  portalShopOpen=true;portalShopSelection=1;portalShopItems=items;portalShopMsg2='';
  clearInterval(tickInterval);drawPortalShop();
}

function drawPortalShop(){
  ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.textAlign='center';
  ctx.fillStyle='#ff4757';ctx.font='bold 24px Segoe UI';ctx.fillText('Portal Shop',canvas.width/2,40);
  ctx.fillStyle='#2ecc71';ctx.font='16px Segoe UI';ctx.fillText('Rupees: '+rupees,canvas.width/2,70);
  portalShopItems.forEach(function(item,i){
    var y=110+i*70;var num=i+1;var canBuy=rupees>=item.cost;var selected=portalShopSelection===num;
    ctx.fillStyle=selected?(canBuy?'#1a2a2a':'#2a1a1a'):(canBuy?'#1a1a2a':'#1a1a1a');
    ctx.fillRect(60,y-15,280,50);
    ctx.strokeStyle=selected?'#ff4757':(canBuy?'#2ecc71':'#333');ctx.lineWidth=selected?2:1;
    ctx.strokeRect(60,y-15,280,50);
    if(selected){ctx.fillStyle='#ff4757';ctx.font='bold 16px Segoe UI';ctx.textAlign='left';ctx.fillText('>',50,y+8);}
    ctx.fillStyle=canBuy?'#eee':'#555';ctx.font='bold 16px Segoe UI';ctx.textAlign='left';
    ctx.fillText(item.name,75,y+5);
    ctx.fillStyle=canBuy?'#aaa':'#444';ctx.font='12px Segoe UI';ctx.fillText('Teleport to '+item.name,75,y+22);
    ctx.fillStyle=canBuy?'#2ecc71':'#555';ctx.font='bold 14px Segoe UI';ctx.textAlign='right';
    ctx.fillText(item.cost+' rupees',330,y+10);
  });
  ctx.textAlign='center';ctx.fillStyle='#666';ctx.font='13px Segoe UI';
  ctx.fillText('Up/Down to select | Enter to buy | Alt to close',canvas.width/2,canvas.height-20);
  if(portalShopMsg2){ctx.fillStyle='#ffd700';ctx.font='bold 14px Segoe UI';ctx.fillText(portalShopMsg2,canvas.width/2,canvas.height-40);}
  msgEl.textContent='Portal Shop — Rupees: '+rupees;
}

function buyPortal(idx){
  if(idx<0||idx>=portalShopItems.length)return;
  var item=portalShopItems[idx];
  if(rupees<item.cost){portalShopMsg2='Not enough rupees!';drawPortalShop();setTimeout(function(){portalShopMsg2='';if(portalShopOpen)drawPortalShop();},1500);return;}
  if(ownedPortals.some(function(p){return p.dest===item.dest;})){portalShopMsg2='Already owned!';drawPortalShop();setTimeout(function(){portalShopMsg2='';if(portalShopOpen)drawPortalShop();},1500);return;}
  rupees-=item.cost;
  ownedPortals.push({name:item.name,dest:item.dest});
  portalShopMsg2='Portal to '+item.name+' purchased!';
  drawPortalShop();setTimeout(function(){portalShopMsg2='';if(portalShopOpen)drawPortalShop();},1500);
}

var portalUseOpen=false,portalUseSelection=1;

function openPortalUseMenu(){
  if(ownedPortals.length===0){msgEl.textContent='No portals owned!';setTimeout(function(){msgEl.textContent='';},1500);return;}
  portalUseOpen=true;portalUseSelection=1;
  clearInterval(tickInterval);drawPortalUseMenu();
}

function drawPortalUseMenu(){
  ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.textAlign='center';
  ctx.fillStyle='#9b59b6';ctx.font='bold 24px Segoe UI';ctx.fillText('Use Portal',canvas.width/2,40);
  ctx.fillStyle='#888';ctx.font='14px Segoe UI';ctx.fillText(ownedPortals.length+' portal'+(ownedPortals.length>1?'s':'')+' owned',canvas.width/2,65);
  ownedPortals.forEach(function(p,i){
    var y=100+i*60;var selected=portalUseSelection===i+1;
    ctx.fillStyle=selected?'#1a2a3a':'#1a1a2a';ctx.fillRect(60,y-15,280,45);
    ctx.strokeStyle=selected?'#9b59b6':'#333';ctx.lineWidth=selected?2:1;ctx.strokeRect(60,y-15,280,45);
    if(selected){ctx.fillStyle='#9b59b6';ctx.font='bold 16px Segoe UI';ctx.textAlign='left';ctx.fillText('>',50,y+8);}
    ctx.fillStyle='#eee';ctx.font='bold 18px Segoe UI';ctx.textAlign='center';ctx.fillText(p.name,canvas.width/2,y+10);
  });
  ctx.fillStyle='#666';ctx.font='13px Segoe UI';ctx.textAlign='center';
  ctx.fillText('Up/Down to select | Enter to teleport | Alt to close',canvas.width/2,canvas.height-20);
  msgEl.textContent='Select a portal';
}

function usePortal(idx){
  if(idx<0||idx>=ownedPortals.length)return;
  var p=ownedPortals.splice(idx,1)[0];portalUseOpen=false;
  if(p.dest==='capy6')enterCapy6();
  else if(p.dest==='capy8')enterCapy8();
  else if(p.dest==='sloth2')enterSloth2();
  else if(p.dest==='capy3')enterCapy3();
}

function openDiscountShop(){
  slothShopOpen=true;slothShopSelection=1;slothShopMsg='';slothShopDiscount=true;slothShopBeaver=false;slothShopBlue=false;
  clearInterval(tickInterval);drawDiscountShop();
}

function drawDiscountShop(){
  ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.textAlign='center';
  ctx.fillStyle='#2ecc71';ctx.font='bold 24px Segoe UI';ctx.fillText('Discount Sloth!',canvas.width/2,40);
  ctx.fillStyle='#2ecc71';ctx.font='16px Segoe UI';ctx.fillText('Rupees: '+rupees+' | 2 rupee discount!',canvas.width/2,70);
  var items=[{name:'Gold Orange',desc:'Activates shooting',cost:1},{name:'Extra Life',desc:'Revive + 3 capybaras',cost:5},{name:'Spike',desc:'Adds spike to tail',cost:10}];
  items.forEach(function(item,i){
    var y=110+i*80;var num=i+1;var canBuy=rupees>=item.cost;var selected=slothShopSelection===num;
    ctx.fillStyle=selected?(canBuy?'#1a3a1a':'#2a1a1a'):(canBuy?'#1a2a1a':'#1a1a1a');
    ctx.fillRect(60,y-15,280,60);
    ctx.strokeStyle=selected?'#2ecc71':(canBuy?'#2ecc71':'#333');ctx.lineWidth=selected?2:1;
    ctx.strokeRect(60,y-15,280,60);
    if(selected){ctx.fillStyle='#2ecc71';ctx.font='bold 16px Segoe UI';ctx.textAlign='left';ctx.fillText('>',50,y+8);}
    ctx.fillStyle=canBuy?'#eee':'#555';ctx.font='bold 18px Segoe UI';ctx.textAlign='left';
    ctx.fillText(item.name,75,y+5);
    ctx.fillStyle=canBuy?'#aaa':'#444';ctx.font='13px Segoe UI';ctx.fillText(item.desc,75,y+25);
    ctx.fillStyle=canBuy?'#2ecc71':'#555';ctx.font='bold 16px Segoe UI';ctx.textAlign='right';
    ctx.fillText(item.cost+' rupees',330,y+10);
  });
  ctx.textAlign='center';ctx.fillStyle='#666';ctx.font='13px Segoe UI';
  ctx.fillText('Up/Down to select | Enter to buy | Alt to close',canvas.width/2,canvas.height-20);
  if(slothShopMsg){ctx.fillStyle='#ffd700';ctx.font='bold 14px Segoe UI';ctx.fillText(slothShopMsg,canvas.width/2,canvas.height-40);}
  msgEl.textContent='Discount Shop — Rupees: '+rupees;
}

function buyFromDiscountSloth(itemNum){
  if(itemNum===1&&rupees>=1){rupees-=1;shooting=true;shootEnd=Date.now()+8340;slothShopMsg='Gold Orange purchased!';}
  else if(itemNum===2&&rupees>=5){rupees-=5;extraLives++;slothShopMsg='Extra Life purchased! ('+extraLives+' total)';}
  else if(itemNum===3&&rupees>=10){rupees-=10;spikeCount++;slothShopMsg='Spike purchased!';}
  else{slothShopMsg='Not enough rupees!';}
  drawDiscountShop();setTimeout(function(){slothShopMsg='';if(slothShopOpen)drawDiscountShop();},1500);
}

function drawGreenSloth(sx,sy){
  var px=sx*GRID+GRID/2,py=sy*GRID+GRID/2;
  ctx.fillStyle='#2e8b57';ctx.beginPath();ctx.ellipse(px,py+2,8,9,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#3aa06a';ctx.beginPath();ctx.ellipse(px,py+4,5,5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#2e8b57';ctx.beginPath();ctx.arc(px,py-6,7,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#1a5a38';
  ctx.beginPath();ctx.ellipse(px-3,py-6,3,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+3,py-6,3,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.ellipse(px-3,py-6,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+3,py-6,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#1a5a38';ctx.lineWidth=0.7;ctx.beginPath();ctx.arc(px,py-3,2.5,0.1*Math.PI,0.9*Math.PI);ctx.stroke();
  ctx.fillStyle='#0a3a20';ctx.beginPath();ctx.arc(px,py-4,1.2,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#2e8b57';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(px-7,py);ctx.quadraticCurveTo(px-14,py-5,px-12,py-10);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px+7,py);ctx.quadraticCurveTo(px+14,py-5,px+12,py-10);ctx.stroke();
  ctx.fillStyle='#2ecc71';ctx.font='bold 7px Segoe UI';ctx.textAlign='center';
  ctx.fillText('-2 SALE',px,py-15);
}

function isBlueHour(){var d=new Date();var h=d.getHours(),m=d.getMinutes(),t=h*60+m;return(t>=60&&t<389)||(t>=951&&t<1069);}

function drawBlueSloth(sx,sy){
  var px=sx*GRID+GRID/2,py=sy*GRID+GRID/2;
  ctx.fillStyle='#2060b0';ctx.beginPath();ctx.ellipse(px,py+2,8,9,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#3080d0';ctx.beginPath();ctx.ellipse(px,py+4,5,5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#2060b0';ctx.beginPath();ctx.arc(px,py-6,7,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#103870';
  ctx.beginPath();ctx.ellipse(px-3,py-6,3,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+3,py-6,3,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.ellipse(px-3,py-6,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+3,py-6,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#103870';ctx.lineWidth=0.7;ctx.beginPath();ctx.arc(px,py-3,2.5,0.1*Math.PI,0.9*Math.PI);ctx.stroke();
  ctx.fillStyle='#082050';ctx.beginPath();ctx.arc(px,py-4,1.2,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#2060b0';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(px-7,py);ctx.quadraticCurveTo(px-14,py-5,px-12,py-10);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px+7,py);ctx.quadraticCurveTo(px+14,py-5,px+12,py-10);ctx.stroke();
  ctx.fillStyle='#4aa0ff';ctx.font='bold 7px Segoe UI';ctx.textAlign='center';
  ctx.fillText('-3 SALE',px,py-15);
}

function openBlueShop(){
  slothShopOpen=true;slothShopSelection=1;slothShopMsg='';slothShopDiscount=false;slothShopBeaver=false;slothShopBlue=true;
  clearInterval(tickInterval);drawBlueShop();
}

function drawBlueShop(){
  ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.textAlign='center';
  ctx.fillStyle='#4aa0ff';ctx.font='bold 24px Segoe UI';ctx.fillText('Blue Hour Sale!',canvas.width/2,40);
  ctx.fillStyle='#2ecc71';ctx.font='16px Segoe UI';ctx.fillText('Rupees: '+rupees+' | 3 rupee discount on ALL!',canvas.width/2,70);
  var items=[{name:'Extra Life',desc:'Revive + 3 capybaras',cost:4},{name:'Spike',desc:'Adds spike to tail',cost:9},{name:'Happy Beaver',desc:'Chases enemies (9s)',cost:18}];
  items.forEach(function(item,i){
    var y=100+i*65;var num=i+1;var canBuy=rupees>=item.cost;var selected=slothShopSelection===num;
    ctx.fillStyle=selected?(canBuy?'#0a1a3a':'#1a0a0a'):(canBuy?'#0a1a2a':'#1a1a1a');
    ctx.fillRect(60,y-12,280,50);
    ctx.strokeStyle=selected?'#4aa0ff':(canBuy?'#2ecc71':'#333');ctx.lineWidth=selected?2:1;
    ctx.strokeRect(60,y-12,280,50);
    if(selected){ctx.fillStyle='#4aa0ff';ctx.font='bold 16px Segoe UI';ctx.textAlign='left';ctx.fillText('>',50,y+8);}
    ctx.fillStyle=canBuy?'#eee':'#555';ctx.font='bold 16px Segoe UI';ctx.textAlign='left';
    ctx.fillText(item.name,75,y+5);
    ctx.fillStyle=canBuy?'#aaa':'#444';ctx.font='12px Segoe UI';ctx.fillText(item.desc,75,y+22);
    ctx.fillStyle=canBuy?'#4aa0ff':'#555';ctx.font='bold 14px Segoe UI';ctx.textAlign='right';
    ctx.fillText(item.cost+' rupees',330,y+10);
  });
  ctx.textAlign='center';ctx.fillStyle='#666';ctx.font='13px Segoe UI';
  ctx.fillText('Up/Down to select | Enter to buy | Alt to close',canvas.width/2,canvas.height-20);
  if(slothShopMsg){ctx.fillStyle='#ffd700';ctx.font='bold 14px Segoe UI';ctx.fillText(slothShopMsg,canvas.width/2,canvas.height-40);}
  msgEl.textContent='Blue Hour Sale — Rupees: '+rupees;
}

function buyFromBlueSloth(itemNum){
  if(itemNum===1&&rupees>=4){rupees-=4;extraLives++;slothShopMsg='Extra Life purchased!';}
  else if(itemNum===2&&rupees>=9){rupees-=9;spikeCount++;slothShopMsg='Spike purchased!';}
  else if(itemNum===3&&rupees>=18){rupees-=18;happyBeaverCount++;slothShopMsg='Happy Beaver purchased!';}
  else{slothShopMsg='Not enough rupees!';}
  drawBlueShop();setTimeout(function(){slothShopMsg='';if(slothShopOpen)drawBlueShop();},1500);
}

function drawYellowSloth(sx,sy){
  var px=sx*GRID+GRID/2,py=sy*GRID+GRID/2;
  ctx.fillStyle='#c8a020';ctx.beginPath();ctx.ellipse(px,py+2,8,9,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#d8b840';ctx.beginPath();ctx.ellipse(px,py+4,5,5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#c8a020';ctx.beginPath();ctx.arc(px,py-6,7,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#907010';
  ctx.beginPath();ctx.ellipse(px-3,py-6,3,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+3,py-6,3,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.ellipse(px-3,py-6,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+3,py-6,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#907010';ctx.lineWidth=0.7;ctx.beginPath();ctx.arc(px,py-3,2.5,0.1*Math.PI,0.9*Math.PI);ctx.stroke();
  ctx.fillStyle='#705008';ctx.beginPath();ctx.arc(px,py-4,1.2,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#c8a020';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(px-7,py);ctx.quadraticCurveTo(px-14,py-5,px-12,py-10);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px+7,py);ctx.quadraticCurveTo(px+14,py-5,px+12,py-10);ctx.stroke();
  ctx.fillStyle='#ffd700';ctx.font='bold 7px Segoe UI';ctx.textAlign='center';
  ctx.fillText('GAMBLE',px,py-15);
}

var gambleOpen=false,gambleSelection=1,gambleRevealed=false,gambleBoxes=[],gambleMsg='';
var gambleHintActive=false;

function getGamblesToday(){
  var data=JSON.parse(localStorage.getItem('crawlingCapysGamble')||'{}');
  var today=new Date().toDateString();
  if(data.day!==today)return 0;
  return data.count||0;
}

function addGambleToday(){
  var today=new Date().toDateString();
  var count=getGamblesToday()+1;
  localStorage.setItem('crawlingCapysGamble',JSON.stringify({day:today,count:count}));
}

function openGamble(){
  if(getGamblesToday()>=3){msgEl.textContent='No more gambles today!';setTimeout(function(){msgEl.textContent='';},1500);return;}
  if(rupees<3){msgEl.textContent='Need 3 rupees to gamble!';setTimeout(function(){msgEl.textContent='';},1500);return;}
  gambleOpen=true;gambleSelection=1;gambleRevealed=false;gambleMsg='';
  var prizes=[7,5,3,0];
  for(var i=prizes.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=prizes[i];prizes[i]=prizes[j];prizes[j]=t;}
  gambleBoxes=prizes;
  // Update hint panel
  var hintEl=document.getElementById('gambleHint');
  if(gambleHintActive&&hintEl){var winBox=gambleBoxes.indexOf(7)+1;hintEl.style.display='block';hintEl.textContent='Box '+winBox+' has the 7R';}
  else if(hintEl){hintEl.style.display='none';}
  clearInterval(tickInterval);drawGamble();
}

function drawGamble(){
  ctx.fillStyle='rgba(0,0,0,0.9)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.textAlign='center';
  ctx.fillStyle='#ffd700';ctx.font='bold 24px Segoe UI';ctx.fillText('Mystery Boxes!',canvas.width/2,40);
  ctx.fillStyle='#2ecc71';ctx.font='16px Segoe UI';ctx.fillText('Cost: 3 rupees | Rupees: '+rupees,canvas.width/2,65);
  for(var i=0;i<4;i++){
    var bx=25+i*95,by=100,bw=80,bh=100;
    var selected=gambleSelection===i+1;
    if(gambleRevealed){
      var prize=gambleBoxes[i];
      ctx.fillStyle=prize===7?'#9b59b6':prize===5?'#2ecc71':prize===3?'#ffd700':'#ff4757';
      ctx.fillRect(bx,by,bw,bh);
      ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(bx,by,bw,bh);
      ctx.fillStyle='#fff';ctx.font='bold 22px Segoe UI';
      ctx.fillText(prize===0?'Empty':prize+'R',bx+bw/2,by+bh/2+8);
    }else{
      ctx.fillStyle=selected?'#c8a020':'#8a7020';
      ctx.fillRect(bx,by,bw,bh);
      ctx.strokeStyle=selected?'#ffd700':'#555';ctx.lineWidth=selected?3:1;
      ctx.strokeRect(bx,by,bw,bh);
      ctx.fillStyle='#fff';ctx.font='bold 36px Segoe UI';
      ctx.fillText('?',bx+bw/2,by+bh/2+12);
      ctx.fillStyle='#ddd';ctx.font='14px Segoe UI';
      ctx.fillText('['+(i+1)+']',bx+bw/2,by+bh-10);
    }
  }
  if(gambleMsg){ctx.fillStyle='#ffd700';ctx.font='bold 18px Segoe UI';ctx.fillText(gambleMsg,canvas.width/2,240);}
  ctx.fillStyle='#666';ctx.font='13px Segoe UI';
  ctx.fillText(gambleRevealed?'Press Alt to close':'Left/Right or 1-4 to pick | Enter to open',canvas.width/2,canvas.height-20);
  msgEl.textContent='Pick a box!';
}

function pickBox(idx){
  if(gambleRevealed||idx<0||idx>3)return;
  if(getGamblesToday()>=3){gambleMsg='No more gambles today!';drawGamble();return;}
  rupees-=3;addGambleToday();
  var prize=gambleBoxes[idx];
  rupees+=prize;
  gambleRevealed=true;
  if(prize===7)gambleMsg='JACKPOT! 7 rupees! (+4 profit)';
  else if(prize===5)gambleMsg='You won 5 rupees! (+2 profit)';
  else if(prize===3)gambleMsg='You got 3 rupees back! (even)';
  else gambleMsg='Empty box! (-3 rupees)';
  var hintEl=document.getElementById('gambleHint');if(hintEl)hintEl.style.display='none';
  drawGamble();
}

function drawOrangeSloth(sx,sy){
  var px=sx*GRID+GRID/2,py=sy*GRID+GRID/2;
  ctx.fillStyle='#d07020';ctx.beginPath();ctx.ellipse(px,py+2,8,9,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#e08838';ctx.beginPath();ctx.ellipse(px,py+4,5,5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#d07020';ctx.beginPath();ctx.arc(px,py-6,7,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#904810';
  ctx.beginPath();ctx.ellipse(px-3,py-6,3,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+3,py-6,3,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.ellipse(px-3,py-6,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+3,py-6,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#904810';ctx.lineWidth=0.7;ctx.beginPath();ctx.arc(px,py-3,2.5,0.1*Math.PI,0.9*Math.PI);ctx.stroke();
  ctx.fillStyle='#603008';ctx.beginPath();ctx.arc(px,py-4,1.2,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#d07020';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(px-7,py);ctx.quadraticCurveTo(px-14,py-5,px-12,py-10);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px+7,py);ctx.quadraticCurveTo(px+14,py-5,px+12,py-10);ctx.stroke();
  ctx.fillStyle='#ff8c42';ctx.font='bold 7px Segoe UI';ctx.textAlign='center';
  ctx.fillText('INFO',px,py-15);
}

var infoShopOpen=false;

function openInfoShop(){
  infoShopOpen=true;clearInterval(tickInterval);drawInfoShop();
}

function drawInfoShop(){
  ctx.fillStyle='rgba(0,0,0,0.9)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.textAlign='center';
  ctx.fillStyle='#ff8c42';ctx.font='bold 22px Segoe UI';ctx.fillText('Informant Sloth',canvas.width/2,40);
  ctx.fillStyle='#aaa';ctx.font='italic 14px Segoe UI';
  ctx.fillText('"Psst... I know which box has the 7 rupees."',canvas.width/2,75);
  ctx.fillText('"For 9 rupees, I\'ll look down at the answer..."',canvas.width/2,95);
  ctx.fillStyle=gambleHintActive?'#555':'#2ecc71';ctx.font='bold 18px Segoe UI';
  if(gambleHintActive){ctx.fillText('Already purchased! *looks down*',canvas.width/2,150);}
  else{
    var canBuy=rupees>=9;
    ctx.fillStyle=canBuy?'#2ecc71':'#555';
    ctx.fillText('[Enter] Buy info — 9 rupees',canvas.width/2,150);
    if(!canBuy){ctx.fillStyle='#ff4757';ctx.font='14px Segoe UI';ctx.fillText('Not enough rupees!',canvas.width/2,175);}
  }
  ctx.fillStyle='#888';ctx.font='13px Segoe UI';
  ctx.fillText('Gambles today: '+getGamblesToday()+'/3',canvas.width/2,210);
  ctx.fillStyle='#666';ctx.font='13px Segoe UI';
  ctx.fillText('Alt to close',canvas.width/2,canvas.height-15);
  msgEl.textContent='Informant Sloth';
}

function buyInfo(){
  if(gambleHintActive){return;}
  if(rupees<9){return;}
  rupees-=9;gambleHintActive=true;
  drawInfoShop();
}

function drawScamSloth(sx,sy){
  var px=sx*GRID+GRID/2,py=sy*GRID+GRID/2;
  ctx.fillStyle='#d07020';ctx.beginPath();ctx.ellipse(px,py+2,8,9,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#e08838';ctx.beginPath();ctx.ellipse(px,py+4,5,5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#d07020';ctx.beginPath();ctx.arc(px,py-6,7,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#904810';
  ctx.beginPath();ctx.ellipse(px-3,py-6,3,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+3,py-6,3,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.ellipse(px-3,py-6,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+3,py-6,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#904810';ctx.lineWidth=0.7;ctx.beginPath();ctx.arc(px,py-3,2.5,0.1*Math.PI,0.9*Math.PI);ctx.stroke();
  ctx.fillStyle='#603008';ctx.beginPath();ctx.arc(px,py-4,1.2,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#d07020';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(px-7,py);ctx.quadraticCurveTo(px-14,py-5,px-12,py-10);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px+7,py);ctx.quadraticCurveTo(px+14,py-5,px+12,py-10);ctx.stroke();
  ctx.fillStyle='#ff8c42';ctx.font='bold 7px Segoe UI';ctx.textAlign='center';
  ctx.fillText('INTEL',px,py-15);
}

var scamShopOpen=false,scamPhase=0;

function openScamShop(){
  scamShopOpen=true;scamPhase=0;clearInterval(tickInterval);drawScamShop();
}

function drawScamShop(){
  ctx.fillStyle='rgba(0,0,0,0.9)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.textAlign='center';
  if(scamPhase===0){
    ctx.fillStyle='#ff8c42';ctx.font='bold 22px Segoe UI';ctx.fillText('Shady Sloth',canvas.width/2,40);
    ctx.fillStyle='#aaa';ctx.font='italic 14px Segoe UI';
    ctx.fillText('"Hey kid... want to know how to win at gambling?"',canvas.width/2,80);
    ctx.fillText('"I\'ll tell you the SECRET for just 5 rupees..."',canvas.width/2,100);
    var canBuy=rupees>=5;
    ctx.fillStyle=canBuy?'#2ecc71':'#555';ctx.font='bold 18px Segoe UI';
    ctx.fillText('[Enter] Pay 5 rupees',canvas.width/2,160);
    if(!canBuy){ctx.fillStyle='#ff4757';ctx.font='14px Segoe UI';ctx.fillText('Not enough rupees!',canvas.width/2,185);}
  }else if(scamPhase===1){
    ctx.fillStyle='#ff8c42';ctx.font='bold 22px Segoe UI';ctx.fillText('Shady Sloth',canvas.width/2,40);
    ctx.fillStyle='#ffd700';ctx.font='italic 16px Segoe UI';
    ctx.fillText('"Alright, the secret is..."',canvas.width/2,100);
    ctx.fillText('"..."',canvas.width/2,130);
    ctx.fillStyle='#aaa';ctx.font='14px Segoe UI';ctx.fillText('*looks around nervously*',canvas.width/2,160);
  }else{
    ctx.fillStyle='#ff4757';ctx.font='bold 24px Segoe UI';ctx.fillText('The sloth ran away!',canvas.width/2,100);
    ctx.fillStyle='#888';ctx.font='italic 14px Segoe UI';
    ctx.fillText('*empty space where the sloth used to be*',canvas.width/2,140);
    ctx.fillText('You lost 5 rupees...',canvas.width/2,170);
    ctx.fillStyle='#555';ctx.font='12px Segoe UI';
    ctx.fillText('Maybe find the REAL informant (orange sloth labeled INFO)',canvas.width/2,210);
  }
  ctx.fillStyle='#666';ctx.font='13px Segoe UI';
  ctx.fillText('Alt to close',canvas.width/2,canvas.height-15);
  msgEl.textContent='Shady Sloth';
}

function payScamSloth(){
  if(scamPhase!==0||rupees<5)return;
  rupees-=5;scamPhase=1;drawScamShop();
  setTimeout(function(){if(scamShopOpen){scamPhase=2;drawScamShop();}},2000);
}

function drawPurpleSloth(sx,sy){
  var px=sx*GRID+GRID/2,py=sy*GRID+GRID/2;
  ctx.fillStyle='#7b2d8e';ctx.beginPath();ctx.ellipse(px,py+2,8,9,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#9040a8';ctx.beginPath();ctx.ellipse(px,py+4,5,5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#7b2d8e';ctx.beginPath();ctx.arc(px,py-6,7,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#501870';
  ctx.beginPath();ctx.ellipse(px-3,py-6,3,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+3,py-6,3,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.ellipse(px-3,py-6,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+3,py-6,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#501870';ctx.lineWidth=0.7;ctx.beginPath();ctx.arc(px,py-3,2.5,0.1*Math.PI,0.9*Math.PI);ctx.stroke();
  ctx.fillStyle='#301050';ctx.beginPath();ctx.arc(px,py-4,1.2,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#7b2d8e';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(px-7,py);ctx.quadraticCurveTo(px-14,py-5,px-12,py-10);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px+7,py);ctx.quadraticCurveTo(px+14,py-5,px+12,py-10);ctx.stroke();
  ctx.fillStyle='#d470ff';ctx.font='bold 7px Segoe UI';ctx.textAlign='center';
  ctx.fillText('BEAVER',px,py-15);
}

function openBeaverShop(){
  slothShopOpen=true;slothShopSelection=1;slothShopMsg='';slothShopDiscount=false;slothShopBeaver=true;slothShopBlue=false;
  clearInterval(tickInterval);drawBeaverShop();
}

function drawBeaverShop(){
  ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.textAlign='center';
  ctx.fillStyle='#d470ff';ctx.font='bold 24px Segoe UI';ctx.fillText('Beaver Shop',canvas.width/2,40);
  ctx.fillStyle='#2ecc71';ctx.font='16px Segoe UI';ctx.fillText('Rupees: '+rupees,canvas.width/2,70);
  var canBuy=rupees>=21;
  ctx.fillStyle=canBuy?'#1a2a1a':'#1a1a1a';ctx.fillRect(60,110,280,80);
  ctx.strokeStyle=canBuy?'#d470ff':'#333';ctx.lineWidth=2;ctx.strokeRect(60,110,280,80);
  ctx.fillStyle='#ffd700';ctx.font='bold 16px Segoe UI';ctx.textAlign='left';ctx.fillText('>',50,145);
  ctx.fillStyle=canBuy?'#eee':'#555';ctx.font='bold 18px Segoe UI';ctx.fillText('Happy Beaver',75,135);
  ctx.fillStyle=canBuy?'#aaa':'#444';ctx.font='13px Segoe UI';
  ctx.fillText('Tiny fast beaver that chases enemies',75,155);
  ctx.fillText('Kills on contact! Lasts 9 seconds',75,172);
  ctx.fillStyle=canBuy?'#2ecc71':'#555';ctx.font='bold 16px Segoe UI';ctx.textAlign='right';
  ctx.fillText('21 rupees',330,145);
  ctx.textAlign='center';ctx.fillStyle='#666';ctx.font='13px Segoe UI';
  ctx.fillText('Enter to buy | Alt to close',canvas.width/2,canvas.height-20);
  if(slothShopMsg){ctx.fillStyle='#ffd700';ctx.font='bold 14px Segoe UI';ctx.fillText(slothShopMsg,canvas.width/2,canvas.height-40);}
  msgEl.textContent='Beaver Shop — Rupees: '+rupees;
}

function buyHappyBeaver(){
  if(rupees<21){slothShopMsg='Not enough rupees!';drawBeaverShop();setTimeout(function(){slothShopMsg='';if(slothShopOpen)drawBeaverShop();},1500);return;}
  rupees-=21;
  happyBeaverCount++;
  slothShopMsg='Happy Beaver purchased! ('+happyBeaverCount+' owned)';
  drawBeaverShop();setTimeout(function(){slothShopMsg='';if(slothShopOpen)drawBeaverShop();},1500);
}

function spawnHappyBeaver(){
  var hb={x:snake?snake[0].x:Math.floor(COLS/2),y:snake?snake[0].y:Math.floor(ROWS/2),endTime:Date.now()+9000};
  happyBeavers.push(hb);
}

function moveHappyBeavers(){
  var now=Date.now();
  happyBeavers=happyBeavers.filter(function(hb){return now<hb.endTime;});
  happyBeavers.forEach(function(hb){
    var nearest=null,bd=Infinity;
    enemies.forEach(function(e){var d=Math.abs(e.x-hb.x)+Math.abs(e.y-hb.y);if(d<bd){bd=d;nearest=e;}});
    if(nearest){
      var dx=Math.sign(nearest.x-hb.x),dy=Math.sign(nearest.y-hb.y);
      if(Math.abs(nearest.x-hb.x)>=Math.abs(nearest.y-hb.y)){hb.x+=dx;if(Math.random()<0.3)hb.x+=dx;}
      else{hb.y+=dy;if(Math.random()<0.3)hb.y+=dy;}
      hb.x=Math.max(0,Math.min(COLS-1,hb.x));hb.y=Math.max(0,Math.min(ROWS-1,hb.y));
      var ki=enemies.findIndex(function(e){return e.x===hb.x&&e.y===hb.y;});
      if(ki!==-1){var killed=enemies.splice(ki,1)[0];killCount++;if(killCount>=4){killCount=0;vacuumSuck();}awardRupees(killed.type);
        var rd=killed.type==='wombat'?4110:6870;
        setTimeout(function(kt){return function(){if(gameOver)return;var pos;while(true){pos={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};if(Math.abs(pos.x-snake[0].x)+Math.abs(pos.y-snake[0].y)>=5&&!snake.some(function(s){return s.x===pos.x&&s.y===pos.y;}))break;}enemies.push({x:pos.x,y:pos.y,dir:DIRS[Math.floor(Math.random()*4)],type:kt});if(currentScreen==='main')draw();};}(killed.type),rd);
      }
    }
  });
}

function drawHappyBeavers(){
  happyBeavers.forEach(function(hb){
    var px=hb.x*GRID+GRID/2,py=hb.y*GRID+GRID/2;
    ctx.fillStyle='#ffd700';ctx.shadowColor='#ffd700';ctx.shadowBlur=6;
    ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle='#b8860b';ctx.beginPath();ctx.arc(px-3,py-3,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px+3,py-3,1.5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(px-2,py-1,1,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px+2,py-1,1,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.fillRect(px-1,py+2,1,2);ctx.fillRect(px,py+2,1,2);
  });
}

var inventoryOpen=false;

function openInventory(){
  inventoryOpen=true;clearInterval(tickInterval);drawInventory();
}

function drawInventory(){
  ctx.fillStyle='rgba(0,0,0,0.9)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.textAlign='center';
  ctx.fillStyle='#ffd700';ctx.font='bold 26px Segoe UI';ctx.fillText('Inventory',canvas.width/2,35);
  ctx.fillStyle='#2ecc71';ctx.font='14px Segoe UI';ctx.fillText('Rupees: '+rupees,canvas.width/2,55);
  var y=85;
  ctx.textAlign='left';ctx.font='15px Segoe UI';
  // Happy Beavers
  ctx.fillStyle=happyBeaverCount>0?'#ffd700':'#555';
  ctx.fillText('Happy Beavers: '+happyBeaverCount,30,y);
  ctx.fillStyle='#888';ctx.font='11px Segoe UI';ctx.fillText('Press 0 to deploy (9s, chases enemies)',30,y+15);
  y+=40;
  // Extra Lives
  ctx.fillStyle=extraLives>0?'#ff6b6b':'#555';ctx.font='15px Segoe UI';
  ctx.fillText('Extra Lives: '+extraLives,30,y);
  ctx.fillStyle='#888';ctx.font='11px Segoe UI';ctx.fillText('Auto-used on death (Y to confirm)',30,y+15);
  y+=40;
  // Spikes
  ctx.fillStyle=spikeCount>0?'#c0c0c0':'#555';ctx.font='15px Segoe UI';
  ctx.fillText('Tail Spikes: '+spikeCount,30,y);
  ctx.fillStyle='#888';ctx.font='11px Segoe UI';ctx.fillText('Kill enemies on tail contact',30,y+15);
  y+=40;
  // Gold Orange (active shooting)
  ctx.fillStyle=shooting?'#ff8c00':'#555';ctx.font='15px Segoe UI';
  ctx.fillText('Gold Orange: '+(shooting?'ACTIVE':'inactive'),30,y);
  if(shooting){var remaining=Math.max(0,Math.ceil((shootEnd-Date.now())/1000));ctx.fillStyle='#888';ctx.font='11px Segoe UI';ctx.fillText(remaining+'s remaining',30,y+15);}
  y+=40;
  // Portals
  ctx.fillStyle='#9b59b6';ctx.font='bold 16px Segoe UI';
  ctx.fillText('Portals:',30,y);
  y+=20;
  if(ownedPortals.length===0){ctx.fillStyle='#555';ctx.font='14px Segoe UI';ctx.fillText('None — buy from red sloths',30,y);}
  else{ownedPortals.forEach(function(p){ctx.fillStyle='#d470ff';ctx.font='14px Segoe UI';ctx.fillText('> '+p.name,40,y);y+=20;});}
  y+=15;
  ctx.fillStyle='#888';ctx.font='11px Segoe UI';
  ctx.fillText('Press . in Sloth landscapes to use portals',30,y);
  ctx.textAlign='center';ctx.fillStyle='#666';ctx.font='13px Segoe UI';
  ctx.fillText('Press / or Alt to close',canvas.width/2,canvas.height-15);
  msgEl.textContent='Inventory';
}

function openSlothShop(){
  slothShopOpen=true;slothShopSelection=1;slothShopDiscount=false;slothShopBeaver=false;slothShopBlue=false;
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

// === QUEST SHOP ===
var questShopOpen=false,questShopSelection=1,questShopMsg='';

var ALL_QUESTS=[
  // Raccoon kills
  {id:'rk3',  name:'Pest Control',        desc:'Kill 3 raccoons',       reward:2,  goal:3,  progress:function(){return Math.min(totalRaccoonKills,3);}},
  {id:'rk5',  name:'Raccoon Hunter',      desc:'Kill 5 raccoons',       reward:3,  goal:5,  progress:function(){return Math.min(totalRaccoonKills,5);}},
  {id:'rk10', name:'Raccoon Menace',      desc:'Kill 10 raccoons',      reward:6,  goal:10, progress:function(){return Math.min(totalRaccoonKills,10);}},
  {id:'rk20', name:'Raccoon Nightmare',   desc:'Kill 20 raccoons',      reward:9,  goal:20, progress:function(){return Math.min(totalRaccoonKills,20);}},
  // Wombat kills
  {id:'wk3',  name:'Wombat Trouble',      desc:'Kill 3 wombats',        reward:3,  goal:3,  progress:function(){return Math.min(totalWombatKills,3);}},
  {id:'wk5',  name:'Wombat Hunter',       desc:'Kill 5 wombats',        reward:5,  goal:5,  progress:function(){return Math.min(totalWombatKills,5);}},
  {id:'wk10', name:'Wombat Slayer',       desc:'Kill 10 wombats',       reward:8,  goal:10, progress:function(){return Math.min(totalWombatKills,10);}},
  {id:'wk15', name:'Wombat Bane',         desc:'Kill 15 wombats',       reward:11, goal:15, progress:function(){return Math.min(totalWombatKills,15);}},
  // Total kills
  {id:'tk8',  name:'First Blood',         desc:'Kill 8 enemies total',  reward:3,  goal:8,  progress:function(){return Math.min(totalRaccoonKills+totalWombatKills,8);}},
  {id:'tk15', name:'Enemy Purge',         desc:'Kill 15 enemies total', reward:5,  goal:15, progress:function(){return Math.min(totalRaccoonKills+totalWombatKills,15);}},
  {id:'tk30', name:'Exterminator',        desc:'Kill 30 enemies total', reward:9,  goal:30, progress:function(){return Math.min(totalRaccoonKills+totalWombatKills,30);}},
  {id:'tk50', name:'Mass Extinction',     desc:'Kill 50 enemies total', reward:14, goal:50, progress:function(){return Math.min(totalRaccoonKills+totalWombatKills,50);}},
  // Score quests
  {id:'sc5',  name:'Getting Started',     desc:'Reach score 5',         reward:2,  goal:5,  progress:function(){return Math.min(goldCount,5);}},
  {id:'sc10', name:'Double Digits',       desc:'Reach score 10',        reward:4,  goal:10, progress:function(){return Math.min(goldCount,10);}},
  {id:'sc20', name:'Gold Rush',           desc:'Reach score 20',        reward:7,  goal:20, progress:function(){return Math.min(goldCount,20);}},
  {id:'sc30', name:'Score Machine',       desc:'Reach score 30',        reward:11, goal:30, progress:function(){return Math.min(goldCount,30);}},
  // Snake length
  {id:'sl8',  name:'Growing Capy',        desc:'Grow to 8 segments',    reward:2,  goal:8,  progress:function(){return Math.min(snake?snake.length:0,8);}},
  {id:'sl15', name:'Long Boy',            desc:'Grow to 15 segments',   reward:5,  goal:15, progress:function(){return Math.min(snake?snake.length:0,15);}},
  {id:'sl25', name:'Mega Snake',          desc:'Grow to 25 segments',   reward:9,  goal:25, progress:function(){return Math.min(snake?snake.length:0,25);}},
  // Spikes
  {id:'sp1',  name:'Prickly',             desc:'Earn 1 spike',          reward:5,  goal:1,  progress:function(){return Math.min(spikeCount,1);}},
  {id:'sp3',  name:'Spike Lord',          desc:'Earn 3 spikes',         reward:12, goal:3,  progress:function(){return Math.min(spikeCount,3);}},
  // Oranges eaten
  {id:'oe10', name:'Orange Collector',    desc:'Eat 10 oranges',        reward:3,  goal:10, progress:function(){return Math.min(dailyOrangesEaten,10);}},
  {id:'oe25', name:'Orange Feast',        desc:'Eat 25 oranges',        reward:6,  goal:25, progress:function(){return Math.min(dailyOrangesEaten,25);}},
  {id:'oe50', name:'Citrus Addict',       desc:'Eat 50 oranges',        reward:11, goal:50, progress:function(){return Math.min(dailyOrangesEaten,50);}},
  // Shooting
  {id:'sh3',  name:'Sharpshooter',        desc:'Activate shooting 3x',  reward:4,  goal:3,  progress:function(){return Math.min(dailyShootsActivated,3);}},
  {id:'sh6',  name:'Trigger Happy',       desc:'Activate shooting 6x',  reward:8,  goal:6,  progress:function(){return Math.min(dailyShootsActivated,6);}},
  // Landscapes
  {id:'c5',   name:'Space Conqueror',     desc:'Beat Capy 5',           reward:10, goal:1,  progress:function(){return capy5Beaten?1:0;}},
  {id:'c7',   name:'River Master',        desc:'Beat Capy 7',           reward:10, goal:1,  progress:function(){return capy7Beaten?1:0;}}
];

var QUESTS=[];

function dailySeed(){
  var d=new Date().toDateString();
  var h=0;
  for(var i=0;i<d.length;i++){h=((h<<5)-h)+d.charCodeAt(i);h|=0;}
  return Math.abs(h);
}

function pickDailyQuests(){
  var seed=dailySeed();
  var pool=ALL_QUESTS.slice();
  for(var i=pool.length-1;i>0;i--){
    seed=(seed*1103515245+12345)&0x7fffffff;
    var j=seed%(i+1);
    var tmp=pool[i];pool[i]=pool[j];pool[j]=tmp;
  }
  QUESTS=pool.slice(0,7);
}

function getQuestDay(){
  var data=JSON.parse(localStorage.getItem('crawlingCapysQuestDay')||'{}');
  return data.day||'';
}
function checkQuestDayReset(){
  var today=new Date().toDateString();
  if(getQuestDay()!==today){
    totalRaccoonKills=0;totalWombatKills=0;capy5Beaten=false;capy7Beaten=false;claimedQuests=[];
    dailyOrangesEaten=0;dailyShootsActivated=0;
    localStorage.setItem('crawlingCapysQuestDay',JSON.stringify({day:today}));
  }
  pickDailyQuests();
}

function openQuestShop(){
  checkQuestDayReset();
  questShopOpen=true;questShopSelection=1;questShopMsg='';
  clearInterval(tickInterval);drawQuestShop();
}

function drawQuestShop(){
  ctx.fillStyle='rgba(0,0,0,0.9)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.textAlign='center';
  ctx.fillStyle='#e67e22';ctx.font='bold 24px Segoe UI';
  ctx.fillText('Daily Quests',canvas.width/2,35);
  ctx.fillStyle='#2ecc71';ctx.font='14px Segoe UI';
  ctx.fillText('Rupees: '+rupees,canvas.width/2,55);
  QUESTS.forEach(function(q,i){
    var y=75+i*44;var num=i+1;
    var prog=q.progress();var done=prog>=q.goal;
    var claimed=claimedQuests.indexOf(q.id)!==-1;
    var selected=questShopSelection===num;
    ctx.fillStyle=selected?(done&&!claimed?'#1a3a1a':'#1a1a2e'):'#0a0a1a';
    ctx.fillRect(15,y-12,370,38);
    ctx.strokeStyle=selected?'#e67e22':(claimed?'#555':(done?'#2ecc71':'#222'));
    ctx.lineWidth=selected?2:1;
    ctx.strokeRect(15,y-12,370,38);
    if(selected){ctx.fillStyle='#e67e22';ctx.font='bold 14px Segoe UI';ctx.textAlign='left';ctx.fillText('>',5,y+8);}
    ctx.fillStyle=claimed?'#555':(done?'#2ecc71':'#ccc');ctx.font='bold 13px Segoe UI';ctx.textAlign='left';
    ctx.fillText(q.name,25,y+3);
    ctx.fillStyle=claimed?'#444':'#888';ctx.font='11px Segoe UI';
    ctx.fillText(q.desc,25,y+18);
    var barX=240,barY=y-2,barW=70,barH=10;
    ctx.fillStyle='#1a1a2e';ctx.fillRect(barX,barY,barW,barH);
    var pct=Math.min(prog/q.goal,1);
    ctx.fillStyle=claimed?'#555':(done?'#2ecc71':'#e67e22');
    ctx.fillRect(barX,barY,barW*pct,barH);
    ctx.strokeStyle='#333';ctx.lineWidth=1;ctx.strokeRect(barX,barY,barW,barH);
    ctx.fillStyle=claimed?'#555':'#eee';ctx.font='9px Segoe UI';ctx.textAlign='center';
    ctx.fillText(prog+'/'+q.goal,barX+barW/2,barY+9);
    ctx.textAlign='right';
    if(claimed){ctx.fillStyle='#666';ctx.font='bold 12px Segoe UI';ctx.fillText('DONE',375,y+10);}
    else{ctx.fillStyle=done?'#ffd700':'#888';ctx.font='bold 12px Segoe UI';ctx.fillText('+'+q.reward+'R',375,y+10);}
  });
  ctx.textAlign='center';ctx.fillStyle='#666';ctx.font='12px Segoe UI';
  ctx.fillText('Up/Down select | Enter claim | Alt/ESC close',canvas.width/2,canvas.height-15);
  if(questShopMsg){ctx.fillStyle='#ffd700';ctx.font='bold 14px Segoe UI';ctx.fillText(questShopMsg,canvas.width/2,canvas.height-35);}
  msgEl.textContent='Daily Quests — Rupees: '+rupees;
}

function claimQuest(idx){
  if(idx<0||idx>=QUESTS.length)return;
  var q=QUESTS[idx];
  if(claimedQuests.indexOf(q.id)!==-1){questShopMsg='Already claimed!';drawQuestShop();setTimeout(function(){questShopMsg='';if(questShopOpen)drawQuestShop();},1200);return;}
  if(q.progress()<q.goal){questShopMsg='Not completed yet!';drawQuestShop();setTimeout(function(){questShopMsg='';if(questShopOpen)drawQuestShop();},1200);return;}
  rupees+=q.reward;claimedQuests.push(q.id);
  questShopMsg='Claimed +'+q.reward+' rupees!';
  drawQuestShop();setTimeout(function(){questShopMsg='';if(questShopOpen)drawQuestShop();},1500);
}

function drawQuestSloth(sx,sy){
  var px=sx*GRID+GRID,py=sy*GRID+GRID*1.5;
  if(QUESTS.length===0)pickDailyQuests();
  var hasClaimable=QUESTS.some(function(q){return q.progress()>=q.goal&&claimedQuests.indexOf(q.id)===-1;});
  var glow=hasClaimable?'#2ecc71':'#e67e22';
  var fur=hasClaimable?'#4a8a50':'#8a7050';
  var belly=hasClaimable?'#6aaa70':'#a89070';
  var patch=hasClaimable?'#2a5a30':'#5a4030';
  var eye=hasClaimable?'#2ecc71':'#e67e22';
  ctx.shadowColor=glow;ctx.shadowBlur=12;
  ctx.fillStyle=fur;ctx.beginPath();ctx.ellipse(px,py+10,16,22,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=belly;ctx.beginPath();ctx.ellipse(px,py+14,10,14,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=fur;ctx.beginPath();ctx.arc(px,py-14,14,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=patch;
  ctx.beginPath();ctx.ellipse(px-6,py-14,6,5,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+6,py-14,6,5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=eye;
  ctx.beginPath();ctx.ellipse(px-6,py-14,3,1.5,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(px+6,py-14,3,1.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#3a2a1a';ctx.beginPath();ctx.arc(px,py-9,2.5,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=patch;ctx.lineWidth=1.2;
  ctx.beginPath();ctx.arc(px,py-5,4,0.1*Math.PI,0.9*Math.PI);ctx.stroke();
  ctx.strokeStyle=fur;ctx.lineWidth=5;
  ctx.beginPath();ctx.moveTo(px-14,py+2);ctx.quadraticCurveTo(px-26,py-8,px-22,py-18);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px+14,py+2);ctx.quadraticCurveTo(px+26,py-8,px+22,py-18);ctx.stroke();
  ctx.strokeStyle='#4a3a2a';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(px-22,py-18);ctx.lineTo(px-25,py-22);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px-22,py-18);ctx.lineTo(px-19,py-22);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px+22,py-18);ctx.lineTo(px+25,py-22);ctx.stroke();
  ctx.beginPath();ctx.moveTo(px+22,py-18);ctx.lineTo(px+19,py-22);ctx.stroke();
  ctx.shadowBlur=0;
  ctx.fillStyle=glow;ctx.font='bold 9px Segoe UI';ctx.textAlign='center';
  ctx.fillText('QUESTS',px,py-30);
}

// === MENU ===
var menuActive=true,gameSelectActive=false,gameDeleteMode=false,namingActive=false,nameInput='',renamingGameIdx=-1,saveBrowseActive=false,saveBrowseDelete=false;

function drawMenu(){ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#00ff88';ctx.shadowColor='#00ff88';ctx.shadowBlur=20;ctx.font='bold 48px Segoe UI';ctx.textAlign='center';ctx.fillText('CrawlingCapys',canvas.width/2,100);ctx.shadowBlur=0;var cx=canvas.width/2;ctx.fillStyle='#8B6914';ctx.beginPath();ctx.arc(cx,160,20,0,Math.PI*2);ctx.fill();ctx.fillStyle='#6B4F10';ctx.beginPath();ctx.arc(cx-12,145,6,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+12,145,6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(cx-6,157,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+6,157,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#5a3e1b';ctx.beginPath();ctx.ellipse(cx,167,6,4,0,0,Math.PI*2);ctx.fill();var games=getAllGames();ctx.font='bold 22px Segoe UI';ctx.fillStyle='#00ff88';ctx.fillText('[1] New Game',cx,240);if(games.length>0){ctx.fillStyle='#ffd700';ctx.fillText('[2] Play Old Game',cx,285);ctx.font='14px Segoe UI';ctx.fillStyle='#888';ctx.fillText('('+games.length+' game'+(games.length>1?'s':'')+')',cx,310);}else{ctx.fillStyle='#555';ctx.font='18px Segoe UI';ctx.fillText('No old games yet',cx,285);}ctx.fillStyle='#555';ctx.font='13px Segoe UI';ctx.fillText('Capybara Snake — collect oranges, avoid danger',cx,canvas.height-20);msgEl.textContent='Press 1 for New Game, 2 for Old Game';}

function drawNamingScreen(){ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);var cx=canvas.width/2;ctx.fillStyle='#00ff88';ctx.font='bold 26px Segoe UI';ctx.textAlign='center';ctx.fillText('Name Your Game',cx,100);ctx.fillStyle='#16213e';ctx.fillRect(cx-140,140,280,40);ctx.strokeStyle='#00ff88';ctx.lineWidth=2;ctx.strokeRect(cx-140,140,280,40);ctx.fillStyle='#eee';ctx.font='20px Segoe UI';ctx.fillText(nameInput+(Math.floor(Date.now()/500)%2===0?'|':''),cx,167);ctx.fillStyle='#888';ctx.font='14px Segoe UI';ctx.fillText('Type a name and press Enter',cx,220);ctx.fillText('Press ESC to cancel',cx,245);msgEl.textContent='Type a name for your game';}

function drawRenameScreen(){ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);var cx=canvas.width/2;var games=getAllGames();var oldName=renamingGameIdx<games.length?games[renamingGameIdx].name:'';ctx.fillStyle='#ffd700';ctx.font='bold 26px Segoe UI';ctx.textAlign='center';ctx.fillText('Rename Game',cx,80);ctx.fillStyle='#888';ctx.font='14px Segoe UI';ctx.fillText('Current: '+oldName,cx,115);ctx.fillStyle='#16213e';ctx.fillRect(cx-140,140,280,40);ctx.strokeStyle='#ffd700';ctx.lineWidth=2;ctx.strokeRect(cx-140,140,280,40);ctx.fillStyle='#eee';ctx.font='20px Segoe UI';ctx.fillText(nameInput+(Math.floor(Date.now()/500)%2===0?'|':''),cx,167);ctx.fillStyle='#888';ctx.font='14px Segoe UI';ctx.fillText('Type new name and press Enter',cx,220);ctx.fillText('Press ESC to cancel',cx,245);msgEl.textContent='Rename your game';}

function drawGameSelect(){var games=getAllGames();ctx.fillStyle='rgba(0,0,0,0.9)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.textAlign='center';ctx.fillStyle='#ffd700';ctx.font='bold 22px Segoe UI';ctx.fillText('Select a Game',canvas.width/2,40);if(games.length===0){ctx.fillStyle='#888';ctx.font='16px Segoe UI';ctx.fillText('No games yet',canvas.width/2,canvas.height/2);}else{games.forEach(function(g,i){if(i>=9)return;var y=75+i*40;var date=new Date(g.created);var ds=date.toLocaleDateString();var sc=g.saves.length;var bs=sc>0?Math.max.apply(null,g.saves.map(function(s){return s.score;})):0;ctx.fillStyle='#eee';ctx.font='15px Segoe UI';ctx.fillText('['+(i+1)+'] '+g.name+' | Saves: '+sc+' | Best: '+bs+' | '+ds,canvas.width/2,y);});}ctx.fillStyle='#666';ctx.font='13px Segoe UI';if(gameDeleteMode){ctx.fillStyle='#ff4757';ctx.fillText('DELETE — Press number to delete | ESC to cancel',canvas.width/2,canvas.height-20);msgEl.textContent='Delete mode';}else{ctx.fillText('Number=select | R+num=rename | X=delete | ESC=back',canvas.width/2,canvas.height-20);msgEl.textContent='Pick a game';}}

document.addEventListener('keydown',function menuHandler(e){
  if(!menuActive)return;
  if(saveBrowseActive){
    if(e.key==='Escape'){if(saveBrowseDelete){saveBrowseDelete=false;showSaveMenu();}else{saveBrowseActive=false;gameSelectActive=true;drawGameSelect();}return;}
    if(e.key==='x'||e.key==='X'){saveBrowseDelete=true;showSaveMenu();return;}
    var sbSlot=parseInt(e.key)-1;var sbSaves=getSavesList();
    if(sbSlot>=0&&sbSlot<sbSaves.length){
      if(saveBrowseDelete){var sbGames=getAllGames();var sbGm=sbGames.find(function(g){return g.id===currentGameId;});if(sbGm){sbGm.saves.splice(sbSlot,1);saveAllGames(sbGames);}saveBrowseDelete=false;showSaveMenu();}
      else{saveBrowseActive=false;menuActive=false;loadGame(sbSlot);}
    }
    return;
  }
  if(namingActive){if(e.key==='Escape'){namingActive=false;nameInput='';drawMenu();return;}if(e.key==='Enter'){var name=nameInput.trim()||'Game '+(getAllGames().length+1);namingActive=false;nameInput='';createNewGame(name);return;}if(e.key==='Backspace'){e.preventDefault();nameInput=nameInput.slice(0,-1);drawNamingScreen();return;}if(e.key.length===1&&nameInput.length<20){nameInput+=e.key;drawNamingScreen();}return;}
  if(renamingGameIdx>=0){if(e.key==='Escape'){renamingGameIdx=-1;nameInput='';drawGameSelect();return;}if(e.key==='Enter'){var games=getAllGames();if(renamingGameIdx<games.length&&nameInput.trim()){games[renamingGameIdx].name=nameInput.trim();saveAllGames(games);}renamingGameIdx=-1;nameInput='';drawGameSelect();return;}if(e.key==='Backspace'){e.preventDefault();nameInput=nameInput.slice(0,-1);drawRenameScreen();return;}if(e.key.length===1&&nameInput.length<20){nameInput+=e.key;drawRenameScreen();}return;}
  if(gameSelectActive){if(e.key==='Escape'){if(gameDeleteMode){gameDeleteMode=false;drawGameSelect();}else{gameSelectActive=false;drawMenu();}return;}if((e.key==='x'||e.key==='X')&&!gameDeleteMode){gameDeleteMode=true;drawGameSelect();return;}if(gameDeleteMode){var slot=parseInt(e.key)-1;var games2=getAllGames();if(slot>=0&&slot<games2.length){games2.splice(slot,1);saveAllGames(games2);gameDeleteMode=false;if(games2.length===0){gameSelectActive=false;drawMenu();}else drawGameSelect();}return;}if(e.key==='r'||e.key==='R'){msgEl.textContent='Press number of game to rename...';var rh=function(e2){document.removeEventListener('keydown',rh,true);var sl=parseInt(e2.key)-1;var gms=getAllGames();if(sl>=0&&sl<gms.length){renamingGameIdx=sl;nameInput=gms[sl].name;drawRenameScreen();}else drawGameSelect();e2.stopPropagation();e2.preventDefault();};document.addEventListener('keydown',rh,true);return;}var slot2=parseInt(e.key)-1;var games3=getAllGames();if(slot2>=0&&slot2<games3.length){gameSelectActive=false;currentGameId=games3[slot2].id;creativeMode=(games3[slot2].name==='CapyBopyCIG');gameOver=false;running=false;if(games3[slot2].saves.length>0){saveBrowseActive=true;saveBrowseDelete=false;showSaveMenu();}else{menuActive=false;init();restartTimer();}}return;}
  if(e.key==='1'){namingActive=true;nameInput='';drawNamingScreen();}
  else if(e.key==='2'){var games4=getAllGames();if(games4.length>0){gameSelectActive=true;gameDeleteMode=false;drawGameSelect();}}
});

drawMenu();
