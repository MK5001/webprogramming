"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Global variables
let currentInterval = null; // Variable, um das aktuelle Intervall zu speichern
let SongIsPlaying = false; // Variable, um zu überprüfen, ob ein Song abgespielt wird
// Aufruf für das Laden der JSON-Datei
LoadJson();
// Array of keys mit den jeweiligen Noten 
const keys = [
    { id: 'keyA', color: 'White', note: 'C' },
    { id: 'keyS', color: 'White', note: 'D' },
    { id: 'keyD', color: 'White', note: 'E' },
    { id: 'keyF', color: 'White', note: 'F' },
    { id: 'keyG', color: 'White', note: 'G' },
    { id: 'keyH', color: 'White', note: 'A' },
    { id: 'keyJ', color: 'White', note: 'B' },
    { id: 'keyW', color: 'Black', note: 'C#' },
    { id: 'keyE', color: 'Black', note: 'D#' },
    { id: 'keyT', color: 'Black', note: 'F#' },
    { id: 'keyZ', color: 'Black', note: 'G#' },
    { id: 'keyU', color: 'Black', note: 'A#' }
];
// Play sound function
function playSound(note) {
    const encodedNote = note.replace('#', '%23'); // Encode # to %23, weil # ist ein special character in URL(daher findet er den Pfad nicht)
    const audioPath = `sounds/${encodedNote}.mp3`;
    console.log("Playing:", note, "from", audioPath);
    const audio = new Audio(audioPath);
    audio.play().catch(error => {
        console.error("Error playing sound:", error);
    });
}
// Event listeners, welcher beim keydown aufgerufen wird und die Note spielt
document.addEventListener('keydown', (event) => {
    const key = keys.find(k => k.id === `key${event.key.toUpperCase()}`);
    if (key) {
        console.log(`Key pressed: ${event.key.toUpperCase()}, Note: ${key.note}`);
        playSound(key.note);
    }
    else { // Wenn der Key nicht in der keys-Liste ist
        console.log(`Key pressed: ${event.key.toUpperCase()} not mapped to any note.`);
    }
});
// Event listeners, welcher beim click aufgerufen wird und die Note spielt
document.querySelectorAll('.key').forEach((key) => {
    key.addEventListener('click', () => {
        var _a;
        const note = (_a = keys.find(k => k.id === key.id)) === null || _a === void 0 ? void 0 : _a.note;
        if (note) {
            console.log(`Key clicked: ${key.id}, Note: ${note}`);
            playSound(note);
        }
    });
});
// fetched die songs aus der songs.json und spielt sie bei auslösen des Eventlisteners aus
function LoadJson() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('songs.json');
        try {
            const songs = yield response.json();
            const playSong1Button = document.getElementById('playSong1');
            if (playSong1Button) {
                playSong1Button.addEventListener('click', () => {
                    playSong(songs.song1);
                });
            }
            const playSong2Button = document.getElementById('playSong2');
            if (playSong2Button) {
                playSong2Button.addEventListener('click', () => {
                    playSong(songs.song2);
                });
            }
            const playSong3Button = document.getElementById('playSong3');
            if (playSong3Button) {
                playSong3Button.addEventListener('click', () => {
                    playSong(songs.song3);
                });
            }
            const stopButton = document.getElementById('stop');
            if (stopButton) {
                stopButton.addEventListener('click', () => {
                    stopSong();
                });
            }
        }
        catch (error) {
            console.error("Error loading songs:", error);
        }
    });
}
// Funktion, um die Noten in Boxen anzuzeigen
function displayNotes(song) {
    const notesContainer = document.getElementById('notesContainer');
    if (!notesContainer)
        return;
    notesContainer.innerHTML = '';
    song.forEach(note => {
        const noteBox = document.createElement('div');
        noteBox.className = 'note-box';
        noteBox.textContent = note;
        notesContainer.appendChild(noteBox);
    });
}
// Reset-Function, welche die Noten-Boxen entfernt
function resetGame() {
    // Noten-Boxen entfernen
    const notesContainer = document.getElementById('notesContainer');
    if (!notesContainer)
        return;
    notesContainer.innerHTML = '';
    SongIsPlaying = false;
    toggleResetButton(false); // Reset-Button ausblenden
    console.log("Game has been reset.");
}
// Funktion, um den Stop-Button zu steuern
function toggleStopButton(show) {
    const stopButton = document.getElementById('stop');
    if (!stopButton)
        return;
    if (show) {
        stopButton.style.display = 'inline-block';
        toggleResetButton(false); // Verstecke den Reset-Button, wenn der Stop-Button sichtbar ist
    }
    else {
        stopButton.style.display = 'none';
        // Zeige den Reset-Button nur, wenn Noten-Boxen existieren
        const notesContainer = document.getElementById('notesContainer');
        if (!notesContainer)
            return;
        if (notesContainer.children.length > 0) {
            toggleResetButton(true);
        }
    }
}
// Funktion, um den Reset-Button zu steuern
function toggleResetButton(show) {
    const resetButton = document.getElementById('reset');
    if (!resetButton)
        return;
    if (show) {
        resetButton.style.display = 'inline-block';
    }
    else {
        resetButton.style.display = 'none';
    }
}
// Funktion, um den Song zu stoppen
function stopSong() {
    if (currentInterval) {
        clearInterval(currentInterval); // Stoppe das Intervall
        currentInterval = null; // Setze die Variable zurück
    }
    toggleStopButton(false); // Verstecke den Stop-Button
    console.log("Song stopped.");
}
// Funktion, welche die Songs abspielt
function playSong(song) {
    let i = 0;
    displayNotes(song); // Noten anzeigen
    if (SongIsPlaying == true) {
        stopSong();
    }
    SongIsPlaying = true;
    // Stop-Button anzeigen und Reset-Button ausblenden
    toggleStopButton(true);
    currentInterval = setInterval(() => {
        if (i < song.length) {
            playSound(song[i]);
            i++;
        }
        else {
            clearInterval(currentInterval);
            currentInterval = null; // Setze die Variable zurück
            toggleStopButton(false); // Stop-Button ausblenden
            toggleResetButton(true); // Reset-Button anzeigen
            SongIsPlaying = false;
            console.log("Song-Ende");
        }
    }, 500);
}
// Stop-Button-Event
const stopButton = document.getElementById('stop');
if (stopButton) {
    stopButton.addEventListener('click', () => {
        stopSong();
    });
}
// Reset-Button-Event
const resetButton = document.getElementById('reset');
if (resetButton) {
    resetButton.addEventListener('click', () => {
        stopSong();
        resetGame();
    });
}
