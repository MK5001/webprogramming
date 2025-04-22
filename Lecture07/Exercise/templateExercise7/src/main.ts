// src/main.ts

import { GameManager, Card } from "modules/gamemanager";
import { StateManager, GameState } from "modules/statemanager";
import { UIManager } from "modules/ui-manager";

// Verschiedene Themen-Sets (Bonus: Themes)
const themeSymbols: Record<string, string[]> = {
  fruits: ["🍎", "🍌", "🍇", "🍓", "🍊", "🍉", "🍐", "🥝"],
  animals: ["🐶", "🐱", "🐼", "🐸", "🐧", "🐙", "🐠", "🐝"],
  numbers: ["1", "2", "3", "4", "5", "6", "7", "8"],
};

let stateManager: StateManager;
let gameManager: GameManager;
let uiManager: UIManager;
let numPairs: number = 4; // Standardwert
let selectedTheme: string = "fruits";

// Globale Funktionen, die im HTML aufgerufen werden (Start/Restart)
(window as any).startgame = () => {
  const input = document.getElementById("pair-count") as HTMLInputElement;
  const themeSelect = document.getElementById("theme") as HTMLSelectElement;

  numPairs = parseInt(input.value, 10);
  if (isNaN(numPairs) || numPairs < 1 || numPairs > 8) {
    alert("Bitte eine gültige Zahl zwischen 1 und 8 eingeben!");
    return;
  }

  selectedTheme = themeSelect.value;

  initGame(numPairs, selectedTheme);
};

(window as any).restartgame = () => {
  // Einfach Seite neu laden oder initGame nochmal aufrufen
  window.location.reload();
};

/**
 * Initialisiert das Spiel mit bestimmten Settings.
 */
function initGame(numPairs: number, theme: string) {
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
  (document.getElementById("startbutton") as HTMLElement).style.display = "none";

  // Karten rendern
  uiManager.renderCards(gameManager.cards, handleCardClick);

  // Scoreboard initialisieren
  uiManager.updateScoreboard(stateManager.players, stateManager.currentPlayerIndex);
}

/**
 * Klick-Event-Handler für Karten.
 */
function handleCardClick(index: number) {
  // Falls das Spiel beendet ist, nicht mehr reagieren
  if (stateManager.gameState !== GameState.InProgress) return;

  const cards = gameManager.cards;
  const card = cards[index];

  // Keine Aktion, wenn Karte schon geflippt oder gematcht
  if (card.isFlipped || card.isMatched) return;

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
    } else {
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
(window as any).showHint = () => {
  if (uiManager && gameManager) {
    uiManager.showHint(gameManager.cards);
  }
};
