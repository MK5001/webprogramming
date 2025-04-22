export class UIManager {
    constructor() {
        this.gameBoard = document.getElementById("game-board");
        this.scoreboard = document.getElementById("scoreboard");
        this.playerTurnDisplay = document.getElementById("player-turn");
        this.playerScoresList = document.getElementById("player-scores");
        this.endGameSummary = document.getElementById("end-game-summary");
        this.finalScores = document.getElementById("final-scores");
    }
    /**
     * Erzeugt die Karten-HTML-Elemente dynamisch und hängt Klicklistener an.
     * @param cards Array von Card-Strukturen.
     * @param onCardClick Callback, der aufgerufen wird, wenn eine Karte geklickt wird.
     */
    renderCards(cards, onCardClick) {
        this.gameBoard.innerHTML = "";
        this.gameBoard.style.display = "flex";
        cards.forEach((card, index) => {
            const cardDiv = document.createElement("div");
            cardDiv.classList.add("card");
            cardDiv.addEventListener("click", () => {
                onCardClick(index);
            });
            this.gameBoard.appendChild(cardDiv);
        });
    }
    /**
     * Aktualisiert das Aussehen einer einzelnen Karte (flip/matched).
     */
    updateCard(cards, index) {
        const cardDiv = this.gameBoard.children[index];
        const cardData = cards[index];
        // Text der Karte setzen bzw. leeren
        cardDiv.textContent = cardData.isFlipped || cardData.isMatched ? cardData.symbol : "";
        // CSS-Klassen entfernen
        cardDiv.classList.remove("flipped", "matched");
        // Falls geflippt -> gelbe Hintergrundfarbe
        if (cardData.isFlipped && !cardData.isMatched) {
            cardDiv.classList.add("flipped");
        }
        // Falls gematcht -> grüne Hintergrundfarbe
        if (cardData.isMatched) {
            cardDiv.classList.add("matched");
        }
    }
    /**
     * Aktualisiert das Scoreboard und hebt den aktiven Spieler hervor.
     */
    updateScoreboard(players, currentPlayerIndex) {
        this.scoreboard.style.display = "block";
        this.playerTurnDisplay.innerHTML = `Aktueller Spieler: <span id="active-player">${players[currentPlayerIndex].name}</span>`;
        this.playerScoresList.innerHTML = "";
        players.forEach((player, idx) => {
            const li = document.createElement("li");
            let playerText = `${player.name}: ${player.score}`;
            if (idx === currentPlayerIndex) {
                // Markierung z.B. fett gedruckt
                playerText = `<strong>${playerText}</strong>`;
            }
            li.innerHTML = playerText;
            this.playerScoresList.appendChild(li);
        });
    }
    /**
     * Zeigt das End-Game-Summary und blendet das Spielbrett aus.
     */
    showEndGameSummary(players) {
        this.gameBoard.style.display = "none";
        this.endGameSummary.style.display = "block";
        // Finale Punktestände
        const results = players.map((p) => `${p.name}: ${p.score}`).join("<br>");
        this.finalScores.innerHTML = results;
    }
    /**
     * Einfaches Hint-System (alle nicht gematchten Karten kurz aufdecken).
     */
    showHint(cards) {
        // Alle unverdeckten Karten 1 Sekunde lang anzeigen
        const notMatchedIndices = [];
        for (let i = 0; i < cards.length; i++) {
            if (!cards[i].isMatched && !cards[i].isFlipped) {
                cards[i].isFlipped = true;
                notMatchedIndices.push(i);
                this.updateCard(cards, i);
            }
        }
        // Nach kurzer Zeit wieder zudecken
        setTimeout(() => {
            notMatchedIndices.forEach((idx) => {
                cards[idx].isFlipped = false;
                this.updateCard(cards, idx);
            });
        }, 1000);
    }
}
