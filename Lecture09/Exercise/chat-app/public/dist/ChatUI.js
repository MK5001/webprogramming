// src/ChatUI.ts
export class ChatUI {
    onRegister(handler) {
        const regForm = document.getElementById("registerForm");
        if (regForm) {
            regForm.addEventListener("submit", handler);
        }
    }
    onLogin(handler) {
        const loginForm = document.getElementById("loginForm");
        if (loginForm) {
            loginForm.addEventListener("submit", handler);
        }
    }
    onLoadUsers(handler) {
        const loadUsersBtn = document.getElementById("loadUsersBtn");
        if (loadUsersBtn) {
            loadUsersBtn.addEventListener("click", handler);
        }
    }
    onSendMessage(handler) {
        const sendForm = document.getElementById("sendForm");
        if (sendForm) {
            sendForm.addEventListener("submit", handler);
        }
    }
    getRegisterFormData() {
        return {
            name: document.getElementById("regName").value.trim(),
            email: document.getElementById("regEmail").value.trim(),
            password: document.getElementById("regPass").value.trim(),
            group: document.getElementById("regGroup").value.trim(),
        };
    }
    getLoginFormData() {
        return {
            usernameOrEmail: document.getElementById("loginUser").value.trim(),
            password: document.getElementById("loginPass").value.trim(),
        };
    }
    getChatMessageText() {
        return document.getElementById("messageText").value.trim();
    }
    clearChatInput() {
        const messageInput = document.getElementById("messageText");
        if (messageInput) {
            messageInput.value = "";
        }
    }
    showRegisterMessage(message) {
        const regResultDiv = document.getElementById("registerResult");
        if (regResultDiv) {
            regResultDiv.textContent = message;
        }
    }
    showLoginMessage(message) {
        const loginResultDiv = document.getElementById("loginResult");
        if (loginResultDiv) {
            loginResultDiv.textContent = message;
        }
    }
    showSendMessage(message) {
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
    showUsers(users, onUserClick) {
        const usersList = document.getElementById("usersList");
        if (!usersList)
            return;
        usersList.innerHTML = "";
        users.forEach((user) => {
            const li = document.createElement("li");
            li.className = "list-group-item list-group-item-action";
            li.style.cursor = "pointer";
            li.textContent = `${user.name} - Gruppe ${user.group_id}`;
            li.addEventListener("click", () => onUserClick(user));
            usersList.appendChild(li);
        });
    }
    showUsersError(message) {
        const usersList = document.getElementById("usersList");
        if (usersList) {
            usersList.innerHTML = `<li class="list-group-item text-danger">${message}</li>`;
        }
    }
    showChatTitle(user) {
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
    showConversation(messages, currentUserId) {
        const chatMessages = document.getElementById("chatMessages");
        if (!chatMessages)
            return;
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
    resetForm(event) {
        event.target.reset();
    }
}
