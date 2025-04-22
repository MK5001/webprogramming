"use strict";
var GameState;
(function (GameState) {
    GameState[GameState["NotStarted"] = 0] = "NotStarted";
    GameState[GameState["GameSettingsSelection"] = 1] = "GameSettingsSelection";
    GameState[GameState["GameSettingsConfirmation"] = 2] = "GameSettingsConfirmation";
    GameState[GameState["InProgress"] = 3] = "InProgress";
    GameState[GameState["GameEnding"] = 4] = "GameEnding";
    GameState[GameState["GameRestarting"] = 5] = "GameRestarting";
    GameState[GameState["Completed"] = 6] = "Completed";
})(GameState || (GameState = {}));
const currentState = GameState.NotStarted;
if (currentState === GameState.NotStarted) {
    console.log("Game has not started yet.");
}
else if (currentState === GameState.GameSettingsSelection) {
    console.log("Game settings are being selected.");
}
else if (currentState === GameState.GameSettingsConfirmation) {
    console.log("Game settings are being confirmed.");
}
else if (currentState === GameState.InProgress) {
    console.log("Game is in progress.");
}
else if (currentState === GameState.GameEnding) {
    console.log("Game is ending.");
}
else if (currentState === GameState.GameRestarting) {
    console.log("Game is restarting.");
}
else if (currentState === GameState.Completed) {
    console.log("Game has been completed.");
}
