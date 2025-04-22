export class Scoring {
    constructor() {
        this.score = 0;
    }
    calculateScore(difficulty) {
        const points = { easy: 1, medium: 2, hard: 3 };
        this.score += points[difficulty];
    }
    getScore() {
        return this.score;
    }
}
