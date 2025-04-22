import { Question } from './questions.js';
import { calculateScore, PlayerScore } from './scoring.js';

let playerAnswers: { questionDifficulty: 'easy' | 'medium' | 'hard'; isCorrect: boolean }[] = [];
let currentQuestionIndex = 0;
let playerQuestions: Question[] = []; // This will hold the questions for the player

export function displayQuestion(questions: Question[]): void {
    console.debug('displayQuestion called with questions:', questions);
    playerQuestions = questions; // Store the questions for later use
    showQuestion(currentQuestionIndex);
}

function showQuestion(index: number): void {
    console.debug('showQuestion called with index:', index);
    const questionElement = document.getElementById('question') as HTMLDivElement;
    const optionsElement = document.getElementById('options') as HTMLButtonElement;
    const progressElement = document.getElementById('progress') as HTMLDivElement;

    const question: Question = playerQuestions[index];
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

function handleAnswer(index: number, selectedOption: string | number): void {
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
    } else {
        finishQuiz();
    }
}

function finishQuiz(): void {
    console.debug('finishQuiz called.');
    const score: PlayerScore = calculateScore(playerAnswers);
    console.debug('Final score calculated:', score);

    // Display the score
    const scoreElement = document.getElementById('score') as HTMLDivElement;
    scoreElement.innerHTML = `
        <h2>Quiz beendet!</h2>
        <p>Korrekte Antworten: ${score.correctAnswers} von ${score.totalQuestions}</p>
        <p>Gesamtpunkte: ${score.totalPoints}</p>
        <p>Prozentsatz: ${score.percentage}%</p>
    `;
    scoreElement.style.display = 'block';
}
