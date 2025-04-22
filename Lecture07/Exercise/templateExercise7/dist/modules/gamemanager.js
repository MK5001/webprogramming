// src/gamemanager.ts
export class GameManager {
    constructor(symbols, numPairs) {
        this._cards = [];
        // Erzeuge 2 * numPairs Karten
        const limitedSymbols = symbols.slice(0, numPairs);
        this._cards = this.generateShuffledCards(limitedSymbols);
    }
    /**
     * Erstellt und mischt alle Karten (Doppelungen).
     */
    generateShuffledCards(symbols) {
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
    shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }
    get cards() {
        return this._cards;
    }
}
