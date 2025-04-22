// src/statemanager.ts

export enum GameState {
    NotStarted,
    InProgress,
    Completed,
  }
  
  export interface Player {
    name: string;
    score: number;
  }
  
  export class StateManager {
    public players: Player[] = [];
    public currentPlayerIndex: number = 0;
    public revealedCardIndices: number[] = [];
    public matchedCount: number = 0;
    public gameState: GameState = GameState.NotStarted;
  
    constructor() {
      // Hier könnte man Standardwerte setzen oder Spieler einlesen
    }
  
    /**
     * Fügt einen neuen Spieler hinzu (mit Startscore 0).
     */
    addPlayer(name: string) {
      this.players.push({ name, score: 0 });
    }
  
    get currentPlayer(): Player {
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
  