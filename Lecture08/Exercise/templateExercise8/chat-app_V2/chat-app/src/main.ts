import { ApiService } from "./ApiService.js";
import { ChatUI } from "./ChatUI.js";
import { StateManager } from "./StateManager.js";
import type { User } from "./ApiService.js";

const chatUI = new ChatUI();

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
      chatUI.showLoginMessage(`Login successful! Token: ${response.token}`);
      chatUI.resetForm(event);
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
      chatUI.showUsers(data as User[]);
    } else {
      chatUI.showUsersError(`Error: ${data.error}`);
    }
  } catch (err) {
    console.error("handleGetUsers Error:", err);
    chatUI.showUsersError("Network or server error while loading users.");
  }
}

// Task 4: Send Message
async function handleSendMessage(event: Event) {
  event.preventDefault();
  const { senderId, receiverId, message } = chatUI.getMessageFormData();

  try {
    chatUI.showSendMessage("Sending message ...");
    const response = await ApiService.sendMessage(senderId, receiverId, message);

    if (response.success) {
      chatUI.showSendMessage("Message successfully sent!");
      chatUI.resetForm(event);
    } else {
      chatUI.showSendMessage(`Error: ${response.error || "Unknown error"}`);
    }
  } catch (err) {
    console.error("handleSendMessage Error:", err);
    chatUI.showSendMessage("Network or server error while sending message.");
  }
}
