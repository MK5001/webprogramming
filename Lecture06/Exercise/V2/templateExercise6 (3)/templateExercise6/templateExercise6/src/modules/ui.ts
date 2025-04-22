import { Question } from "./questions";
import { Scoring } from "./scoring";


export function renderQuestion(question: Question, callback: (answer: string) => void): void {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
  
    // Sicherstellen, dass die DOM-Elemente existieren
    if (!questionElement || !optionsElement) {
      console.error("Frage oder Optionen-Elemente nicht gefunden!");
      return;
    }
  
    // Frage und Optionen rendern
    console.log("Frage:", question.question);
    console.log("Optionen:", question.options);
  
    questionElement.innerHTML = `<h3>${question.question}</h3>`;
    optionsElement.innerHTML = question.options
      .map((option) => `<button class='option-btn'>${option}</button>`)
      .join(" ");
  
    // Event-Listener für die Optionen
    document.querySelectorAll(".option-btn").forEach((btn) => {
      btn.addEventListener("click", () => callback(btn.textContent || ""));
    });
  }
  