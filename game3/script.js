document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen DOM ---
    const gameContainer = document.getElementById('game-container');
    const gameBoard = document.getElementById('game-board');
    const triesDisplay = document.getElementById('tries');
    const restartButton = document.getElementById('restart-button');
    const correctSound = document.getElementById('correct-sound');
    const flyingDuck = document.getElementById('flying-duck');
    const particleContainer = document.getElementById('particle-container');
    const currentHighscoreDisplay = document.getElementById('current-highscore');
    
    const levelScreen = document.getElementById('level-screen');
    const winScreen = document.getElementById('win-screen');
    const winTriesDisplay = document.getElementById('win-tries');
    const playAgainButton = document.getElementById('play-again-button');
    const levelButtons = document.querySelectorAll('.level-button');

    // --- Konfigurasi Level & Gambar ---
    const levels = {
        easy: { pairs: 6, cols: 4, name: 'easy' },
        medium: { pairs: 8, cols: 4, name: 'medium' },
        hard: { pairs: 10, cols: 5, name: 'hard' }
    };
    let currentLevelConfig;
    const allCardImages = ['image1.png', 'image2.png', 'image3.png', 'image4.png', 'image5.png', 'image6.png', 'image7.png', 'image8.png', 'image9.png', 'image10.png'];
    
    let cards = [], flippedCards = [], matchedPairs = 0, tries = 0, canFlip = true;

    // --- FUNGSI HIGH SCORE ---
    function getHighScores() {
        const scores = localStorage.getItem('erineMemoryHighScores');
        return scores ? JSON.parse(scores) : { easy: 999, medium: 999, hard: 999 };
    }

    function saveHighScores(scores) {
        localStorage.setItem('erineMemoryHighScores', JSON.stringify(scores));
    }
    
    // --- Logika Utama ---
    function startGame(level) {
        currentLevelConfig = levels[level];
        levelScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');

        const highScores = getHighScores();
        const bestScore = highScores[currentLevelConfig.name];
        currentHighscoreDisplay.textContent = bestScore === 999 ? 'N/A' : bestScore;
        
        createBoard();
    }

    function createBoard() {
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${currentLevelConfig.cols}, 1fr)`;
        const imagesForLevel = allCardImages.slice(0, currentLevelConfig.pairs);
        cards = [...imagesForLevel, ...imagesForLevel];
        cards.sort(() => Math.random() - 0.5);
        matchedPairs = 0; tries = 0; flippedCards = [];
        triesDisplay.textContent = '0';
        canFlip = true;
        
        cards.forEach(imageSrc => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = imageSrc;
            card.innerHTML = `<div class="card-face card-front"></div><div class="card-face card-back"><img src="${imageSrc}"></div>`;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (!canFlip || this.classList.contains('flipped') || this.classList.contains('matched')) return;
        this.classList.add('flipped');
        flippedCards.push(this);
        if (flippedCards.length === 2) {
            canFlip = false;
            tries++;
            triesDisplay.textContent = tries;
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.image === card2.dataset.image;
        isMatch ? handleCorrectMatch(card1, card2) : handleWrongMatch(card1, card2);
    }
    
    function handleCorrectMatch(card1, card2) {
        correctSound.currentTime = 0;
        correctSound.play();
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        const rect = card1.getBoundingClientRect();
        const centerX = rect.left + window.scrollX + (rect.width / 2);
        const centerY = rect.top + window.scrollY + (rect.height / 2);
        createParticles(centerX, centerY);
        triggerDuckAnimation(centerX, centerY);
        flippedCards = [];
        canFlip = true;
        checkWin();
    }

    function handleWrongMatch(card1, card2) {
        card1.classList.add('shake');
        card2.classList.add('shake');
        setTimeout(() => {
            card1.classList.remove('shake', 'flipped');
            card2.classList.remove('shake', 'flipped');
            flippedCards = [];
            canFlip = true;
        }, 1200);
    }
    
    function createParticles(x, y) {
        particleContainer.style.left = `${x}px`;
        particleContainer.style.top = `${y}px`;
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            const angle = Math.random() * 360, dist = Math.random() * 60 + 50;
            const x_e = Math.cos(angle * Math.PI / 180) * dist, y_e = Math.sin(angle * Math.PI / 180) * dist;
            p.animate([{ transform: 'translate(0, 0) scale(1)', opacity: 1 },{ transform: `translate(${x_e}px, ${y_e}px) scale(0)`, opacity: 0 }],
            { duration: 800 + Math.random() * 400, easing: 'ease-out' });
            particleContainer.appendChild(p);
            setTimeout(() => p.remove(), 1200);
        }
    }

    function triggerDuckAnimation(x, y) {
        flyingDuck.style.left = `${x - 50}px`;
        flyingDuck.style.top = `${y - 50}px`;
        flyingDuck.classList.remove('animate');
        void flyingDuck.offsetWidth;
        flyingDuck.classList.add('animate');
    }

    function checkWin() {
        if (matchedPairs === currentLevelConfig.pairs) {
            const highScores = getHighScores();
            const currentLevelName = currentLevelConfig.name;

            if (tries < highScores[currentLevelName]) {
                highScores[currentLevelName] = tries;
                saveHighScores(highScores);
                currentHighscoreDisplay.textContent = tries;
            }
            
            setTimeout(() => {
                winTriesDisplay.textContent = tries;
                winScreen.classList.remove('hidden');
            }, 800);
        }
    }

    // --- Event Listeners ---
    levelButtons.forEach(button => button.addEventListener('click', () => startGame(button.dataset.level)));
    restartButton.addEventListener('click', createBoard);
    playAgainButton.addEventListener('click', () => {
        winScreen.classList.add('hidden');
        createBoard();
    });
});
