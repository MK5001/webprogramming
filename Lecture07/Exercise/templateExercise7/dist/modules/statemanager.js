// src/statemanager.ts
export var GameState;
(function (GameState) {
    GameState[GameState["NotStarted"] = 0] = "NotStarted";
    GameState[GameState["InProgress"] = 1] = "InProgress";
    GameState[GameState["Completed"] = 2] = "Completed";
})(GameState || (GameState = {}));
export class StateManager {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.revealedCardIndices = [];
        this.matchedCount = 0;
        this.gameState = GameState.NotStarted;
        // Hier könnte man Standardwerte setzen oder Spieler einlesen
    }
    /**
     * Fügt einen neuen Spieler hinzu (mit Startscore 0).
     */
    addPlayer(name) {
        this.players.push({ name, score: 0 });
    }
    get currentPlayer() {
        return this.players[this.currentPlayerIndex];
    }
    /**
     * Wechselt zum nächsten Spieler (Rundlauf).
     */
    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }
    /**
     * Erhöht den Score des aktuellen Spielers um 1.
     */
    incrementScore() {
        this.players[this.currentPlayerIndex].score += 1;
    }
}
