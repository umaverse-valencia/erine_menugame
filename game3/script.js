document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen DOM ---
    const gameBoard = document.getElementById('game-board');
    const triesDisplay = document.getElementById('tries');
    const restartButton = document.getElementById('restart-button');
    const correctSound = document.getElementById('correct-sound');
    const flyingDuck = document.getElementById('flying-duck');
    const winScreen = document.getElementById('win-screen');
    const winTriesDisplay = document.getElementById('win-tries');
    const playAgainButton = document.getElementById('play-again-button');

    // --- Daftar Gambar Kartu ---
    const cardImagePaths = ['image1.png', 'image2.png', 'image3.png', 'image4.png', 'image5.png', 'image6.png'];
    
    let cards = [...cardImagePaths, ...cardImagePaths];
    let flippedCards = [];
    let matchedPairs = 0;
    let tries = 0;
    let canFlip = true;

    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    function createBoard() {
        gameBoard.innerHTML = '';
        shuffle(cards);
        matchedPairs = 0;
        tries = 0;
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
            
            resetFlippedCards();
            checkWin();
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                resetFlippedCards();
            }, 1000);
        }
    }
    
    function resetFlippedCards() {
        flippedCards = [];
        canFlip = true;
    }

    function checkWin() {
        if (matchedPairs === cardImagePaths.length) {
            setTimeout(() => {
                winTriesDisplay.textContent = tries;
                winScreen.classList.remove('hidden');
            }, 800);
        }
    }

    restartButton.addEventListener('click', createBoard);
    playAgainButton.addEventListener('click', () => {
        winScreen.classList.add('hidden');
        createBoard();
    });

    createBoard();
});
