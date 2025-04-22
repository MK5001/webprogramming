import { calculateScore } from './scoring.js';
let playerAnswers = [];
let currentQuestionIndex = 0;
let playerQuestions = []; // This will hold the questions for the player
export function displayQuestion(questions) {
    console.debug('displayQuestion called with questions:', questions);
    playerQuestions = questions; // Store the questions for later use
    showQuestion(currentQuestionIndex);
}
function showQuestion(index) {
    console.debug('showQuestion called with index:', index);
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const progressElement = document.getElementById('progress');
    const question = playerQuestions[index];
    console.debug('Displaying question:', question);
    // Display the question text
    questionElement.textContent = question.question;
    // Clear previous options
    optionsElement.innerHTML = '';
    // Display the options as buttons
    question.options.forEach((option) => {
        const button = document.createElement('button');
        button.textContent = option.toString();
        button.onclick = () => handleAnswer(index, option);
        optionsElement.appendChild(button);
    });
    // Update progress
    progressElement.textContent = `Frage ${index + 1} von ${playerQuestions.length}`;
}
function handleAnswer(index, selectedOption) {
    console.debug('handleAnswer called with index:', index, 'selectedOption:', selectedOption);
    const question = playerQuestions[index];
    const isCorrect = question.answer === selectedOption;
    console.debug('Answer is correct:', isCorrect);
    // Save the player's answer
    playerAnswers.push({
        questionDifficulty: question.difficulty,
        isCorrect: isCorrect,
    });
    // Move to the next question or finish the quiz
    if (index + 1 < playerQuestions.length) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    }
    else {
        finishQuiz();
    }
}
function finishQuiz() {
    console.debug('finishQuiz called.');
    const score = calculateScore(playerAnswers);
    console.debug('Final score calculated:', score);
    // Display the score
    const scoreElement = document.getElementById('score');
    scoreElement.innerHTML = `
        <h2>Quiz beendet!</h2>
        <p>Korrekte Antworten: ${score.correctAnswers} von ${score.totalQuestions}</p>
        <p>Gesamtpunkte: ${score.totalPoints}</p>
        <p>Prozentsatz: ${score.percentage}%</p>
    `;
    scoreElement.style.display = 'block';
}
