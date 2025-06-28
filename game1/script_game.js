// Mengatur Canvas dan Konteks
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Mengatur ukuran canvas agar pas dengan ukuran layar perangkat
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Mengambil semua elemen dari HTML
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

// MEMUAT GAMBAR
const playerImg = new Image();
playerImg.src = 'erine.png';
const lightstickImg = new Image();
lightstickImg.src = 'lightstick.png';
const patahHatiImg = new Image();
patahHatiImg.src = 'patah_hati.png';

// Pengaturan Game
let score = 0;
let gameOver = false;
let gameStarted = false;

const player = {
    x: canvas.width / 2 - 35,
    y: canvas.height - 150,
    width: 150,
    height: 150,
    speed: 10,
    dx: 0
};

let lightsticks = [];
let patahHatis = [];

// --- Kumpulan Fungsi Game ---
function drawPlayer() {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function addNewItem(array, itemWidth, itemHeight) {
    array.push({
        x: Math.random() * (canvas.width - itemWidth),
        y: -itemHeight,
        width: itemWidth,
        height: itemHeight,
        speed: Math.random() * 3 + 2
    });
}

function createAndDrawItems(array, image) {
    array.forEach((item, index) => {
        item.y += item.speed;
        ctx.drawImage(image, item.x, item.y, item.width, item.height);
        if (item.y > canvas.height) {
            array.splice(index, 1);
        }
    });
}

function detectCollision(item) {
    return player.x < item.x + item.width && player.x + player.width > item.x && player.y < item.y + item.height && player.y + player.height > item.y;
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function showGameOverScreen() {
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

// --- Game Loop Utama ---
function update() {
    if (gameOver || !gameStarted) return;
    clear();

    // Update Posisi Player
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    drawPlayer();

    // Update & Gambar Item
    createAndDrawItems(lightsticks, lightstickImg);
    createAndDrawItems(patahHatis, patahHatiImg); // <-- INI SUDAH DIPERBAIKI

    // Cek Tabrakan
    lightsticks.forEach((item, index) => {
        if (detectCollision(item)) {
            score += 10;
            scoreElement.textContent = `Skor: ${score}`;
            lightsticks.splice(index, 1);
        }
    });
    patahHatis.forEach((item, index) => {
        if (detectCollision(item)) {
            gameOver = true;
            showGameOverScreen();
            clearInterval(lightstickInterval);
            clearInterval(patahHatiInterval);
        }
    });

    requestAnimationFrame(update);
}

// --- KONTROL & LOGIKA MEMULAI GAME ---
function handleMoveStart(e, direction) { e.preventDefault(); player.dx = direction === 'left' ? -player.speed : player.speed; }
function handleMoveEnd(e) { e.preventDefault(); player.dx = 0; }
leftBtn.addEventListener('touchstart', (e) => handleMoveStart(e, 'left'));
leftBtn.addEventListener('touchend', handleMoveEnd);
rightBtn.addEventListener('touchstart', (e) => handleMoveStart(e, 'right'));
rightBtn.addEventListener('touchend', handleMoveEnd);
restartButton.addEventListener('click', () => location.reload());

let lightstickInterval, patahHatiInterval;
let imagesLoaded = 0;
const totalImages = 3;
function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        startGame();
    }
}
playerImg.onload = onImageLoad;
lightstickImg.onload = onImageLoad;
patahHatiImg.onload = onImageLoad;

function startGame() {
    gameStarted = true;
    lightstickInterval = setInterval(() => addNewItem(lightsticks, 30, 60), 1000);
    patahHatiInterval = setInterval(() => addNewItem(patahHatis, 40, 40), 1500);
    update();
}

window.addEventListener('resize', () => location.reload());