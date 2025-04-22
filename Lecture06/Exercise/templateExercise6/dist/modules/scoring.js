// Calculate points based on difficulty
function calculatePoints(difficulty) {
    console.debug('calculatePoints called with difficulty:', difficulty);
    switch (difficulty) {
        case 'easy':
            return 1;
        case 'medium':
            return 2;
        case 'hard':
            return 3;
        default:
            return 0;
    }
}
// Calculate the player's total score
export function calculateScore(answers) {
    console.debug('calculateScore called with answers:', answers);
    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    const totalQuestions = answers.length;
    const totalPoints = answers.reduce((sum, answer) => {
        if (answer.isCorrect) {
            return sum + calculatePoints(answer.questionDifficulty);
        }
        return sum;
    }, 0);
    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const playerScore = {
        playerName: '', // Can be set dynamically
        correctAnswers,
        totalQuestions,
        totalPoints,
        percentage: parseFloat(percentage.toFixed(2)), // Round to 2 decimal places
    };
    console.debug('Player score calculated:', playerScore);
    return playerScore;
}
// Store player performance data
export function savePlayerScore(playerScore) {
    console.debug('savePlayerScore called with playerScore:', playerScore);
    const scores = JSON.parse(localStorage.getItem('playerScores') || '[]');
    scores.push(playerScore);
    localStorage.setItem('playerScores', JSON.stringify(scores));
    console.debug('Player score saved successfully.');
}
// Retrieve all player scores
export function getPlayerScores() {
    console.debug('getPlayerScores called.');
    const scores = JSON.parse(localStorage.getItem('playerScores') || '[]');
    console.debug('Retrieved player scores:', scores);
    return scores;
}
