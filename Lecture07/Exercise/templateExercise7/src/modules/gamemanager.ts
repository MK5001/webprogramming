// src/gamemanager.ts

export interface Card {
    id: number;
    symbol: string;
    isFlipped: boolean;
    isMatched: boolean;
  }
  
  export class GameManager {
    private readonly _cards: Card[] = [];
  
    constructor(symbols: string[], numPairs: number) {
      // Erzeuge 2 * numPairs Karten
      const limitedSymbols = symbols.slice(0, numPairs); 
      this._cards = this.generateShuffledCards(limitedSymbols);
    }
  
    /**
     * Erstellt und mischt alle Karten (Doppelungen).
     */
    private generateShuffledCards(symbols: string[]): Card[] {
      // Doppelung für Pärchen
      const deck = symbols.flatMap((symbol) => [
        {
          id: Math.random(),
          symbol,
          isFlipped: false,
          isMatched: false,
        },
        {
          id: Math.random(),
          symbol,
          isFlipped: false,
          isMatched: false,
        },
      ]);
  
      // Mischen
      return this.shuffle(deck);
    }
  
    /**
     * Hilfsfunktion zum Mischen eines Arrays (Generics-Demo).
     */
    private shuffle<T>(array: T[]): T[] {
      return array.sort(() => Math.random() - 0.5);
    }
  
    get cards(): Card[] {
      return this._cards;
    }
  }
  