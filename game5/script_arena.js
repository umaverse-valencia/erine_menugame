// KODE FINAL - DENGAN ANIMASI KARAKTER SQUASH & STRETCH

// --- PENGATURAN DASAR & ELEMEN HTML ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const finalScoreElement = document.getElementById('final-score');
const menuButton = document.getElementById('menu-button');
const startHighScoreSpan = document.getElementById('start-high-score');
const gameOverHighScoreSpan = document.getElementById('game-over-high-score');
const newHighScoreMsg = document.getElementById('new-high-score-msg');

// --- PENGATURAN CANVAS ---
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- ASET GAMBAR & SUARA ---
const assets = {
    player_front: new Image(), player_side: new Image(), player_back: new Image(), arenaFloor: new Image(),
    joystickBase: new Image(), joystickKnob: new Image(), lightstick: new Image(), wota: new Image(),
    powerup_spotlight: new Image(), powerup_shield: new Image(), powerup_slowmo: new Image()
};
assets.player_front.src = 'erine_front.png'; assets.player_side.src = 'erine_side.png'; assets.player_back.src = 'erine_back.png';
assets.arenaFloor.src = 'arena_floor.png'; assets.joystickBase.src = 'joystick_base.png'; assets.joystickKnob.src = 'joystick_knob.png';
assets.lightstick.src = 'lightstick.png'; assets.wota.src = 'wota.png';
assets.powerup_spotlight.src = 'powerup_spotlight.png'; assets.powerup_shield.src = 'powerup_shield.png'; assets.powerup_slowmo.src = 'powerup_slowmo.png';
const jikoSound = new Audio('jiko_erine.mp3');
const backgroundMusic = new Audio('background_music.mp3');
backgroundMusic.loop = true;

// --- AREA PERMAINAN DAN SPAWN ---
const stageArea = { x: canvas.width * 0.18, y: canvas.height * 0.15, width: canvas.width * 0.64, height: canvas.height * 0.7 };
const seatingArea = { left: { x: 0, y: canvas.height * 0.2, width: canvas.width * 0.15, height: canvas.height * 0.6 }, right: { x: canvas.width * 0.85, y: canvas.height * 0.2, width: canvas.width * 0.15, height: canvas.height * 0.6 } };

// --- VARIABEL GLOBAL GAME ---
let player, joystick, spotlight, semangat, score, lightsticks, wotas, powerups, isGameOver, animationFrameId, timers, highScore;

// --- FUNGSI UTAMA ---
function initGame() {
    player = {
        x: canvas.width / 2 - 25, y: canvas.height / 2 - 35, width: 50, height: 71, speed: 3.5, direction: 'down',
        isInvincible: false, invincibleTimer: 0, isShielded: false, shieldTimer: 0, isSlowMo: false, slowMoTimer: 0,
        hitbox: { x_offset: 8, y_offset: 8, width: 34, height: 55 },
        scaleX: 1, scaleY: 1, isAnimating: false, animationTimer: 0
    };
    joystick = { isPressed: false, angle: 0, baseX: canvas.width / 2, baseY: canvas.height - 120, baseRadius: 70, knobX: canvas.width / 2, knobY: canvas.height - 120, knobRadius: 40 };
    spotlight = { x: canvas.width / 2, y: canvas.height / 2, radius: 120 };
    semangat = { max: 100, current: 100, depletionRate: 0.15, regenRate: 0.2 };
    score = 0; lightsticks = []; wotas = []; powerups = []; isGameOver = false;
    timers = { spotlight: 5000, wota: 4000, lightstick: 3000, powerup: 12000 };
    if (animationFrameId) { cancelAnimationFrame(animationFrameId); }
    moveSpotlight(); animate();
}

function startGame() { jikoSound.play(); jikoSound.addEventListener('ended', () => backgroundMusic.play(), { once: true }); showScreen('game'); initGame(); }
function restartGame() { backgroundMusic.currentTime = 0; backgroundMusic.play(); showScreen('game'); initGame(); }
function stopAllSounds() { jikoSound.pause(); jikoSound.currentTime = 0; backgroundMusic.pause(); backgroundMusic.currentTime = 0; }
function backToMenu() { stopAllSounds(); window.location.href = '../index.html'; }
function showScreen(screenName) { startScreen.classList.add('hidden'); gameScreen.classList.add('hidden'); gameOverScreen.classList.add('hidden'); if (screenName === 'start') { loadHighScore(); startScreen.classList.remove('hidden'); } else if (screenName === 'game') { gameScreen.classList.remove('hidden'); } else if (screenName === 'gameover') { stopAllSounds(); finalScoreElement.textContent = score; checkAndSaveHighScore(); gameOverScreen.classList.remove('hidden'); } }
function loadHighScore() { highScore = localStorage.getItem('erineArenaHighScore') || 0; startHighScoreSpan.textContent = highScore; }
function checkAndSaveHighScore() { if (score > highScore) { highScore = score; localStorage.setItem('erineArenaHighScore', highScore); newHighScoreMsg.classList.remove('hidden'); } else { newHighScoreMsg.classList.add('hidden'); } gameOverHighScoreSpan.textContent = highScore; }
function moveSpotlight() { const x = stageArea.x + Math.random() * stageArea.width; const y = stageArea.y + Math.random() * stageArea.height; spotlight.x = Math.max(stageArea.x + spotlight.radius, Math.min(x, stageArea.x + stageArea.width - spotlight.radius)); spotlight.y = Math.max(stageArea.y + spotlight.radius, Math.min(y, stageArea.y + stageArea.height - spotlight.radius)); }
function spawnLightstick() { if (isGameOver) return; const lightstickWidth = 25; const lightstickHeight = 50; const x = stageArea.x + Math.random() * (stageArea.width - lightstickWidth); const y = stageArea.y + Math.random() * (stageArea.height - lightstickHeight); lightsticks.push({ x, y, width: lightstickWidth, height: lightstickHeight }); }
function spawnWota() { if (isGameOver) return; const area = Math.random() < 0.5 ? seatingArea.left : seatingArea.right; const x = area.x + Math.random() * area.width; const y = area.y + Math.random() * area.height; const angle = Math.atan2(player.y - y, player.x - x); wotas.push({ x, y, width: 50, height: 50, speed: 1.5, angle }); }
function spawnPowerUp() { if (isGameOver) return; const types = ['spotlight', 'spotlight', 'shield', 'slowmo']; const type = types[Math.floor(Math.random() * types.length)]; const size = 50; const x = stageArea.x + Math.random() * (stageArea.width - size); const y = stageArea.y + Math.random() * (stageArea.height - size); powerups.push({ x, y, width: size, height: size, type: type }); }
function triggerPlayerAnimation() { if (!player.isAnimating) { player.isAnimating = true; player.animationTimer = 0; } }

let lastTime = 0;
function update(timestamp = 0) {
    if (isGameOver) return;
    const deltaTime = timestamp - lastTime; lastTime = timestamp;
    if (!deltaTime) return;

    if (player.isAnimating) {
        player.animationTimer += deltaTime;
        const animationDuration = 300;
        const progress = player.animationTimer / animationDuration;
        if (progress < 0.3) {
            player.scaleX = 1 + 0.2 * Math.sin(progress / 0.3 * Math.PI);
            player.scaleY = 1 - 0.2 * Math.sin(progress / 0.3 * Math.PI);
        } else if (progress < 1) {
            const stretchProgress = (progress - 0.3) / 0.7;
            player.scaleX = 1 - 0.1 * Math.sin(stretchProgress * Math.PI);
            player.scaleY = 1 + 0.1 * Math.sin(stretchProgress * Math.PI);
        } else {
            player.isAnimating = false;
            player.scaleX = 1;
            player.scaleY = 1;
        }
    } else {
        player.scaleX = 1; player.scaleY = 1;
    }

    const slowMoFactor = player.isSlowMo ? 0.5 : 1;
    timers.spotlight -= deltaTime * slowMoFactor; timers.wota -= deltaTime * slowMoFactor; timers.lightstick -= deltaTime; timers.powerup -= deltaTime;
    const currentSpotlightInterval = Math.max(1800, 5000 - (score * 8));
    const baseSpotlightRadius = Math.max(50, 120 - (score / 8));
    spotlight.radius = baseSpotlightRadius;
    if (timers.spotlight <= 0) { moveSpotlight(); timers.spotlight = currentSpotlightInterval; }
    if (timers.wota <= 0) { spawnWota(); timers.wota = 4000; }
    if (timers.lightstick <= 0) { spawnLightstick(); timers.lightstick = 3000; }
    if (timers.powerup <= 0) { spawnPowerUp(); timers.powerup = 12000 + Math.random() * 5000; }
    if (player.isShielded) { player.shieldTimer -= deltaTime; if (player.shieldTimer <= 0) player.isShielded = false; }
    if (player.isSlowMo) { player.slowMoTimer -= deltaTime; if (player.slowMoTimer <= 0) player.isSlowMo = false; }
    if (player.isInvincible) { player.invincibleTimer--; if (player.invincibleTimer <= 0) player.isInvincible = false; }
    if (joystick.isPressed) { player.x += Math.cos(joystick.angle) * player.speed; player.y += Math.sin(joystick.angle) * player.speed; const angleDeg = joystick.angle * 180 / Math.PI; if (angleDeg > -45 && angleDeg <= 45) { player.direction = 'right'; } else if (angleDeg > 45 && angleDeg <= 135) { player.direction = 'down'; } else if (angleDeg > -135 && angleDeg <= -45) { player.direction = 'up'; } else { player.direction = 'left'; } }
    if (player.x < stageArea.x) player.x = stageArea.x; if (player.y < stageArea.y) player.y = stageArea.y; if (player.x + player.width > stageArea.x + stageArea.width) player.x = stageArea.x + stageArea.width - player.width; if (player.y + player.height > stageArea.y + stageArea.height) player.y = stageArea.y + stageArea.height - player.height;
    for (let i = powerups.length - 1; i >= 0; i--) { const p = powerups[i]; if (player.x < p.x + p.width && player.x + player.width > p.x && player.y < p.y + p.height && player.y + player.height > p.y) { switch (p.type) { case 'spotlight': spotlight.radius += 40; if (spotlight.radius > 200) spotlight.radius = 200; break; case 'shield': player.isShielded = true; player.shieldTimer = 5000; break; case 'slowmo': player.isSlowMo = true; player.slowMoTimer = 6000; break; } powerups.splice(i, 1); } }
    for (let i = wotas.length - 1; i >= 0; i--) { const w = wotas[i]; const currentWotaSpeed = w.speed * slowMoFactor; w.x += Math.cos(w.angle) * currentWotaSpeed; w.y += Math.sin(w.angle) * currentWotaSpeed; const playerHitboxX = player.x + player.hitbox.x_offset; const playerHitboxY = player.y + player.hitbox.y_offset; if (!player.isInvincible && !player.isShielded && playerHitboxX < w.x + w.width && playerHitboxX + player.hitbox.width > w.x && playerHitboxY < w.y + w.height && playerHitboxY + player.hitbox.height > w.y) { wotas.splice(i, 1); semangat.current -= 15; player.isInvincible = true; player.invincibleTimer = 90; } if (w.x < -100 || w.x > canvas.width + 100 || w.y < -100 || w.y > canvas.height + 100) { wotas.splice(i, 1); } }
    const playerCenterX = player.x + player.width / 2; const playerCenterY = player.y + player.height / 2; const distToSpotlight = Math.hypot(playerCenterX - spotlight.x, playerCenterY - spotlight.y); spotlight.isPlayerInside = distToSpotlight < spotlight.radius; if (spotlight.isPlayerInside) { semangat.current = Math.min(semangat.max, semangat.current + semangat.regenRate); } else { semangat.current -= semangat.depletionRate; } for (let i = lightsticks.length - 1; i >= 0; i--) { const l = lightsticks[i]; if (player.x < l.x + l.width && player.x + player.width > l.x && player.y < l.y + l.height && player.y + player.height > l.y) { lightsticks.splice(i, 1); score += 10; } } if (semangat.current <= 0) { isGameOver = true; showScreen('gameover'); }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(assets.arenaFloor, 0, 0, canvas.width, canvas.height);
    lightsticks.forEach(l => { ctx.drawImage(assets.lightstick, l.x, l.y, l.width, l.height); });
    wotas.forEach(w => { ctx.drawImage(assets.wota, w.x, w.y, w.width, w.height); });
    powerups.forEach(p => { let img; switch (p.type) { case 'spotlight': img = assets.powerup_spotlight; break; case 'shield': img = assets.powerup_shield; break; case 'slowmo': img = assets.powerup_slowmo; break; } ctx.drawImage(img, p.x, p.y, p.width, p.height); });
    ctx.beginPath(); const gradient = ctx.createRadialGradient(spotlight.x, spotlight.y, 0, spotlight.x, spotlight.y, spotlight.radius); const color = spotlight.isPlayerInside ? 'rgba(255, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)'; gradient.addColorStop(0, color); gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); ctx.fillStyle = gradient; ctx.arc(spotlight.x, spotlight.y, spotlight.radius, 0, Math.PI * 2); ctx.fill();
    if (player.isShielded) { ctx.beginPath(); ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 1.5, 0, Math.PI * 2); ctx.fillStyle = `rgba(137, 207, 240, ${0.3 + (Math.sin(Date.now() / 100) * 0.1)})`; ctx.fill(); }
    if (player.isSlowMo) { ctx.fillStyle = "rgba(100, 150, 255, 0.15)"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    ctx.save();
    const newWidth = player.width * player.scaleX; const newHeight = player.height * player.scaleY;
    const newX = player.x - (newWidth - player.width) / 2; const newY = player.y - (newHeight - player.height) / 2;
    let currentSprite; if (player.direction === 'left') { currentSprite = assets.player_side; ctx.translate(newX + newWidth, newY); ctx.scale(-1, 1); ctx.globalAlpha = player.isInvincible && Math.floor(player.invincibleTimer / 5) % 2 === 0 ? 0.5 : 1; ctx.drawImage(currentSprite, 0, 0, newWidth, newHeight); } else { if (player.direction === 'right') { currentSprite = assets.player_side; } else if (player.direction === 'up') { currentSprite = assets.player_back; } else { currentSprite = assets.player_front; } ctx.globalAlpha = player.isInvincible && Math.floor(player.invincibleTimer / 5) % 2 === 0 ? 0.5 : 1; ctx.drawImage(currentSprite, newX, newY, newWidth, newHeight); }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalAlpha = 0.7; ctx.drawImage(assets.joystickBase, joystick.baseX - joystick.baseRadius, joystick.baseY - joystick.baseRadius, joystick.baseRadius * 2, joystick.baseRadius * 2); ctx.drawImage(assets.joystickKnob, joystick.knobX - joystick.knobRadius, joystick.knobY - joystick.knobRadius, joystick.knobRadius * 2, joystick.knobRadius * 2); ctx.globalAlpha = 1.0;
    drawUI();
}

function drawUI() { const semangatX = 15; const semangatY = 15; const panelHeight = 40; ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; roundRect(semangatX, semangatY, 250, panelHeight, 15, true, false); ctx.fillStyle = '#ff6b6b'; drawHeart(semangatX + 25, semangatY + panelHeight / 2, 12, 12); ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; roundRect(semangatX + 45, semangatY + 10, 190, 20, 8, true, false); const semangatWidth = (semangat.current / semangat.max) * 190; if (semangatWidth > 0) { const semangatGradient = ctx.createLinearGradient(0, 0, semangatWidth, 0); if (semangat.current > 30) { semangatGradient.addColorStop(0, '#56ab2f'); semangatGradient.addColorStop(1, '#a8e063'); } else { semangatGradient.addColorStop(0, '#ff8008'); semangatGradient.addColorStop(1, '#ffc837'); } ctx.fillStyle = semangatGradient; roundRect(semangatX + 45, semangatY + 10, semangatWidth, 20, 8, true, false); } const scoreText = score.toString(); const scoreX = canvas.width - 25; const scoreY = 35; ctx.font = '30px Poppins'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'white'; ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'; ctx.shadowBlur = 6; ctx.fillText(scoreText, scoreX, scoreY); const textWidth = ctx.measureText(scoreText).width; ctx.drawImage(assets.lightstick, scoreX - textWidth - 35, scoreY - 15, 25, 50); ctx.shadowBlur = 0; }
function roundRect(x, y, width, height, radius, fill, stroke) { if (typeof stroke === 'undefined') { stroke = true; } if (typeof radius === 'undefined') { radius = 5; } ctx.beginPath(); ctx.moveTo(x + radius, y); ctx.lineTo(x + width - radius, y); ctx.quadraticCurveTo(x + width, y, x + width, y + radius); ctx.lineTo(x + width, y + height - radius); ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height); ctx.lineTo(x + radius, y + height); ctx.quadraticCurveTo(x, y + height, x, y + height - radius); ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, x + radius, y); ctx.closePath(); if (fill) { ctx.fill(); } if (stroke) { ctx.stroke(); } }
function drawHeart(x, y, width, height) { ctx.beginPath(); const topCurveHeight = height * 0.3; ctx.moveTo(x, y + topCurveHeight); ctx.bezierCurveTo(x, y, x - width / 2, y, x - width / 2, y + topCurveHeight); ctx.bezierCurveTo(x - width / 2, y + (height + topCurveHeight) / 2, x, y + (height + topCurveHeight) / 2, x, y + height); ctx.bezierCurveTo(x, y + (height + topCurveHeight) / 2, x + width / 2, y + (height + topCurveHeight) / 2, x + width / 2, y + topCurveHeight); ctx.bezierCurveTo(x + width / 2, y, x, y, x, y + topCurveHeight); ctx.closePath(); ctx.fill(); }
function animate(timestamp) { if (isGameOver) { cancelAnimationFrame(animationFrameId); return; } update(timestamp); draw(); animationFrameId = requestAnimationFrame(animate); }
function handleTouchStart(e) { e.preventDefault(); if (joystick) joystick.isPressed = true; handleTouchMove(e); }
function handleTouchMove(e) { e.preventDefault(); if (!joystick || !joystick.isPressed) return; const touch = e.touches ? e.touches[0] : e; const dx = touch.clientX - joystick.baseX; const dy = touch.clientY - joystick.baseY; joystick.angle = Math.atan2(dy, dx); const distance = Math.min(joystick.baseRadius - joystick.knobRadius, Math.hypot(dx, dy)); joystick.knobX = joystick.baseX + Math.cos(joystick.angle) * distance; joystick.knobY = joystick.baseY + Math.sin(joystick.angle) * distance; }
function handleTouchEnd(e) { e.preventDefault(); if (joystick.isPressed) { triggerPlayerAnimation(); } if (joystick) { joystick.isPressed = false; joystick.knobX = joystick.baseX; joystick.knobY = joystick.baseY; } }
canvas.addEventListener('mousedown', handleTouchStart, { passive: false }); canvas.addEventListener('touchstart', handleTouchStart, { passive: false }); canvas.addEventListener('mousemove', handleTouchMove, { passive: false }); canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
window.addEventListener('mouseup', () => {
  if (!joystick) return; // jika joystick belum diatur, hentikan

  if (joystick.isPressed) {
    triggerPlayerAnimation();
  }
  joystick.isPressed = false;
  joystick.knobX = joystick.baseX;
  joystick.knobY = joystick.baseY;
});
window.addEventListener('touchend', handleTouchEnd);
window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; if (gameScreen && !gameScreen.classList.contains('hidden')) { initGame(); } });
startButton.addEventListener('click', startGame); startButton.addEventListener('touchstart', startGame); restartButton.addEventListener('click', restartGame); restartButton.addEventListener('touchstart', restartGame); menuButton.addEventListener('click', backToMenu); menuButton.addEventListener('touchstart', backToMenu);

showScreen('start');
