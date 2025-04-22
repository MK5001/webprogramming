export interface Question {
    category: string;
    question: string;
    options: (string | number)[];
    answer: string | number;
    difficulty: 'easy' | 'medium' | 'hard';
}

// Fetch questions from the JSON file
export async function fetchQuestions(): Promise<Question[]> {
    console.debug('fetchQuestions called.');
    const response = await fetch('./questions.json');
    if (!response.ok) {
        console.error('Failed to load questions:', response.statusText);
        throw new Error('Failed to load questions');
    }
    const questions: Question[] = await response.json();
    console.debug('Questions fetched successfully:', questions);
    return questions;
}

// Shuffle an array (utility function)
function shuffleArray(array: any[]): any[] {
    console.debug('shuffleArray called with array:', array);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    console.debug('Array shuffled:', array);
    return array;
}

// Distribute 5 questions per player with equal difficulty levels
export function getQuestionsForPlayer(questions: Question[]): Question[] {
    console.debug('getQuestionsForPlayer called with questions:', questions);
    const difficulties = ['easy', 'medium', 'hard'] as const;
    const selectedQuestions: Question[] = [];

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