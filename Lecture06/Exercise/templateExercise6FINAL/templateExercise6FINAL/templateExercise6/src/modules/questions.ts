export interface Question {
    category: string;
    question: string;
    options: number[];
    answer: number;
    difficulty: "easy" | "medium" | "hard";
  }
  
  export async function loadQuestions(): Promise<Question[]> {
    const response = await fetch("./questions.json");
    const data: Question[] = await response.json();
    return data;
  }
  
  export function getRandomQuestions(questions: Question[], count: number): Question[] {
    return questions.sort(() => 0.5 - Math.random()).slice(0, count);
  }