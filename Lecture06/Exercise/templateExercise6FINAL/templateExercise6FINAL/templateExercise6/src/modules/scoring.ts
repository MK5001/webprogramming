export class Scoring {
    private score: number = 0;
  
    calculateScore(difficulty: "easy" | "medium" | "hard"): void {
      const points = { easy: 1, medium: 2, hard: 3 };
      this.score += points[difficulty];
    }
  
    getScore(): number {
      return this.score;
    }
  }