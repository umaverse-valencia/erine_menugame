document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen DOM ---
    const gameContainer = document.getElementById('game-container');
    const gameBoard = document.getElementById('game-board');
    const triesDisplay = document.getElementById('tries');
    const restartButton = document.getElementById('restart-button');
    const correctSound = document.getElementById('correct-sound');
    const flyingDuck = document.getElementById('flying-duck');
    
    // Elemen Layar
    const levelScreen = document.getElementById('level-screen');
    const winScreen = document.getElementById('win-screen');
    const winTriesDisplay = document.getElementById('win-tries');
    const playAgainButton = document.getElementById('play-again-button');
    const levelButtons = document.querySelectorAll('.level-button');

    // --- Konfigurasi Level ---
    const levels = {
        easy: { pairs: 6, cols: 4 },
        medium: { pairs: 8, cols: 4 },
        hard: { pairs: 10, cols: 5 }
    };
    let currentLevelConfig;

    // --- Daftar Semua Gambar Kartu ---
    const allCardImages = [
        'image1.png', 'image2.png', 'image3.png', 'image4.png', 'image5.png', 
        'image6.png', 'image7.png', 'image8.png', 'image9.png', 'image10.png'
    ];
    
    // --- Variabel Game ---
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let tries = 0;
    let canFlip = true;

    // --- Logika Utama ---
    function startGame(level) {
        currentLevelConfig = levels[level];
        levelScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        createBoard();
    }

    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    function createBoard() {
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${currentLevelConfig.cols}, 1fr)`;

        // Ambil gambar sesuai jumlah pasangan di level ini
        const imagesForLevel = allCardImages.slice(0, currentLevelConfig.pairs);
        cards = [...imagesForLevel, ...imagesForLevel];
        shuffle(cards);

        // Reset state
        matchedPairs = 0;
        tries = 0;
        flippedCards = [];
        triesDisplay.textContent = '0';
        canFlip = true;
        
        cards.forEach(imageSrc => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = imageSrc;
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.textContent = 'E';
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');
            const img = document.createElement('img');
            img.src = imageSrc;
            cardBack.appendChild(img);
            card.appendChild(cardFront);
            card.appendChild(cardBack);
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

        if (isMatch) {
            correctSound.currentTime = 0;
            correctSound.play();
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            
            const rect = card1.getBoundingClientRect();
            flyingDuck.style.left = `${rect.left + window.scrollX + (rect.width / 2) - 50}px`;
            flyingDuck.style.top = `${rect.top + window.scrollY + (rect.height / 2) - 50}px`;
            flyingDuck.classList.remove('animate');
            void flyingDuck.offsetWidth;
            flyingDuck.classList.add('animate');
            
            flippedCards = [];
            canFlip = true;
            checkWin();
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
            }, 1200);
        }
    }

    function checkWin() {
        if (matchedPairs === currentLevelConfig.pairs) {
            setTimeout(() => {
                winTriesDisplay.textContent = tries;
                winScreen.classList.remove('hidden');
            }, 800);
        }
    }

    // --- Event Listeners ---
    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            startGame(button.dataset.level);
        });
    });

    restartButton.addEventListener('click', createBoard);
    playAgainButton.addEventListener('click', () => {
        winScreen.classList.add('hidden');

        createBoard();
    });
});
