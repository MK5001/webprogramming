import { ApiService } from "./ApiService.js";
import { ChatUI } from "./ChatUI.js";
import { StateManager } from "./StateManager.js";
import type { User } from "./ApiService.js";

const chatUI = new ChatUI();
let selectedUser: User | null = null;
let refreshIntervalId: number | null = null;

chatUI.onRegister(handleRegister);
chatUI.onLogin(handleLogin);
chatUI.onLoadUsers(handleGetUsers);
chatUI.onSendMessage(handleSendMessage);

// Task 1: Handle Register
async function handleRegister(event: Event) {
  event.preventDefault();
  const { name, email, password, group } = chatUI.getRegisterFormData();

  try {
    chatUI.showRegisterMessage("Registering ...");
    const response = await ApiService.registerUser(name, email, password, group);

    if (response.success) {
      chatUI.showRegisterMessage(`Registration successful! New user ID: ${response.id}`);
      chatUI.resetForm(event);
    } else {
      chatUI.showRegisterMessage(`Registration failed: ${response.error || "Unknown error"}`);
    }
  } catch (err) {
    console.error("handleRegister Error:", err);
    chatUI.showRegisterMessage("Network or server error.");
  }
}

// Task 2: Handle Login
async function handleLogin(event: Event) {
  event.preventDefault();
  const { usernameOrEmail, password } = chatUI.getLoginFormData();

  try {
    chatUI.showLoginMessage("Logging in ...");
    const response = await ApiService.loginUser(usernameOrEmail, password);

    if (response.token) {
      StateManager.setToken(response.token);
      chatUI.showLoginMessage("Login successful!");
      chatUI.resetForm(event);
      await handleGetUsers();
    } else {
      chatUI.showLoginMessage(`Login failed: ${response.error || "Unknown error"}`);
    }
  } catch (err) {
    console.error("handleLogin Error:", err);
    chatUI.showLoginMessage("Network or server error.");
  }
}

// Task 3: Get Users
async function handleGetUsers() {
  chatUI.showUsersLoading();

  try {
    const data = await ApiService.getUsers();

    if (Array.isArray(data)) {
      chatUI.showUsers(data as User[], handleUserSelected);
    } else {
      chatUI.showUsersError(`Error: ${data.error}`);
    }
  } catch (err) {
    console.error("handleGetUsers Error:", err);
    chatUI.showUsersError("Network or server error while loading users.");
  }
}

async function handleUserSelected(user: User) {
  selectedUser = user;
  chatUI.showChatTitle(user);
  await loadConversation(true);
  startChatRefresh();
}

async function loadConversation(showLoading = false) {
  const currentUserId = ApiService.getRegisteredUserId();

  if (!currentUserId || !selectedUser) {
    chatUI.showSendMessage("Bitte zuerst einloggen und einen User auswählen.");
    return;
  }

  try {
    if (showLoading) {
      chatUI.showChatLoading();
    }

    const data = await ApiService.getConversation(currentUserId, selectedUser.id);

    if (Array.isArray(data)) {
      chatUI.showConversation(data, currentUserId);
    } else {
      chatUI.showSendMessage(`Fehler: ${data.error || "Conversation konnte nicht geladen werden."}`);
    }
  } catch (err) {
    console.error("loadConversation Error:", err);
    chatUI.showSendMessage("Network or server error while loading conversation.");
  }
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
async function handleSendMessage(event: Event) {
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
    const response = await ApiService.sendMessage(currentUserId, selectedUser.id, message);

    if (response.success) {
      chatUI.showSendMessage("Message successfully sent!");
      chatUI.clearChatInput();
      await loadConversation();
    } else {
      chatUI.showSendMessage(`Error: ${response.error || "Unknown error"}`);
    }
  } catch (err) {
    console.error("handleSendMessage Error:", err);
    chatUI.showSendMessage("Network or server error while sending message.");
  }
}
