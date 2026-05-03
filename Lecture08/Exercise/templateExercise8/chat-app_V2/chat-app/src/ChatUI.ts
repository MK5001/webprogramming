// src/ChatUI.ts

import type { User } from "./ApiService.js";

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

export interface MessageFormData {
  senderId: string;
  receiverId: string;
  message: string;
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

  getMessageFormData(): MessageFormData {
    return {
      senderId: (document.getElementById("senderId") as HTMLInputElement).value.trim(),
      receiverId: (document.getElementById("receiverId") as HTMLInputElement).value.trim(),
      message: (document.getElementById("messageText") as HTMLInputElement).value.trim(),
    };
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
      usersList.innerHTML = "Loading users...";
    }
  }

  showUsers(users: User[]) {
    const usersList = document.getElementById("usersList");
    if (!usersList) return;

    usersList.innerHTML = "";
    users.forEach((user: User) => {
      const li = document.createElement("li");
      li.textContent = `User: ${user.name} (ID: ${user.id}), group: ${user.group_id}`;
      usersList.appendChild(li);
    });
  }

  showUsersError(message: string) {
    const usersList = document.getElementById("usersList");
    if (usersList) {
      usersList.innerHTML = message;
    }
  }

  resetForm(event: Event) {
    (event.target as HTMLFormElement).reset();
  }
}
