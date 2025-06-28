// KODE FINAL - HANYA ANGKA LOADING

// --- ELEMEN DOM ---
const loadingScreen = document.getElementById('loading-screen');
const quoteText = document.getElementById('quote-text');
const loadingPercentage = document.getElementById('loading-percentage');
const gameContainer = document.getElementById('game-container');
const canvas = document.getElementById('game-canvas');
// ... sisa elemen DOM tidak berubah ...
const ctx = canvas.getContext('2d');
const startMessage = document.getElementById('start-message');
const scoreDisplay = document.getElementById('score-display');
const highScoreDisplay = document.getElementById('high-score-display');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreElement = document.getElementById('final-score');
const newHighScoreMsg = document.getElementById('new-high-score-msg');
const leftControlButton = document.getElementById('left-control');
const rightControlButton = document.getElementById('right-control');
const menuButton = document.getElementById('menu-button');

// --- PENGATURAN CANVAS ---
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- KATA-KATA ERINE ---
const erineQuotes = [
    "Jangan menyerah ya, di depan ada panggung yang cerah menantimu!",
    "Lari sekuat tenaga! Tunjukkan semangatmu yang penuh warna!",
    "Setiap langkah berarti, teruslah maju jadi nomor satu!",
    "Kalau lelah, ingat lagi alasan kamu memulai. Semangat!",
    "Lihat aku! Aku akan jadi kupu-kupu yang terbang tinggi!"
];
let quoteInterval;

// --- MANAJEMEN ASET ---
const assetSources = [
    'erine_icon.png', 'erine_run.png', 'erine_jump.png', 'erine_duck.png',
    'obstacle_kabel.png', 'obstacle_drone.png', 'background1.png', 'background2.png'
];
const assets = {};

// --- FUNGSI LOADING BARU YANG LEBIH BAIK ---
function startLoading() {
    let assetsLoaded = 0;
    const totalAssets = assetSources.length;
    let minTimeElapsed = false;
    let allAssetsLoaded = false;

    quoteText.textContent = `"${erineQuotes[0]}"`;
    quoteInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * erineQuotes.length);
        quoteText.textContent = `"${erineQuotes[randomIndex]}"`;
    }, 4000);
    
    setTimeout(() => {
        minTimeElapsed = true;
        tryStartGame();
    }, 2000);

    if (totalAssets === 0) {
        allAssetsLoaded = true;
        tryStartGame();
        return;
    }

    const assetPromises = assetSources.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            assets[src.split('.')[0]] = img;
            img.onload = () => {
                assetsLoaded++;
                const progress = (assetsLoaded / totalAssets) * 100;
                loadingPercentage.textContent = `${Math.round(progress)}%`;
                if (assetsLoaded >= totalAssets) {
                    allAssetsLoaded = true;
                    tryStartGame();
                }
                resolve();
            };
            img.onerror = () => {
                console.error(`Gagal memuat aset: ${src}`);
                assetsLoaded++;
                if (assetsLoaded >= totalAssets) {
                    allAssetsLoaded = true;
                    tryStartGame();
                }
                reject(`Gagal memuat ${src}`);
            };
        });
    });

    function tryStartGame() {
        if (minTimeElapsed && allAssetsLoaded) {
            clearInterval(quoteInterval);
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                gameContainer.classList.remove('hidden');
                loadHighScore();
            }, 500);
        }
    }
}


// --- LOGIKA GAME ---
let player, obstacles, gameSpeed, score, highScore = 0, gameOver, isGameStarted = false, backgrounds, obstacleTimer;
const groundHeight = 50;

// ... sisa kode tidak perlu diubah sama sekali ...
// Cukup salin dan tempel semua fungsi yang tersisa dari kode sebelumnya ke sini
// Ini termasuk: initializeGame, loadHighScore, saveHighScore, tryStartGame, jump, duck, backToMenu,
// update, draw, dan loop, serta event listener di akhir.
function initializeGame() { player = { x: 100, width: 60, height: 90, dy: 0, gravity: 0.8, jumpPower: -18, isJumping: false, isDucking: false, duckTimer: 0 }; player.y = canvas.height - groundHeight - player.height; obstacles = []; gameSpeed = 5; score = 0; gameOver = false; isGameStarted = true; startMessage.classList.add('hidden'); gameOverScreen.classList.add('hidden'); obstacleTimer = 100; backgrounds = [ { img: assets.background1, x: 0, y: 0 }, { img: assets.background2, x: canvas.width, y: 0 }]; loadHighScore(); loop(); }
function loadHighScore() { highScore = parseInt(localStorage.getItem('erineRunHighScore')) || 0; highScoreDisplay.textContent = highScore; }
function saveHighScore() { const finalScore = score; if (finalScore > highScore) { highScore = finalScore; localStorage.setItem('erineRunHighScore', highScore); newHighScoreMsg.classList.remove('hidden'); } else { newHighScoreMsg.classList.add('hidden'); } }
function tryStartGame(e) { if (e && (e.target.id === 'menu-button' || e.target.parentElement.id === 'menu-button')) return; if (gameOver) { initializeGame(); return; } if (!isGameStarted) { initializeGame(); } }
function jump(e) { if(e) e.preventDefault(); tryStartGame(); if (!player.isJumping) { player.dy = player.jumpPower; player.isJumping = true; } }
function duck(e) { if(e) e.preventDefault(); tryStartGame(); player.isDucking = true; player.duckTimer = 30; }
function backToMenu(e) { e.stopPropagation(); window.location.href = '../index.html'; }
let scoreTimer = 0;
function update() {
    if (!isGameStarted || gameOver) return;
    gameSpeed += 0.001; scoreTimer++; if (scoreTimer % 5 === 0) { score++; }
    const bgSpeed = gameSpeed * 0.5;
    backgrounds.forEach(bg => { bg.x -= bgSpeed; if (bg.x <= -canvas.width) { bg.x += canvas.width * 2; } });
    player.dy += player.gravity; player.y += player.dy;
    if (player.y >= canvas.height - groundHeight - player.height) { player.y = canvas.height - groundHeight - player.height; player.isJumping = false; player.dy = 0; }
    if (player.isDucking) { player.duckTimer--; if (player.duckTimer <= 0) { player.isDucking = false; } }
    obstacles.forEach(obs => { obs.x -= gameSpeed; });
    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
    obstacleTimer--;
    if (obstacleTimer <= 0) { const lastObstacle = obstacles[obstacles.length - 1]; if (!lastObstacle || lastObstacle.x < canvas.width - (250 + (gameSpeed * 10))) { let type = (lastObstacle && lastObstacle.type === 'kabel') ? 'drone' : 'kabel'; obstacles.push({ x: canvas.width, y: type === 'kabel' ? canvas.height - groundHeight - 30 : canvas.height - groundHeight - 140, width: 50, height: type === 'kabel' ? 30 : 60, type: type }); obstacleTimer = 60 + Math.random() * 40 - (gameSpeed * 2); } }
    obstacles.forEach(obs => { const playerCurrentHeight = player.isDucking ? player.height / 2 : player.height; const playerCurrentY = player.isDucking ? player.y + (player.height / 2) : player.y; if (player.x < obs.x + obs.width && player.x + player.width > obs.x && playerCurrentY < obs.y + obs.height && playerCurrentY + playerCurrentHeight > obs.y) { gameOver = true; isGameStarted = false; finalScoreElement.textContent = score; saveHighScore(); gameOverScreen.classList.remove('hidden'); } });
    scoreDisplay.textContent = score;
}
function draw() {
    if (!isGameStarted && !gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    backgrounds.forEach(bg => { if (bg.img.complete) ctx.drawImage(bg.img, bg.x, bg.y, canvas.width, canvas.height); });
    ctx.fillStyle = '#556B2F'; ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
    if(isGameStarted && player) { let playerImg = assets.erine_run; if (player.isJumping) playerImg = assets.erine_jump; if (player.isDucking) playerImg = assets.erine_duck; let playerHeight = player.isDucking ? player.height / 1.5 : player.height; let playerY = player.isDucking ? player.y + (player.height - playerHeight) : player.y; if(playerImg && playerImg.complete) ctx.drawImage(playerImg, player.x, playerY, player.width, playerHeight); obstacles.forEach(obs => { const obsImg = obs.type === 'kabel' ? assets.obstacle_kabel : assets.obstacle_drone; if (obsImg && obsImg.complete) ctx.drawImage(obsImg, obs.x, obs.y, obs.width, obs.height); }); }
}
function loop() { if (gameOver) return; update(); draw(); requestAnimationFrame(loop); }
rightControlButton.addEventListener('click', jump); rightControlButton.addEventListener('touchstart', jump);
leftControlButton.addEventListener('click', duck); leftControlButton.addEventListener('touchstart', duck);
gameContainer.addEventListener('click', tryStartGame); gameContainer.addEventListener('touchstart', tryStartGame);
menuButton.addEventListener('click', backToMenu); menuButton.addEventListener('touchstart', backToMenu);

// --- MULAI PROSES PEMUATAN ---
document.addEventListener('DOMContentLoaded', startLoading);