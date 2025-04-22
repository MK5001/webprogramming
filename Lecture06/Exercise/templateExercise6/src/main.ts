import { savePlayerScore, calculateScore } from './modules/scoring';
import { fetchQuestions } from './modules/questions';
import { displayQuestion } from './modules/ui';

function togglePlayerNameInput(show: boolean): void {
    console.debug('togglePlayerNameInput called with:', show);
    const playerNameInput = document.getElementById('player-input') as HTMLDivElement;
    if (playerNameInput) {
        playerNameInput.style.display = show ? 'block' : 'none';
        console.debug('Player name input display set to:', playerNameInput.style.display);
    } else {
        console.warn('Player name input element not found.');
    }
}

function toggleQuizContainer(show: boolean): void {
    console.debug('toggleQuizContainer called with:', show);
    const quizContainer = document.getElementById('quiz-container') as HTMLDivElement;
    if (quizContainer) {
        quizContainer.style.display = show ? 'block' : 'none';
        console.debug('Quiz container display set to:', quizContainer.style.display);
    } else {
        console.warn('Quiz container element not found.');
    }
}

function handlePlayerNameSubmission(event: Event): void {
    event.preventDefault(); // Verhindert das Neuladen der Seite
    console.debug('handlePlayerNameSubmission called.');
    const playerInput = document.getElementById('player-name') as HTMLInputElement;
    if (playerInput) {
        const playerName = playerInput.value;
        console.debug('Player name input value:', playerName);
        if (playerName) {
            console.log('Player Name:', playerName);
            togglePlayerNameInput(false);
            toggleQuizContainer(true);

            // Direkt die importierte Funktion fetchQuestions verwenden
            fetchQuestions()
                .then((questions) => {
                    console.debug('Questions fetched:', questions);
                    displayQuestion(questions); // Zeige die Fragen an
                })
                .catch((error) => {
                    console.error('Error fetching questions:', error);
                });
        } else {
            console.warn('Player name is empty.');
            alert('Bitte geben Sie Ihren Namen ein.');
        }
    } else {
        console.error('Player name input element not found.');
    }
}

function initialize(): void {
    console.debug('initialize called.');
    const submitButton = document.getElementById('submit-name');
    if (submitButton) {
        console.debug('Submit button found.');
        submitButton.addEventListener('click', (event) => handlePlayerNameSubmission(event));
    } else {
        console.error('Submit button not found.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.debug('DOMContentLoaded event fired.');

    // Überprüfe, ob die Elemente existieren
    const playerInput = document.getElementById('player-name') as HTMLInputElement;
    const submitButton = document.getElementById('submit-name') as HTMLButtonElement;

    if (!playerInput) {
        console.error('Player input element with ID "player-name" not found.');
    } else {
        console.debug('Player input element found:', playerInput);
    }

    if (!submitButton) {
        console.error('Submit button with ID "submit-name" not found.');
    } else {
        console.debug('Submit button element found:', submitButton);
    }

    // Initialisiere das Quiz
    initialize();
});
