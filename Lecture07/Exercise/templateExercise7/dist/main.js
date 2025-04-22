// src/main.ts
import { GameManager } from "modules/gamemanager";
import { StateManager, GameState } from "modules/statemanager";
import { UIManager } from "modules/ui-manager";
// Verschiedene Themen-Sets (Bonus: Themes)
const themeSymbols = {
    fruits: ["🍎", "🍌", "🍇", "🍓", "🍊", "🍉", "🍐", "🥝"],
    animals: ["🐶", "🐱", "🐼", "🐸", "🐧", "🐙", "🐠", "🐝"],
    numbers: ["1", "2", "3", "4", "5", "6", "7", "8"],
};
let stateManager;
let gameManager;
let uiManager;
let numPairs = 4; // Standardwert
let selectedTheme = "fruits";
// Globale Funktionen, die im HTML aufgerufen werden (Start/Restart)
window.startgame = () => {
    const input = document.getElementById("pair-count");
    const themeSelect = document.getElementById("theme");
    numPairs = parseInt(input.value, 10);
    if (isNaN(numPairs) || numPairs < 1 || numPairs > 8) {
        alert("Bitte eine gültige Zahl zwischen 1 und 8 eingeben!");
        return;
    }
    selectedTheme = themeSelect.value;
    initGame(numPairs, selectedTheme);
};
window.restartgame = () => {
    // Einfach Seite neu laden oder initGame nochmal aufrufen
    window.location.reload();
};
/**
 * Initialisiert das Spiel mit bestimmten Settings.
 */
function initGame(numPairs, theme) {
    // Initialisiere Manager
    stateManager = new StateManager();
    uiManager = new UIManager();
    // Beispielhaft: Zwei Spieler anlegen
    stateManager.addPlayer("Alice");
    stateManager.addPlayer("Bob");
    // GameManager mit passendem Symbol-Set
    const symbols = themeSymbols[theme] || themeSymbols.fruits;
    gameManager = new GameManager(symbols, numPairs);
    stateManager.gameState = GameState.InProgress;
    document.getElementById("startbutton").style.display = "none";
    // Karten rendern
    uiManager.renderCards(gameManager.cards, handleCardClick);
    // Scoreboard initialisieren
    uiManager.updateScoreboard(stateManager.players, stateManager.currentPlayerIndex);
}
/**
 * Klick-Event-Handler für Karten.
 */
function handleCardClick(index) {
    // Falls das Spiel beendet ist, nicht mehr reagieren
    if (stateManager.gameState !== GameState.InProgress)
        return;
    const cards = gameManager.cards;
    const card = cards[index];
    // Keine Aktion, wenn Karte schon geflippt oder gematcht
    if (card.isFlipped || card.isMatched)
        return;
    // Karte aufdecken
    card.isFlipped = true;
    uiManager.updateCard(cards, index);
    // Merken, dass eine Karte aufgedeckt wurde
    stateManager.revealedCardIndices.push(index);
    // Prüfen, ob gerade 2 Karten aufgedeckt sind
    if (stateManager.revealedCardIndices.length === 2) {
        const [firstIndex, secondIndex] = stateManager.revealedCardIndices;
        const firstCard = cards[firstIndex];
        const secondCard = cards[secondIndex];
        if (firstCard.symbol === secondCard.symbol) {
            // Match!
            firstCard.isMatched = true;
            secondCard.isMatched = true;
            stateManager.matchedCount += 2;
            stateManager.incrementScore();
            // Aktualisierte Karten rendern
            uiManager.updateCard(cards, firstIndex);
            uiManager.updateCard(cards, secondIndex);
        }
        else {
            // Kein Match -> nach kurzer Zeit beide wieder umdrehen
            setTimeout(() => {
                firstCard.isFlipped = false;
                secondCard.isFlipped = false;
                uiManager.updateCard(cards, firstIndex);
                uiManager.updateCard(cards, secondIndex);
            }, 1000);
            // Zum nächsten Spieler wechseln
            stateManager.nextPlayer();
        }
        // revealedCardIndices leeren
        stateManager.revealedCardIndices = [];
        // Scoreboard aktualisieren
        uiManager.updateScoreboard(stateManager.players, stateManager.currentPlayerIndex);
        // prüfen, ob alle Karten gematcht wurden
        if (stateManager.matchedCount === cards.length) {
            // Spielende
            stateManager.gameState = GameState.Completed;
            uiManager.showEndGameSummary(stateManager.players);
        }
    }
}
/**
 * Bonus-Funktion: zeigeHint().
 * Kann z.B. an einen Button gebunden werden, um kurz einen Tipp zu geben.
 */
window.showHint = () => {
    if (uiManager && gameManager) {
        uiManager.showHint(gameManager.cards);
    }
};
