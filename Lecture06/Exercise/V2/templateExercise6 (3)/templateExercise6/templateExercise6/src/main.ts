console.log("🚀 main.js wurde geladen!");

import { loadQuestions, getRandomQuestions } from "./modules/questions.js";
import { Scoring } from "./modules/scoring.js";
import { renderQuestion } from "./modules/ui.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM geladen!");

  // Holen der Button und Eingabefelder
  const startButton = document.getElementById("start-quiz");
  const quizContainer = document.getElementById("quiz-container");
  const playerInput = document.getElementById("player-input");
  const playerCountSelect = document.getElementById("player-count") as HTMLSelectElement;
  const nameInputsContainer = document.getElementById("name-inputs");
  let players: { name: string; score: number }[] = [];
  let currentPlayerIndex = 0;

  if (!startButton || !quizContainer || !playerInput) {
    console.error("Fehler: Ein oder mehrere Elemente wurden nicht gefunden!");
    return;
  }

  //Auswahl Spieleranzahl
  playerCountSelect.addEventListener("change", () => {
    const count = parseInt(playerCountSelect.value);
    nameInputsContainer!.innerHTML = "";
    for (let i = 0; i < count; i++) {
      nameInputsContainer!.innerHTML += `
        <input type="text" class="form-control mb-2 player-name" placeholder="Spieler ${i + 1} Name" />
      `;
    }
  });

  console.log("Button gefunden:", startButton);

  // Lade die Fragen
  console.log("Lade Fragen...");
  const questions = await loadQuestions();
  console.log("Geladene Fragen:", questions);
  const scoring = new Scoring();
  let currentQuestionIndex = 0;

  // Event-Listener für den Start-Button
  startButton.addEventListener("click", () => {
    console.log("Button wurde geklickt!");

    const nameInputs = document.querySelectorAll(".player-name") as NodeListOf<HTMLInputElement>;
    players = [];


    //macht, dass die Namensfelder im Browsernach Start 
    nameInputs.forEach(input => {
      input.readOnly = true;
      const name = input.value.trim();
      if (name) {
        players.push({ name, score: 0 });
      }
    });

    if (players.length === 0) {
      alert("⚠ Bitte gib mindestens einen Spielernamen ein!");
      return;
    }

    const selectedQuestions = getRandomQuestions(questions, players.length * 5);

    // Verstecke die Eingabemaske
    playerInput.style.display = "none";
    quizContainer.classList.add("show");

    console.log("Quiz gestartet!");
    nextQuestion();

    // Funktion, um die Fragen anzuzeigen
    function nextQuestion() {
      if (currentQuestionIndex < selectedQuestions.length) {
        console.log(`Zeige Frage ${currentQuestionIndex + 1} von ${selectedQuestions.length}`);

        const currentPlayerDisplay = document.getElementById("currentPlayerDisplay");
        if (currentPlayerDisplay) {
          currentPlayerDisplay.textContent = `${players[currentPlayerIndex].name} ist am Zug!`;
        }


        renderQuestion(selectedQuestions[currentQuestionIndex], (answer) => {



          const question = selectedQuestions[currentQuestionIndex];
          const feedbackElement = document.getElementById("feedback")!;
          let message = "";

          if (String(answer) === String(question.answer)) {
            const points = { easy: 1, medium: 2, hard: 3 };
            const earned = points[question.difficulty];
            players[currentPlayerIndex].score += earned;
            message = `Spieler ${players[currentPlayerIndex].name} Richtig! +${earned} Punkt${earned > 1 ? "e" : ""}`;
          } else {
            message = `Falsch! Richtige Antwort: ${question.answer}`;
          }

          feedbackElement.textContent = message;

          //Prüft ob Antwort mit richtiger Antwort übereinstimmt



          currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

          // document.getElementById("current-player")!.textContent =
          //   `Spieler: ${players[currentPlayerIndex].name} | Punkte: ${players[currentPlayerIndex].score}`;

          //document.getElementById("score")!.innerHTML =
          //  `Nächster Spieler: ${players[currentPlayerIndex].name} | Punkte: ${players[currentPlayerIndex].score}`;


          // Update des Scores
          //document.getElementById("score")!.innerHTML = `Score: ${scoring.getScore()}`;
          //document.getElementById("score")!.innerHTML = `🎉 Spiel beendet!`;

          const leaderboardList = document.getElementById("leaderboard-list");
          if (leaderboardList) {
            leaderboardList.innerHTML = ""; // leeren, damit nichts doppelt ist
            players.forEach(player => {
              leaderboardList.innerHTML += `<li>${player.name}: ${player.score} Punkte</li>`;
            });
          }

          // Nächste Frage
          currentQuestionIndex++;
          nextQuestion(); // Zeige die nächste Frage an
        });
      } else {
        console.log("🎉 Alle Fragen beantwortet!");
        quizContainer?.classList.remove("show"); // Overlay ausblenden

        // Optional: Zeige eine Abschlussnachricht oder Button
        const endScreen = document.getElementById("end-screen");
        if (endScreen) {
          endScreen.style.display = "block";
        }
        const downloadBtn = document.getElementById("download-json-btn")!;
        downloadBtn.style.display = "inline-block";
        downloadBtn.addEventListener("click", () => {
          const dataStr = JSON.stringify(players, null, 2); // schön formatiert
          const blob = new Blob([dataStr], { type: "application/json" });
          const url = URL.createObjectURL(blob);
        
          const a = document.createElement("a");
          a.href = url;
          a.download = "highscore.json";
          a.click();
        
          URL.revokeObjectURL(url);
        });

      }
    }
  });
});
