const backgroundMusic = document.getElementById('background-music');
const musicToggleButton = document.getElementById('music-toggle-button');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreBoard = document.getElementById('score-board');
const highScoreBoard = document.getElementById('high-score-board');
const loadingScreen = document.getElementById('loading-screen');
const gameOverPanel = document.getElementById('game-over-panel');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const jumpButton = document.getElementById('jump-button');
const duckButton = document.getElementById('duck-button');

// --- Pemuatan Aset Gambar ---
let assets = {};
let assetsLoaded = 0;
const assetFiles = [
    { name: 'background1', src: 'background1.png' },
    { name: 'background2', src: 'background2.png' },
    { name: 'run_sprite', src: 'erine_run_sprite.png' },
    { name: 'jump', src: 'erine_jump.png' },
    { name: 'duck', src: 'erine_duck.png' },
    { name: 'obstacle1', src: 'obstacle_1.png' },
    { name: 'obstacle2', src: 'obstacle_2.png' }
];

assetFiles.forEach(file => {
    assets[file.name] = new Image();
    assets[file.name].onload = () => {
        assetsLoaded++;
        if (assetsLoaded === assetFiles.length) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                Start();
            }, 500);
        }
    };
    assets[file.name].src = file.src;
});

// --- Variabel Game ---
let score, highScore, player, gravity, obstacles, gameSpeed, keys = {}, isGameOver;
let bg1X, bg2X; 
highScore = localStorage.getItem('erineRunHighScore') || 0;

// --- Kelas-kelas Game ---
class Player {
    constructor(x, y, w, h) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.dy = 0; this.jumpForce = 19;
        this.originalHeight = h;
        this.originalWidth = w;
        this.grounded = false;
        this.isDucking = false;

        this.spriteWidth = 293.5;
        this.spriteHeight = 425;
        this.totalFrames = 2;
        this.currentFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 10;
    }

    Animate() {
        if (keys['Space'] || keys['KeyW'] || keys['jump']) { this.Jump(); keys['jump'] = false; }
        
        // --- LOGIKA BARU UNTUK MENUNDUK ---
        let wasDucking = this.isDucking;
        this.isDucking = (keys['ShiftLeft'] || keys['KeyS'] || keys['duck']) && this.grounded;

        // Jika baru mulai menunduk
        if (this.isDucking && !wasDucking) {
            this.h = this.originalHeight / 1.5;
            this.w = this.originalWidth * 1.2; // Sedikit lebih lebar saat menunduk
            this.y += this.originalHeight - this.h; // Pindahkan posisi Y agar kaki tetap di tanah
        } 
        // Jika baru berhenti menunduk
        else if (!this.isDucking && wasDucking) {
            this.y -= this.originalHeight - this.h; // Kembalikan posisi Y
            this.h = this.originalHeight;
            this.w = this.originalWidth;
        }
        // --- AKHIR LOGIKA BARU ---

        this.dy += gravity;
        this.y += this.dy;
        if (this.y + this.h >= canvas.height) {
            this.y = canvas.height - this.h;
            this.dy = 0;
            this.grounded = true;
        }
        
        if (this.grounded && !this.isDucking) {
            this.animationTimer++;
            if (this.animationTimer % this.animationSpeed === 0) {
                this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
            }
        }
        
        this.Draw();
    }

    Jump() { if (this.grounded) { this.dy = -this.jumpForce; this.grounded = false; } }

    Draw() {
        let currentImage;
        if (this.isDucking) {
            currentImage = assets.duck;
            ctx.drawImage(currentImage, this.x, this.y, this.w, this.h);
        } else if (!this.grounded) {
            currentImage = assets.jump;
            ctx.drawImage(currentImage, this.x, this.y, this.w, this.h);
        } else {
            currentImage = assets.run_sprite;
            ctx.drawImage(
                currentImage, this.currentFrame * this.spriteWidth, 0,
                this.spriteWidth, this.spriteHeight,
                this.x, this.y, this.w, this.h
            );
        }
    }
}

// ... Sisa kode (class Obstacle, fungsi-fungsi lain) tidak berubah ...
class Obstacle {
    constructor(x, y, w, h, image) { this.x = x; this.y = y; this.w = w; this.h = h; this.image = image; this.dx = -gameSpeed; }
    Update() { this.x += this.dx; this.Draw(); this.dx = -gameSpeed; }
    Draw() { ctx.drawImage(this.image, this.x, this.y, this.w, this.h); }
}
function SpawnObstacle() {
    let width, height; let type = RandomIntInRange(0, 1); let image, yPos;
    if (type == 0) {
        image = assets.obstacle1; height = canvas.height * 0.08; width = height * 0.7; yPos = canvas.height - height;
    } else {
        image = assets.obstacle2; height = canvas.height * 0.14; width = height; yPos = canvas.height - height - (player.originalHeight * 0.9);
    }
    obstacles.push(new Obstacle(canvas.width, yPos, width, height, image));
}
function RandomIntInRange(min, max) { return Math.round(Math.random() * (max - min) + min); }
function Start() {
    isGameOver = false; canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight;
    gameSpeed = 7; gravity = 1; score = 0;
    const playerHeight = canvas.height * 0.16; const playerWidth = playerHeight * 0.8; 
    player = new Player(25, canvas.height - playerHeight, playerWidth, playerHeight);
    obstacles = [];
    highScoreBoard.textContent = `TERBAIK: ${highScore}`;
    gameOverPanel.classList.add('hidden');
    bg1X = 0; bg2X = canvas.width;
    requestAnimationFrame(Update);

    // Mulai musik saat game dimulai
    backgroundMusic.play();

    requestAnimationFrame(Update);
}
let initialSpawnTimer = 220; let spawnTimer = initialSpawnTimer;
function Update() {
    if (isGameOver) return;
    requestAnimationFrame(Update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bg1X -= gameSpeed / 2; bg2X -= gameSpeed / 2;
    if (bg1X <= -canvas.width) { bg1X = bg2X + canvas.width; }
    if (bg2X <= -canvas.width) { bg2X = bg1X + canvas.width; }
    ctx.drawImage(assets.background1, bg1X, 0, canvas.width, canvas.height);
    ctx.drawImage(assets.background2, bg2X, 0, canvas.width, canvas.height);
    spawnTimer--;
    if (spawnTimer <= 0) { SpawnObstacle(); spawnTimer = initialSpawnTimer - (gameSpeed * 8); if (spawnTimer < 50) spawnTimer = 50; }
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let o = obstacles[i];
        if (o.x + o.w < 0) { obstacles.splice(i, 1); }
        if (player.x < o.x + o.w && player.x + player.w > o.x && player.y < o.y + o.h && player.y + player.h > o.y) { GameOver(); }
        o.Update();
    }
    player.Animate();
    score++;
    scoreBoard.textContent = `SKOR: ${score}`;
    gameSpeed += 0.002;
}
function GameOver() {
    isGameOver = true;
    if (score > highScore) { highScore = score; localStorage.setItem('erineRunHighScore', highScore); }
    finalScore.textContent = score;
    highScoreBoard.textContent = `TERBAIK: ${highScore}`;
    gameOverPanel.classList.remove('hidden');
}
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);
jumpButton.addEventListener('pointerdown', () => keys['jump'] = true);
jumpButton.addEventListener('pointerup', () => keys['jump'] = false);
duckButton.addEventListener('pointerdown', () => keys['duck'] = true);
duckButton.addEventListener('pointerup', () => keys['duck'] = false);
restartButton.addEventListener('click', Start);
let isMusicPlaying = true;
musicToggleButton.addEventListener('click', () => {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        musicToggleButton.textContent = '🔇';
    } else {
        backgroundMusic.play();
        musicToggleButton.textContent = '🎵';
    }
    isMusicPlaying = !isMusicPlaying;
});
