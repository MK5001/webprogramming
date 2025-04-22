var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Fetch questions from the JSON file
export function fetchQuestions() {
    return __awaiter(this, void 0, void 0, function* () {
        console.debug('fetchQuestions called.');
        const response = yield fetch('./questions.json');
        if (!response.ok) {
            console.error('Failed to load questions:', response.statusText);
            throw new Error('Failed to load questions');
        }
        const questions = yield response.json();
        console.debug('Questions fetched successfully:', questions);
        return questions;
    });
}
// Shuffle an array (utility function)
function shuffleArray(array) {
    console.debug('shuffleArray called with array:', array);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    console.debug('Array shuffled:', array);
    return array;
}
// Distribute 5 questions per player with equal difficulty levels
export function getQuestionsForPlayer(questions) {
    console.debug('getQuestionsForPlayer called with questions:', questions);
    const difficulties = ['easy', 'medium', 'hard'];
    const selectedQuestions = [];
    difficulties.forEach((difficulty) => {
        console.debug(`Processing difficulty level: ${difficulty}`);
        const filteredQuestions = questions.filter(q => q.difficulty === difficulty);
        console.debug(`Filtered questions for ${difficulty}:`, filteredQuestions);
        shuffleArray(filteredQuestions);
        selectedQuestions.push(...filteredQuestions.slice(0, Math.floor(5 / difficulties.length)));
    });
    const finalQuestions = shuffleArray(selectedQuestions).slice(0, 5);
    console.debug('Final selected questions for player:', finalQuestions);
    return finalQuestions;
}
