"use strict";
var _a, _b, _c;
class MemoryGame {
    constructor(gameBoardId, startButtonId, completionMessageId) {
        this.gameBoardId = gameBoardId;
        this.startButtonId = startButtonId;
        this.completionMessageId = completionMessageId;
        this.flippedCards = [];
        this.cardSymbols = ['🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍒', '🍒'];
        this.matchedPairs = 0;
    }
    startGame() {
        toggleVisibility(this.startButtonId, false);
        toggleVisibility(this.gameBoardId, true);
        shuffle(this.cardSymbols);
        generateCards(this.cardSymbols, this.gameBoardId, card => this.flipCard(card));
    }
    restartGame() {
        const gameBoard = getElement(this.gameBoardId);
        gameBoard.innerHTML = '';
        this.matchedPairs = 0;
        shuffle(this.cardSymbols);
        generateCards(this.cardSymbols, this.gameBoardId, card => this.flipCard(card));
        toggleVisibility(this.completionMessageId, false);
    }
    flipCard(card) {
        if (this.flippedCards.length < 2 && !card.element.classList.contains('flipped')) {
            card.element.textContent = card.symbol;
            card.element.classList.add('flipped');
            this.flippedCards.push(card);
            if (this.flippedCards.length === 2) {
                setTimeout(() => checkMatch(this.flippedCards, this.cardSymbols.length, this.completionMessageId, () => {
                    this.matchedPairs++;
                }), 500);
            }
        }
    }
}
function generateCards(cardSymbols, gameBoardId, flipCardCallback) {
    const gameBoard = getElement(gameBoardId);
    cardSymbols.forEach(symbol => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.textContent = '?';
        cardElement.onclick = () => flipCardCallback({ symbol, element: cardElement });
        gameBoard.appendChild(cardElement);
    });
}
function checkMatch(flippedCards, totalPairs, completionMessageId, onMatch) {
    const [card1, card2] = flippedCards;
    if (card1.symbol === card2.symbol) {
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        onMatch();
        if (flippedCards.length / 2 === totalPairs) {
            toggleVisibility(completionMessageId, true);
        }
    }
    else {
        card1.element.textContent = '?';
        card2.element.textContent = '?';
        card1.element.classList.remove('flipped');
        card2.element.classList.remove('flipped');
    }
    flippedCards.length = 0; // Clear the flipped cards array
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function toggleVisibility(elementId, visible) {
    const element = getElement(elementId);
    element.style.display = visible ? 'block' : 'none';
}
function getElement(id) {
    const element = document.getElementById(id);
    if (!element)
        throw new Error(`Element with ID "${id}" not found.`);
    return element;
}
const game = new MemoryGame('game-board', 'startbutton', 'completion-message');
(_a = document.getElementById('startbutton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => game.startGame());
(_c = (_b = document.getElementById('completion-message')) === null || _b === void 0 ? void 0 : _b.querySelector('button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => game.restartGame());
