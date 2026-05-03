var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiService } from "./ApiService.js";
import { ChatUI } from "./ChatUI.js";
import { StateManager } from "./StateManager.js";
const chatUI = new ChatUI();
let selectedUser = null;
let refreshIntervalId = null;
chatUI.onRegister(handleRegister);
chatUI.onLogin(handleLogin);
chatUI.onLoadUsers(handleGetUsers);
chatUI.onSendMessage(handleSendMessage);
// Task 1: Handle Register
function handleRegister(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const { name, email, password, group } = chatUI.getRegisterFormData();
        try {
            chatUI.showRegisterMessage("Registering ...");
            const response = yield ApiService.registerUser(name, email, password, group);
            if (response.success) {
                chatUI.showRegisterMessage(`Registration successful! New user ID: ${response.id}`);
                chatUI.resetForm(event);
            }
            else {
                chatUI.showRegisterMessage(`Registration failed: ${response.error || "Unknown error"}`);
            }
        }
        catch (err) {
            console.error("handleRegister Error:", err);
            chatUI.showRegisterMessage("Network or server error.");
        }
    });
}
// Task 2: Handle Login
function handleLogin(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const { usernameOrEmail, password } = chatUI.getLoginFormData();
        try {
            chatUI.showLoginMessage("Logging in ...");
            const response = yield ApiService.loginUser(usernameOrEmail, password);
            if (response.token) {
                StateManager.setToken(response.token);
                chatUI.showLoginMessage("Login successful!");
                chatUI.resetForm(event);
                yield handleGetUsers();
            }
            else {
                chatUI.showLoginMessage(`Login failed: ${response.error || "Unknown error"}`);
            }
        }
        catch (err) {
            console.error("handleLogin Error:", err);
            chatUI.showLoginMessage("Network or server error.");
        }
    });
}
// Task 3: Get Users
function handleGetUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        chatUI.showUsersLoading();
        try {
            const data = yield ApiService.getUsers();
            if (Array.isArray(data)) {
                chatUI.showUsers(data, handleUserSelected);
            }
            else {
                chatUI.showUsersError(`Error: ${data.error}`);
            }
        }
        catch (err) {
            console.error("handleGetUsers Error:", err);
            chatUI.showUsersError("Network or server error while loading users.");
        }
    });
}
function handleUserSelected(user) {
    return __awaiter(this, void 0, void 0, function* () {
        selectedUser = user;
        chatUI.showChatTitle(user);
        yield loadConversation(true);
        startChatRefresh();
    });
}
function loadConversation() {
    return __awaiter(this, arguments, void 0, function* (showLoading = false) {
        const currentUserId = ApiService.getRegisteredUserId();
        if (!currentUserId || !selectedUser) {
            chatUI.showSendMessage("Bitte zuerst einloggen und einen User auswählen.");
            return;
        }
        try {
            if (showLoading) {
                chatUI.showChatLoading();
            }
            const data = yield ApiService.getConversation(currentUserId, selectedUser.id);
            if (Array.isArray(data)) {
                chatUI.showConversation(data, currentUserId);
            }
            else {
                chatUI.showSendMessage(`Fehler: ${data.error || "Conversation konnte nicht geladen werden."}`);
            }
        }
        catch (err) {
            console.error("loadConversation Error:", err);
            chatUI.showSendMessage("Network or server error while loading conversation.");
        }
    });
}
function startChatRefresh() {
    stopChatRefresh();
    refreshIntervalId = window.setInterval(() => {
        if (selectedUser) {
            loadConversation();
        }
    }, 10000);
}
function stopChatRefresh() {
    if (refreshIntervalId !== null) {
        clearInterval(refreshIntervalId);
        refreshIntervalId = null;
    }
}
// Task 4: Send Message
function handleSendMessage(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const currentUserId = ApiService.getRegisteredUserId();
        const message = chatUI.getChatMessageText();
        if (!currentUserId || !selectedUser) {
            chatUI.showSendMessage("Bitte zuerst einloggen und einen User auswählen.");
            return;
        }
        if (!message) {
            chatUI.showSendMessage("Bitte eine Nachricht eingeben.");
            return;
        }
        try {
            chatUI.showSendMessage("Sending message ...");
            const response = yield ApiService.sendMessage(currentUserId, selectedUser.id, message);
            if (response.success) {
                chatUI.showSendMessage("Message successfully sent!");
                chatUI.clearChatInput();
                yield loadConversation();
            }
            else {
                chatUI.showSendMessage(`Error: ${response.error || "Unknown error"}`);
            }
        }
        catch (err) {
            console.error("handleSendMessage Error:", err);
            chatUI.showSendMessage("Network or server error while sending message.");
        }
    });
}
