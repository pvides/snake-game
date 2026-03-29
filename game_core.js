function draw() {
  ctx.fillStyle='#0f0f23';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle='#16213e';ctx.lineWidth=0.5;
  for(var i=0;i<=COLS;i++){ctx.beginPath();ctx.moveTo(i*GRID,0);ctx.lineTo(i*GRID,canvas.height);ctx.stroke();}
  for(var i2=0;i2<=ROWS;i2++){ctx.beginPath();ctx.moveTo(0,i2*GRID);ctx.lineTo(canvas.width,i2*GRID);ctx.stroke();}
  if(goldOrange){var gx=goldOrange.x*GRID+GRID/2,gy=goldOrange.y*GRID+GRID/2;ctx.shadowColor='#ffd700';ctx.shadowBlur=14;ctx.fillStyle='#ffd700';ctx.beginPath();ctx.arc(gx,gy,GRID/2-2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#2ecc71';ctx.beginPath();ctx.ellipse(gx+2,gy-(GRID/2-2)-1,3,5,Math.PI/6,0,Math.PI*2);ctx.fill();}
  bullets.forEach(function(b){drawBullet(b.x,b.y);});
  drawEnemies();drawHappyBeavers();
  if(beaver){drawBeaver(beaver.x*GRID+GRID/2,beaver.y*GRID+GRID/2);}
  beaverLogs.forEach(function(l){drawBeaverLog(l.x,l.y,l.gold,l.purple);});
  drawStorms();
  var fx=food.x*GRID+GRID/2,fy=food.y*GRID+GRID/2,r=GRID/2-2;
  ctx.fillStyle='#ff8c00';ctx.shadowColor='#ff8c00';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(fx,fy,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle='#2ecc71';ctx.beginPath();ctx.ellipse(fx+2,fy-r-1,3,5,Math.PI/6,0,Math.PI*2);ctx.fill();
  if(wanderer){var wx=wanderer.x*GRID+GRID/2,wy=wanderer.y*GRID+GRID/2;ctx.fillStyle='#8B6914';ctx.beginPath();ctx.arc(wx,wy,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#6B4F10';ctx.beginPath();ctx.arc(wx-5,wy-7,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(wx+5,wy-7,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#C4956A';ctx.beginPath();ctx.arc(wx-5,wy-7,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(wx+5,wy-7,1.5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(wx-3,wy-2,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(wx+3,wy-2,1.5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#5a3e1b';ctx.beginPath();ctx.ellipse(wx,wy+3,3,2,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3a2510';ctx.beginPath();ctx.arc(wx-1.2,wy+3,0.8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(wx+1.2,wy+3,0.8,0,Math.PI*2);ctx.fill();}
  var shielded=Date.now()<purpleShieldEnd;
  if(shielded){snake.forEach(function(seg){ctx.shadowColor='#9b59b6';ctx.shadowBlur=12;ctx.strokeStyle='rgba(155,89,182,0.5)';ctx.lineWidth=2;ctx.strokeRect(seg.x*GRID,seg.y*GRID,GRID,GRID);ctx.shadowBlur=0;});}
  snake.forEach(function(seg,i){
    var sx=seg.x*GRID,sy=seg.y*GRID;
    if(i===0){var cx=sx+GRID/2,cy=sy+GRID/2;ctx.fillStyle='#3b2314';ctx.beginPath();ctx.arc(cx,cy-2,9,Math.PI,0);ctx.fill();ctx.fillStyle='#f5cba7';ctx.beginPath();ctx.arc(cx,cy,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3b2314';ctx.beginPath();ctx.ellipse(cx,cy-6,8,4,0,0,Math.PI);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(cx-3,cy-1,2.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+3,cy-1,2.2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#2c3e50';ctx.beginPath();ctx.arc(cx-3,cy-1,1.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+3,cy-1,1.2,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#c0392b';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy+2,3,0.1*Math.PI,0.9*Math.PI);ctx.stroke();}
    else{var isGold2=i<=goldCount;var cx2=sx+GRID/2,cy2=sy+GRID/2;if(isGold2){ctx.shadowColor='#ffd700';ctx.shadowBlur=6;}ctx.fillStyle=isGold2?'#ffd700':'#8B6914';ctx.beginPath();ctx.arc(cx2,cy2,8,0,Math.PI*2);ctx.fill();ctx.fillStyle=isGold2?'#daa520':'#6B4F10';ctx.beginPath();ctx.arc(cx2-5,cy2-7,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx2+5,cy2-7,3,0,Math.PI*2);ctx.fill();ctx.fillStyle=isGold2?'#ffe066':'#C4956A';ctx.beginPath();ctx.arc(cx2-5,cy2-7,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx2+5,cy2-7,1.5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(cx2-3,cy2-2,1.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx2+3,cy2-2,1.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle=isGold2?'#b8860b':'#5a3e1b';ctx.beginPath();ctx.ellipse(cx2,cy2+3,3,2,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=isGold2?'#8b6508':'#3a2510';ctx.beginPath();ctx.arc(cx2-1.2,cy2+3,0.8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx2+1.2,cy2+3,0.8,0,Math.PI*2);ctx.fill();
      var tailPos=snake.length-1-i;if(tailPos<spikeCount)drawSpikes(cx2,cy2,i,snake);
    }
  });
  // HUD
  ctx.textAlign='left';ctx.font='11px Segoe UI';
  ctx.fillStyle='#2ecc71';ctx.fillText('Rupees: '+rupees,5,canvas.height-18);
  ctx.fillStyle='#ff6b6b';ctx.fillText('Lives: '+extraLives,5,canvas.height-5);
  ctx.fillStyle='#ffd700';ctx.fillText('Beavers: '+happyBeaverCount,80,canvas.height-18);
  if(gameOver){ctx.fillStyle='rgba(0,0,0,0.55)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#ff4757';ctx.font='bold 36px Segoe UI';ctx.textAlign='center';ctx.fillText('Game Over',canvas.width/2,canvas.height/2-10);ctx.fillStyle='#eee';ctx.font='18px Segoe UI';ctx.fillText('Score: '+score,canvas.width/2,canvas.height/2+24);}
}

function step() {
  if(!running||gameOver||currentScreen!=='main')return;
  if(creativeMode&&!creativeMoveQueued)return;
  creativeMoveQueued=false;
  dir={x:nextDir.x,y:nextDir.y};
  var head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  if(head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS)return die();
  if(snake.some(function(s){return s.x===head.x&&s.y===head.y;}))return die();
  var shieldActive=Date.now()<purpleShieldEnd;
  moveEnemies();
  if(!shieldActive)applyStormDamage();else applyStormDamageEnemiesOnly();
  if(currentScreen!=='main')return;
  moveBeaver();moveBeaverLogs();checkBeaverLogHits();moveHappyBeavers();
  if(!shieldActive&&!creativeMode){
    var hitRaccoon=enemies.some(function(e){return e.type==='raccoon'&&(snake.some(function(s){return s.x===e.x&&s.y===e.y;})||(head.x===e.x&&head.y===e.y));});
    var hitWombat=enemies.some(function(e){return e.type==='wombat'&&(snake.some(function(s){return s.x===e.x&&s.y===e.y;})||(head.x===e.x&&head.y===e.y));});
    if(hitWombat){if(goldCount<=1)return die();goldCount-=2;score=goldCount;scoreEl.textContent=score;var kl=1+Math.max(1,goldCount);if(snake.length>kl)snake.length=kl;}
    if(hitRaccoon){if(goldCount<=0)return die();goldCount--;score=goldCount;scoreEl.textContent=score;var kl2=1+Math.max(1,goldCount);if(snake.length>kl2)snake.length=kl2;}
  }
  if(spikeCount>0){for(var i=enemies.length-1;i>=0;i--){var e=enemies[i];for(var s=snake.length-1;s>=Math.max(1,snake.length-spikeCount);s--){if(snake[s]&&snake[s].x===e.x&&snake[s].y===e.y){var killed=enemies.splice(i,1)[0];killCount++;if(killCount>=4){killCount=0;vacuumSuck();}awardRupees(killed.type);var rd2=killed.type==='wombat'?4110:6870;setTimeout(function(kt){return function(){if(gameOver)return;var pos;while(true){pos={x:Math.floor(Math.random()*COLS),y:Math.floor(Math.random()*ROWS)};if(Math.abs(pos.x-snake[0].x)+Math.abs(pos.y-snake[0].y)>=5&&!snake.some(function(s2){return s2.x===pos.x&&s2.y===pos.y;}))break;}enemies.push({x:pos.x,y:pos.y,dir:DIRS[Math.floor(Math.random()*4)],type:kt});if(currentScreen==='main')draw();};}(killed.type),rd2);break;}}}}
  moveBullets();
  if(shooting){fireBullets();if(Date.now()>=shootEnd){shooting=false;bullets=[];}}
  snake.unshift(head);
  applyVacuum();
  if(goldOrange&&head.x===goldOrange.x&&head.y===goldOrange.y){goldOrange=null;shooting=true;shootEnd=Date.now()+8340;lastGoldOrangeEatTime=Date.now();scheduleGoldOrange();snake.pop();dailyShootsActivated++;}
  else if(head.x===food.x&&head.y===food.y){goldCount++;score=goldCount;scoreEl.textContent=score;if(score>best){best=score;bestEl.textContent=best;}placeFood();var threshold2=Math.floor(score/15);if(!creativeMode&&threshold2>lastEnemyThreshold){lastEnemyThreshold=threshold2;spawnEnemy();}snake.pop();tryTriggerStorm();dailyOrangesEaten++;}
  else if(wanderer&&head.x===wanderer.x&&head.y===wanderer.y){wanderer=null;msgEl.textContent='Capybara caught! +1 segment';setTimeout(function(){if(!gameOver&&currentScreen==='main')msgEl.textContent='';},1000);setTimeout(function rWE(){if(gameOver)return;if(currentScreen!=='main'){setTimeout(rWE,1000);return;}placeWanderer();draw();},2170);}
  else{snake.pop();}
  draw();
}

var deathChoicePending=false;

function die() {
  if(creativeMode)return;
  if(extraLives>0){
    deathChoicePending=true;
    clearInterval(tickInterval);
    drawDeathChoice();
    return;
  }
  clearInterval(tickInterval);
  gameOver=true;running=false;
  // Reset to main game for game over screen
  if(currentScreen!=='main'){
    currentScreen='main';
    // Ensure snake exists for draw
    if(!snake||snake.length===0){var mid=Math.floor(ROWS/2);snake=[{x:5,y:mid}];}
    if(!food)food={x:10,y:10};
  }
  draw();msgEl.textContent='Press R or Space to restart';
}

function drawDeathChoice(){
  ctx.fillStyle='rgba(0,0,0,0.75)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.textAlign='center';
  ctx.fillStyle='#ff4757';ctx.font='bold 28px Segoe UI';ctx.fillText('You Died!',canvas.width/2,canvas.height/2-50);
  ctx.fillStyle='#eee';ctx.font='18px Segoe UI';ctx.fillText('You have '+extraLives+' extra '+(extraLives===1?'life':'lives'),canvas.width/2,canvas.height/2-15);
  ctx.fillStyle='#2ecc71';ctx.font='bold 20px Segoe UI';ctx.fillText('[Y] Use extra life',canvas.width/2,canvas.height/2+25);
  ctx.fillStyle='#ff6b6b';ctx.font='bold 20px Segoe UI';ctx.fillText('[N] Game over',canvas.width/2,canvas.height/2+60);
}

function useExtraLife(){
  deathChoicePending=false;
  extraLives--;
  if(currentScreen==='capy5'){
    capy5HP=Math.min(5,capy5HP+3);
  }else if(currentScreen==='capy7'){
    // Reset player to starting island
    capy7Player={x:Math.floor(COLS/2),y:C7_ISLAND_BOT};
  }else{
    if(snake&&snake.length>0){for(var el=0;el<3;el++)snake.push({x:snake[snake.length-1].x,y:snake[snake.length-1].y});}
  }
  msgEl.textContent='Extra life used! ('+extraLives+' left)';
  setTimeout(function(){if(!gameOver)msgEl.textContent='';},1500);
  resumeCurrentScreen();
}

function declineExtraLife(){
  deathChoicePending=false;
  gameOver=true;running=false;currentScreen='main';draw();msgEl.textContent='Press R or Space to restart';
}

var KEY_MAP={ArrowUp:{x:0,y:-1},w:{x:0,y:-1},W:{x:0,y:-1},ArrowDown:{x:0,y:1},s:{x:0,y:1},S:{x:0,y:1},ArrowLeft:{x:-1,y:0},a:{x:-1,y:0},A:{x:-1,y:0},ArrowRight:{x:1,y:0},d:{x:1,y:0},D:{x:1,y:0}};

var saveMenuOpen=false;
var deleteMode2=false;

document.addEventListener('keydown',function(e){
  if(cutsceneActive){if(e.key==='x'||e.key==='X')skipCutscene();if(e.key==='Tab'){cutsceneActive=false;if(cutsceneTimer2)clearTimeout(cutsceneTimer2);menuActive=true;drawMenu();}return;}
  if(deathChoicePending){
    if(e.key==='y'||e.key==='Y'){useExtraLife();return;}
    if(e.key==='n'||e.key==='N'){declineExtraLife();return;}
    return;
  }
  if(slothShopOpen){
    if(e.key==='Alt'){e.preventDefault();slothShopOpen=false;resumeCurrentScreen();return;}
    if(e.key==='Enter'){
      e.preventDefault();
      if(slothShopBlue){buyFromBlueSloth(slothShopSelection);}
      else if(slothShopBeaver){buyHappyBeaver();}
      else if(slothShopDiscount){buyFromDiscountSloth(slothShopSelection);}
      else if(slothShopSelection===1)buyFromSloth(1);
      else if(slothShopSelection===2)buyFromSloth(2);
      else if(slothShopSelection===3)buyFromSloth(3);
      return;
    }
    var shopDraw=slothShopBlue?drawBlueShop:(slothShopBeaver?drawBeaverShop:(slothShopDiscount?drawDiscountShop:drawSlothShop));
    var maxSel=slothShopBlue?3:(slothShopBeaver?1:3);
    if(e.key==='ArrowUp'||e.key==='w'||e.key==='W'){slothShopSelection=Math.max(1,slothShopSelection-1);shopDraw();return;}
    if(e.key==='ArrowDown'||e.key==='s'||e.key==='S'){slothShopSelection=Math.min(maxSel,slothShopSelection+1);shopDraw();return;}
    if(e.key==='1'){slothShopSelection=1;shopDraw();return;}
    if(e.key==='2'){slothShopSelection=2;shopDraw();return;}
    if(e.key==='3'){slothShopSelection=3;shopDraw();return;}
    return;
  }
  if(portalShopOpen){
    if(e.key==='Alt'){e.preventDefault();portalShopOpen=false;resumeCurrentScreen();return;}
    if(e.key==='Enter'){e.preventDefault();buyPortal(portalShopSelection-1);return;}
    if(e.key==='ArrowUp'||e.key==='w'||e.key==='W'){portalShopSelection=Math.max(1,portalShopSelection-1);drawPortalShop();return;}
    if(e.key==='ArrowDown'||e.key==='s'||e.key==='S'){portalShopSelection=Math.min(portalShopItems.length,portalShopSelection+1);drawPortalShop();return;}
    return;
  }
  if(portalUseOpen){
    if(e.key==='Alt'){e.preventDefault();portalUseOpen=false;resumeCurrentScreen();return;}
    if(e.key==='Enter'){e.preventDefault();usePortal(portalUseSelection-1);return;}
    if(e.key==='ArrowUp'||e.key==='w'||e.key==='W'){portalUseSelection=Math.max(1,portalUseSelection-1);drawPortalUseMenu();return;}
    if(e.key==='ArrowDown'||e.key==='s'||e.key==='S'){portalUseSelection=Math.min(ownedPortals.length,portalUseSelection+1);drawPortalUseMenu();return;}
    return;
  }
  if(inventoryOpen){
    if(e.key==='/'||e.key==='Alt'||e.key==='Escape'){e.preventDefault();inventoryOpen=false;resumeCurrentScreen();return;}
    return;
  }
  if(gambleOpen){
    if(gambleRevealed){if(e.key==='Alt'||e.key==='Escape'){gambleOpen=false;resumeCurrentScreen();}return;}
    if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A'){gambleSelection=Math.max(1,gambleSelection-1);drawGamble();return;}
    if(e.key==='ArrowRight'||e.key==='d'||e.key==='D'){gambleSelection=Math.min(4,gambleSelection+1);drawGamble();return;}
    if(e.key==='1'){gambleSelection=1;drawGamble();return;}
    if(e.key==='2'){gambleSelection=2;drawGamble();return;}
    if(e.key==='3'){gambleSelection=3;drawGamble();return;}
    if(e.key==='4'){gambleSelection=4;drawGamble();return;}
    if(e.key==='Enter'){e.preventDefault();pickBox(gambleSelection-1);return;}
    if(e.key==='Alt'||e.key==='Escape'){gambleOpen=false;resumeCurrentScreen();return;}
    return;
  }
  if(infoShopOpen){
    if(e.key==='Enter'){e.preventDefault();buyInfo();return;}
    if(e.key==='Alt'||e.key==='Escape'){infoShopOpen=false;resumeCurrentScreen();return;}
    return;
  }
  if(scamShopOpen){
    if(e.key==='Enter'&&scamPhase===0){e.preventDefault();payScamSloth();return;}
    if(e.key==='Alt'||e.key==='Escape'){scamShopOpen=false;resumeCurrentScreen();return;}
    return;
  }
  if(questShopOpen){
    if(e.key==='Alt'||e.key==='Escape'){questShopOpen=false;resumeCurrentScreen();return;}
    if(e.key==='Enter'){e.preventDefault();claimQuest(questShopSelection-1);return;}
    if(e.key==='ArrowUp'||e.key==='w'||e.key==='W'){questShopSelection=Math.max(1,questShopSelection-1);drawQuestShop();return;}
    if(e.key==='ArrowDown'||e.key==='s'||e.key==='S'){questShopSelection=Math.min(QUESTS.length,questShopSelection+1);drawQuestShop();return;}
    return;
  }
  if(saveMenuOpen){
    if(e.key===' '){e.preventDefault();saveMenuOpen=false;deleteMode2=false;resumeCurrentScreen();return;}
    if(e.key==='x'||e.key==='X'){deleteMode2=true;showSaveMenu();return;}
    if(e.key==='Escape'){if(deleteMode2){deleteMode2=false;showSaveMenu();}else{saveMenuOpen=false;resumeCurrentScreen();}return;}
    var slot=parseInt(e.key)-1;var saves=getSavesList();
    if(slot>=0&&slot<saves.length){if(deleteMode2){var games=getAllGames();var gm=games.find(function(g){return g.id===currentGameId;});if(gm){gm.saves.splice(slot,1);saveAllGames(games);}deleteMode2=false;showSaveMenu();}else{saveMenuOpen=false;loadGame(slot);}}
    return;
  }
  if(menuActive)return;
  if(e.key==='/'){e.preventDefault();openInventory();return;}
  if(currentScreen==='capy2'){
    if(e.key==='Escape'){clearInterval(tickInterval);currentScreen='main';draw();restartTimer();return;}
    if(e.key==='='){saveGame();return;}if(e.key==='-'){saveMenuOpen=true;deleteMode2=false;clearInterval(tickInterval);showSaveMenu();return;}
    if(e.key==='Enter'&&goldCount>0){e.preventDefault();goldCount--;score=goldCount;scoreEl.textContent=score;clearInterval(tickInterval);enterCapy2();return;}
    var mapped=KEY_MAP[e.key];if(mapped){e.preventDefault();if(mapped.x!==-dir.x||mapped.y!==-dir.y)nextDir=mapped;if(!capy2Running)capy2Running=true;}return;
  }
  if(currentScreen==='capy3'){
    if(e.key==='Escape'){clearInterval(tickInterval);returnToMainGame();return;}
    if(e.key==='='){saveGame();return;}if(e.key==='-'){saveMenuOpen=true;deleteMode2=false;clearInterval(tickInterval);showSaveMenu();return;}
    if(e.key==='Enter'&&goldCount>0){e.preventDefault();goldCount--;score=goldCount;scoreEl.textContent=score;clearInterval(tickInterval);enterCapy2();return;}
    var mapped2=KEY_MAP[e.key];if(mapped2){e.preventDefault();if(mapped2.x!==-dir.x||mapped2.y!==-dir.y)nextDir=mapped2;if(!capy3Running)capy3Running=true;}return;
  }
  if(currentScreen==='capy4'){
    if(e.key==='Escape'){clearInterval(tickInterval);returnToMainGame();return;}
    if(e.key==='='){saveGame();return;}if(e.key==='-'){saveMenuOpen=true;deleteMode2=false;clearInterval(tickInterval);showSaveMenu();return;}
    if(e.key==='Enter'&&goldCount>0){e.preventDefault();goldCount--;score=goldCount;scoreEl.textContent=score;clearInterval(tickInterval);enterCapy2();return;}
    var mapped3=KEY_MAP[e.key];if(mapped3){e.preventDefault();if(mapped3.x!==-dir.x||mapped3.y!==-dir.y)nextDir=mapped3;if(!capy4Running)capy4Running=true;}return;
  }
  if(currentScreen==='capy5'){
    if(e.key==='Escape'){clearInterval(tickInterval);returnToMainGame();return;}
    if(e.key==='='){saveGame();return;}if(e.key==='-'){saveMenuOpen=true;deleteMode2=false;clearInterval(tickInterval);showSaveMenu();return;}
    if(e.key==='Enter'&&goldCount>0){e.preventDefault();goldCount--;score=goldCount;scoreEl.textContent=score;clearInterval(tickInterval);enterCapy2();return;}
    if(e.key==='CapsLock'&&shieldUses>0){e.preventDefault();shieldActive5=true;shieldUses--;if(shieldUses<=0)shieldRechargeEnd=Date.now()+2000;setTimeout(function(){shieldActive5=false;},500);return;}
    if(e.key==='Shift'&&swordUses>=3&&!swordSpinActive){e.preventDefault();swordSpinActive=true;swordSpinEnd=Date.now()+400;swordUses-=3;if(swordUses<=0)swordRechargeEnd=Date.now()+4000;if(capy5Player){for(var ii=capy5Enemies.length-1;ii>=0;ii--){var ex=capy5Enemies[ii];if(Math.abs(ex.x-capy5Player.x)<=2&&Math.abs(ex.y-capy5Player.y)<=2){ex.hp--;if(ex.hp<=0){capy5Enemies.splice(ii,1);rupees+=1;}}}if(capy5Boss&&Math.abs(capy5Boss.x-capy5Player.x)<=3&&Math.abs(capy5Boss.y-capy5Player.y)<=3){capy5Boss.armor--;if(capy5Boss.armor<=0){capy5Boss=null;rupees+=3;}}}return;}
    if(e.key==='Control'&&swordUses>0&&!swordSpinActive){swordSpinActive=true;swordSpinEnd=Date.now()+300;swordUses--;if(swordUses<=0)swordRechargeEnd=Date.now()+4000;return;}
    var mapped4=KEY_MAP[e.key];if(mapped4){e.preventDefault();nextDir=mapped4;if(!capy5Running)capy5Running=true;capy5MoveQueued=true;}return;
  }
  if(currentScreen==='capy7'){
    if(e.key==='Escape'){clearInterval(tickInterval);returnToMainGame();return;}
    if(e.key==='='){saveGame();return;}if(e.key==='-'){saveMenuOpen=true;deleteMode2=false;clearInterval(tickInterval);showSaveMenu();return;}
    if(capy7CutsceneActive){if(e.key==='x'||e.key==='X'){capy7CutsceneActive=false;clearInterval(tickInterval);enterSloth2();}return;}
    var mapped6=KEY_MAP[e.key];
    if(mapped6&&capy7Player){
      e.preventDefault();
      if(!capy7Running)capy7Running=true;
      var nx7=capy7Player.x+mapped6.x,ny7=capy7Player.y+mapped6.y;
      if(nx7>=0&&nx7<COLS&&ny7>=0&&ny7<C7_ROWS){capy7Player.x=nx7;capy7Player.y=ny7;}
    }
    return;
  }
  if(currentScreen==='sloth2'){
    if(e.key==='Escape'){clearInterval(tickInterval);returnToMainGame();return;}
    if(e.key==='='){saveGame();return;}if(e.key==='-'){saveMenuOpen=true;deleteMode2=false;clearInterval(tickInterval);showSaveMenu();return;}
    if(e.key==='.'){openPortalUseMenu();return;}
    var mapped9=KEY_MAP[e.key];if(mapped9){e.preventDefault();nextDir=mapped9;if(!sloth2Running)sloth2Running=true;sloth2MoveQueued=true;}return;
  }
  if(currentScreen==='capy6'){
    if(e.key==='Escape'){clearInterval(tickInterval);returnToMainGame();return;}
    if(e.key==='='){saveGame();return;}if(e.key==='-'){saveMenuOpen=true;deleteMode2=false;clearInterval(tickInterval);showSaveMenu();return;}
    if(capy6CutsceneActive){if(e.key==='x'||e.key==='X'){capy6CutsceneActive=false;startCapy6();}return;}
    if(e.key==='.'){openPortalUseMenu();return;}
    var mapped7=KEY_MAP[e.key];if(mapped7){e.preventDefault();nextDir=mapped7;if(!capy6Running)capy6Running=true;capy6MoveQueued=true;}return;
  }
  if(currentScreen==='capy8'){
    if(e.key==='Escape'){clearInterval(tickInterval);returnToMainGame();return;}
    if(e.key==='='){saveGame();return;}if(e.key==='-'){saveMenuOpen=true;deleteMode2=false;clearInterval(tickInterval);showSaveMenu();return;}
    if(capy8CutsceneActive){if(e.key==='x'||e.key==='X'){capy8CutsceneActive=false;startCapy8();}return;}
    if(e.key==='.'){openPortalUseMenu();return;}
    var mapped8=KEY_MAP[e.key];if(mapped8){e.preventDefault();nextDir=mapped8;if(!capy8Running)capy8Running=true;capy8MoveQueued=true;}return;
  }
  var mapped5=KEY_MAP[e.key];
  if(mapped5){e.preventDefault();if(mapped5.x!==-dir.x||mapped5.y!==-dir.y)nextDir=mapped5;if(!running&&!gameOver){running=true;msgEl.textContent='';}if(creativeMode)creativeMoveQueued=true;}
  if(e.key==='='&&!gameOver&&running)saveGame();
  if(e.key==='0'&&!gameOver&&running){if(happyBeaverCount>0){happyBeaverCount--;spawnHappyBeaver();msgEl.textContent='Happy Beaver deployed! ('+happyBeaverCount+' left)';setTimeout(function(){if(!gameOver)msgEl.textContent='';},1500);}else{msgEl.textContent='No happy beavers!';setTimeout(function(){if(!gameOver)msgEl.textContent='';},1000);}}
  if(e.key==='-'){saveMenuOpen=true;deleteMode2=false;clearInterval(tickInterval);showSaveMenu();}
  if(e.key==='Enter'&&!gameOver&&running){e.preventDefault();if(goldCount>0){goldCount--;score=goldCount;scoreEl.textContent=score;enterCapy2();}}
  if((e.key==='r'||e.key==='R')&&gameOver)init();
  if(creativeMode){if(e.key==='2'){clearInterval(tickInterval);enterCapy2();return;}if(e.key==='3'){clearInterval(tickInterval);enterCapy3();return;}if(e.key==='4'){clearInterval(tickInterval);enterCapy4();return;}if(e.key==='5'){clearInterval(tickInterval);enterCapy5();return;}if(e.key==='6'){clearInterval(tickInterval);enterCapy6();return;}if(e.key==='7'){clearInterval(tickInterval);enterCapy7();return;}if(e.key==='8'){clearInterval(tickInterval);enterCapy8();return;}}
  if(e.key==='Tab'){e.preventDefault();clearInterval(tickInterval);if(goldOrangeTimer)clearTimeout(goldOrangeTimer);if(beaverTimer)clearTimeout(beaverTimer);if(beaverLogInterval)clearInterval(beaverLogInterval);if(autoSaveInterval)clearInterval(autoSaveInterval);if(stormTimer)clearTimeout(stormTimer);cutsceneActive=false;deathChoicePending=false;slothShopOpen=false;questShopOpen=false;saveMenuOpen=false;menuActive=true;currentScreen='main';drawMenu();}
});

speedEl.addEventListener('change',function(){restartTimer();});

canvas.addEventListener('click',function(e){
  if(!saveMenuOpen&&!saveBrowseActive)return;
  var rect=canvas.getBoundingClientRect();
  var my=(e.clientY-rect.top)*(canvas.height/rect.height);
  var saves=getSavesList();
  for(var i=0;i<saves.length;i++){
    var sy=75+i*50;
    if(my>=sy-15&&my<=sy+15){
      if(saveMenuOpen){
        if(deleteMode2){var games=getAllGames();var gm=games.find(function(g){return g.id===currentGameId;});if(gm){gm.saves.splice(i,1);saveAllGames(games);}deleteMode2=false;showSaveMenu();}
        else{saveMenuOpen=false;loadGame(i);}
      }else if(saveBrowseActive){
        if(saveBrowseDelete){var gms2=getAllGames();var gm2=gms2.find(function(g){return g.id===currentGameId;});if(gm2){gm2.saves.splice(i,1);saveAllGames(gms2);}saveBrowseDelete=false;showSaveMenu();}
        else{saveBrowseActive=false;menuActive=false;loadGame(i);}
      }
      return;
    }
  }
});

function resumeCurrentScreen() {
  msgEl.textContent='';
  if(currentScreen==='capy2'){clearInterval(tickInterval);tickInterval=setInterval(stepCapy2,parseInt(speedEl.value));drawCapy2();}
  else if(currentScreen==='capy3'){clearInterval(tickInterval);tickInterval=setInterval(stepCapy3,parseInt(speedEl.value));drawCapy3();}
  else if(currentScreen==='capy4'){clearInterval(tickInterval);tickInterval=setInterval(stepCapy4,parseInt(speedEl.value));drawCapy4();}
  else if(currentScreen==='capy5'){clearInterval(tickInterval);tickInterval=setInterval(stepCapy5,parseInt(speedEl.value));drawCapy5();}
  else if(currentScreen==='capy7'){clearInterval(tickInterval);tickInterval=setInterval(stepCapy7,parseInt(speedEl.value));drawCapy7();}
  else if(currentScreen==='sloth2'){clearInterval(tickInterval);tickInterval=setInterval(stepSloth2,parseInt(speedEl.value));drawSloth2();}
  else if(currentScreen==='capy6'){clearInterval(tickInterval);tickInterval=setInterval(stepCapy6,parseInt(speedEl.value));drawCapy6Game();}
  else if(currentScreen==='capy8'){clearInterval(tickInterval);tickInterval=setInterval(stepCapy8,parseInt(speedEl.value));drawCapy8Game();}
  else{draw();restartTimer();}
}

function restartTimer(){clearInterval(tickInterval);tickInterval=setInterval(step,parseInt(speedEl.value));}
