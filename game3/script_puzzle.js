// KODE PALING FINAL - DENGAN LOGIKA GAME YANG DITULIS ULANG TOTAL UNTUK STABILITAS

// --- ELEMEN DOM ---
const loadingScreen = document.getElementById('loading-screen');
const progressBar = document.getElementById('progress-bar');
const loadingPercentage = document.getElementById('loading-percentage');
const gameContainer = document.querySelector('.game-container');
const canvas = document.getElementById('puzzle-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const movesElement = document.getElementById('moves');
const targetElement = document.getElementById('target');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const gameOverTitle = document.getElementById('gameOverTitle');
const restartButton = document.getElementById('restartButton');
const backgroundVideo = document.getElementById('background-video');

// --- MANAJEMEN ASET ---
const assetSources = [
    'erine_icon.png', 'erine_cheer.png',
    'item1.png', 'item2.png', 'item3.png',
    'item4.png', 'item5.png', 'item6.png',
    'item_bebek.png'
];
const assets = {};
const sounds = {};
let assetsLoaded = 0;
const totalAssets = assetSources.length + 1;

function loadAssets() {
    sounds.bebek = new Audio('suara_bebek.mp3');
    sounds.bebek.oncanplaythrough = () => { assetsLoaded++; updateLoadingProgress(); };
    sounds.bebek.onerror = () => { console.error('Gagal memuat suara_bebek.mp3'); assetsLoaded++; updateLoadingProgress(); };
    assetSources.forEach(src => {
        const img = new Image();
        img.src = src;
        const assetName = src.split('.')[0];
        assets[assetName] = img;
        img.onload = () => { assetsLoaded++; updateLoadingProgress(); };
        img.onerror = () => { console.error(`Gagal memuat aset: ${src}`); assetsLoaded++; updateLoadingProgress(); };
    });
}

function updateLoadingProgress() {
    const progress = (assetsLoaded / totalAssets) * 100;
    progressBar.style.width = `${progress}%`;
    loadingPercentage.textContent = `${Math.round(progress)}%`;
    if (assetsLoaded >= totalAssets) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            initializeGame();
        }, 500);
    }
}

// --- FUNGSI UTAMA GAME ---
function initializeGame() {
    const COLS = 8; const ROWS = 8;
    let TILE_SIZE = Math.floor((gameContainer.clientWidth * 0.9) / COLS);
    if (TILE_SIZE > 65) TILE_SIZE = 65;
    canvas.width = COLS * TILE_SIZE; canvas.height = ROWS * TILE_SIZE;
    let board = [];
    let score = 0, moves = 30, targetScore = 1000;
    let selectedTile = null, isAnimating = false, gameOver = false;

    scoreElement.textContent = score; movesElement.textContent = moves; targetElement.textContent = targetScore;
    const itemImages = [assets.item1, assets.item2, assets.item3, assets.item4, assets.item5, assets.item6];

    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    function initializeBoard() {
        for (let r = 0; r < ROWS; r++) {
            board[r] = [];
            for (let c = 0; c < COLS; c++) {
                do {
                    board[r][c] = { img: getRandomTile() };
                } while (isMatchAt(r, c));
            }
        }
    }

    function draw() {
        if (backgroundVideo.paused) { backgroundVideo.play(); }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const tile = board[r][c];
                if (tile && tile.img) {
                    if (tile.isDuck) {
                        ctx.shadowColor = '#ffee00';
                        ctx.shadowBlur = 15;
                    }
                    ctx.drawImage(tile.img, c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    ctx.shadowBlur = 0;
                }
            }
        }
        if (selectedTile) {
            ctx.strokeStyle = '#FFFF00'; ctx.lineWidth = 4;
            ctx.strokeRect(selectedTile.col * TILE_SIZE + 2, selectedTile.row * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        }
        if (!gameOver) requestAnimationFrame(draw);
    }

    function handleTileClick(event) {
        if (isAnimating || gameOver) return;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left; const y = event.clientY - rect.top;
        const col = Math.floor(x / TILE_SIZE); const row = Math.floor(y / TILE_SIZE);
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS || !board[row][col]) return;
        
        if (!selectedTile) {
            selectedTile = { row, col };
        } else {
            const dx = Math.abs(col - selectedTile.col);
            const dy = Math.abs(row - selectedTile.row);
            if (selectedTile.row === row && selectedTile.col === col) {
                selectedTile = null;
            } else if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                swapAndProcess(selectedTile.row, selectedTile.col, row, col);
                selectedTile = null;
            } else {
                selectedTile = { row, col };
            }
        }
    }
    
    async function swapAndProcess(r1, c1, r2, c2, isSwapBack = false) {
        isAnimating = true;
        
        let temp = board[r1][c1];
        board[r1][c1] = board[r2][c2];
        board[r2][c2] = temp;
        
        await delay(200);

        if (!isSwapBack) {
            const duckActivated = (board[r1][c1]?.isDuck) || (board[r2][c2]?.isDuck);
            const matches = findMatches();

            if (matches.length > 0 || duckActivated) {
                moves--;
                movesElement.textContent = moves;

                let duckPos = null;
                if(duckActivated) {
                    duckPos = (board[r1][c1]?.isDuck) ? {r:r1, c:c1} : {r:r2, c:c2};
                }

                await resolveBoard(matches, duckPos, {r1,c1,r2,c2});
            } else {
                await swapAndProcess(r1, c1, r2, c2, true);
            }
        }
        isAnimating = false;
        checkGameState();
    }

    async function resolveBoard(matches, duckPos, swapInfo) {
        let tilesToRemove = new Set();
        let createdDuck = false;

        if (duckPos) {
            sounds.bebek.currentTime = 0;
            sounds.bebek.play();
            score += 50; // Bonus skor bebek
            for (let r = duckPos.r - 1; r <= duckPos.r + 1; r++) {
                for (let c = duckPos.c - 1; c <= duckPos.c + 1; c++) {
                    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
                        tilesToRemove.add(`${r},${c}`);
                    }
                }
            }
        } else {
            const match4or5 = matches.find(group => group.length >= 4);
            if (match4or5) {
                createdDuck = true;
                const swapPositions = [`${swapInfo.r1},${swapInfo.c1}`, `${swapInfo.r2},${swapInfo.c2}`];
                let duckCreatePos = match4or5.find(p => swapPositions.includes(`${p.row},${p.col}`)) || match4or5[0];
                board[duckCreatePos.row][duckCreatePos.col] = { img: assets.item_bebek, isDuck: true };
                
                // Hapus item lain dari match-4/5 ini agar tidak dihitung skornya
                match4or5.forEach(p => {
                    if(p.row !== duckCreatePos.row || p.col !== duckCreatePos.col) {
                        tilesToRemove.add(`${p.row},${p.col}`);
                    }
                });
                
                // Hapus grup match-4/5 dari daftar match utama
                matches = matches.filter(group => group !== match4or5);
            }
            
            matches.forEach(group => {
                group.forEach(match => tilesToRemove.add(`${match.row},${match.col}`));
            });
        }
        
        tilesToRemove.forEach(coord => {
            const [r, c] = coord.split(',').map(Number);
            if (board[r][c] && !board[r][c].isDuck) {
                score += 10;
                board[r][c] = null;
            }
        });
        
        await cascade();
    }
    
    async function cascade() {
        scoreElement.textContent = score;
        await delay(200);
        shiftTilesDown();
        refillBoard();
        await delay(200);

        const newMatches = findMatches();
        if (newMatches.length > 0) {
            await resolveBoard(newMatches, null, null); // Proses kaskade
        }
    }
    
    function findMatches() {
        const allMatches = [];
        const checked = new Set();
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (checked.has(`${r},${c}`)) continue;
                const tile = board[r][c];
                if (tile && !tile.isDuck) {
                    const horizontalMatch = [{row:r, col:c}];
                    for (let i = c + 1; i < COLS; i++) {
                        if (board[r][i]?.img === tile.img) horizontalMatch.push({row:r, col:i}); else break;
                    }
                    if (horizontalMatch.length >= 3) {
                        allMatches.push(horizontalMatch);
                        horizontalMatch.forEach(p => checked.add(`${p.row},${p.col}`));
                    }
                    const verticalMatch = [{row:r, col:c}];
                    for (let i = r + 1; i < ROWS; i++) {
                        if (board[i][c]?.img === tile.img) verticalMatch.push({row:i, col:c}); else break;
                    }
                    if (verticalMatch.length >= 3) {
                        allMatches.push(verticalMatch);
                        verticalMatch.forEach(p => checked.add(`${p.row},${p.col}`));
                    }
                }
            }
        }
        return allMatches;
    }

    function isMatchAt(r, c) { const tile = board[r][c]; if(!tile) return false; if (c > 1 && board[r][c-1]?.img === tile.img && board[r][c-2]?.img === tile.img) return true; if (r > 1 && board[r-1][c]?.img === tile.img && board[r-2][c]?.img === tile.img) return true; return false; }
    function shiftTilesDown() { for (let c = 0; c < COLS; c++) { let emptyRow = -1; for (let r = ROWS - 1; r >= 0; r--) { if (!board[r][c] && emptyRow === -1) { emptyRow = r; } else if (board[r][c] && emptyRow !== -1) { board[emptyRow][c] = board[r][c]; board[r][c] = null; emptyRow--; } } } }
    function getRandomTile() { return itemImages[Math.floor(Math.random() * itemImages.length)]; }
    function refillBoard() { for (let c = 0; c < COLS; c++) { for (let r = 0; r < ROWS; r++) { if (!board[r][c]) { board[r][c] = { img: getRandomTile() }; } } } }
    function checkGameState() { if (gameOver) return; if (score >= targetScore) { gameOver = true; gameOverTitle.textContent = "Kamu Menang!"; gameOverTitle.style.color = "#28a745"; finalScoreElement.textContent = score; gameOverScreen.classList.remove('hidden'); } else if (moves <= 0) { gameOver = true; gameOverTitle.textContent = "Langkah Habis!"; gameOverTitle.style.color = "#e74c3c"; finalScoreElement.textContent = score; gameOverScreen.classList.remove('hidden'); } }
    
    canvas.addEventListener('mousedown', handleTileClick);
    restartButton.addEventListener('click', () => { gameOverScreen.classList.add('hidden'); initializeGame(); });
    initializeBoard();
    requestAnimationFrame(draw);
}

// --- MULAI PROSES PEMUATAN ---
loadAssets();