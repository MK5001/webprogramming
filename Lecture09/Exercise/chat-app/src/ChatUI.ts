// src/ChatUI.ts

import type { User, ChatMessage } from "./ApiService.js";

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  group: string;
}

export interface LoginFormData {
  usernameOrEmail: string;
  password: string;
}

export class ChatUI {
  onRegister(handler: (event: Event) => void) {
    const regForm = document.getElementById("registerForm");
    if (regForm) {
      regForm.addEventListener("submit", handler);
    }
  }

  onLogin(handler: (event: Event) => void) {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", handler);
    }
  }

  onLoadUsers(handler: () => void) {
    const loadUsersBtn = document.getElementById("loadUsersBtn");
    if (loadUsersBtn) {
      loadUsersBtn.addEventListener("click", handler);
    }
  }

  onSendMessage(handler: (event: Event) => void) {
    const sendForm = document.getElementById("sendForm");
    if (sendForm) {
      sendForm.addEventListener("submit", handler);
    }
  }

  getRegisterFormData(): RegisterFormData {
    return {
      name: (document.getElementById("regName") as HTMLInputElement).value.trim(),
      email: (document.getElementById("regEmail") as HTMLInputElement).value.trim(),
      password: (document.getElementById("regPass") as HTMLInputElement).value.trim(),
      group: (document.getElementById("regGroup") as HTMLInputElement).value.trim(),
    };
  }

  getLoginFormData(): LoginFormData {
    return {
      usernameOrEmail: (document.getElementById("loginUser") as HTMLInputElement).value.trim(),
      password: (document.getElementById("loginPass") as HTMLInputElement).value.trim(),
    };
  }

  getChatMessageText(): string {
    return (document.getElementById("messageText") as HTMLInputElement).value.trim();
  }

  clearChatInput() {
    const messageInput = document.getElementById("messageText") as HTMLInputElement;
    if (messageInput) {
      messageInput.value = "";
    }
  }

  showRegisterMessage(message: string) {
    const regResultDiv = document.getElementById("registerResult");
    if (regResultDiv) {
      regResultDiv.textContent = message;
    }
  }

  showLoginMessage(message: string) {
    const loginResultDiv = document.getElementById("loginResult");
    if (loginResultDiv) {
      loginResultDiv.textContent = message;
    }
  }

  showSendMessage(message: string) {
    const sendResultDiv = document.getElementById("sendResult");
    if (sendResultDiv) {
      sendResultDiv.textContent = message;
    }
  }

  showUsersLoading() {
    const usersList = document.getElementById("usersList");
    if (usersList) {
      usersList.innerHTML = `<li class="list-group-item text-muted">Loading users...</li>`;
    }
  }

  showUsers(users: User[], onUserClick: (user: User) => void) {
    const usersList = document.getElementById("usersList");
    if (!usersList) return;

    usersList.innerHTML = "";
    users.forEach((user: User) => {
      const li = document.createElement("li");
      li.className = "list-group-item list-group-item-action";
      li.style.cursor = "pointer";
      li.textContent = `${user.name} - Gruppe ${user.group_id}`;
      li.addEventListener("click", () => onUserClick(user));
      usersList.appendChild(li);
    });
  }

  showUsersError(message: string) {
    const usersList = document.getElementById("usersList");
    if (usersList) {
      usersList.innerHTML = `<li class="list-group-item text-danger">${message}</li>`;
    }
  }

  showChatTitle(user: User) {
    const chatTitle = document.getElementById("chatTitle");
    if (chatTitle) {
      chatTitle.textContent = `Chat mit ${user.name}`;
    }
  }

  showChatLoading() {
    const chatMessages = document.getElementById("chatMessages");
    if (chatMessages) {
      chatMessages.innerHTML = `<div class="text-muted">Chat wird geladen...</div>`;
    }
  }

  showConversation(messages: ChatMessage[], currentUserId: string) {
    const chatMessages = document.getElementById("chatMessages");
    if (!chatMessages) return;

    chatMessages.innerHTML = "";

    messages.forEach((msg) => {
      const isOwnMessage = msg.sender_id === currentUserId;

      const wrapper = document.createElement("div");
      wrapper.className = `d-flex mb-2 ${isOwnMessage ? "justify-content-end" : "justify-content-start"}`;

      const bubble = document.createElement("div");
      bubble.className = `p-2 rounded shadow-sm ${isOwnMessage ? "bg-primary text-white" : "bg-white border"}`;
      bubble.style.maxWidth = "70%";

      const text = document.createElement("div");
      text.textContent = msg.message;

      bubble.appendChild(text);
      wrapper.appendChild(bubble);
      chatMessages.appendChild(wrapper);
    });
  }

  resetForm(event: Event) {
    (event.target as HTMLFormElement).reset();
  }
}
