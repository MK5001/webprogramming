// src/ApiService.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BASE_URL = "http://webp-ilv-backend.cs.technikum-wien.at/messenger";
export class ApiService {
    static getToken() {
        return this.token;
    }
    static getRegisteredUserId() {
        return this.registeredUserId;
    }
    static registerUser(name, email, password, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${BASE_URL}/registrieren.php`;
            const body = new URLSearchParams();
            body.append("name", name);
            body.append("email", email);
            body.append("password", password);
            body.append("group_id", groupId);
            const resp = yield fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body,
            });
            const data = yield resp.json();
            if (data.id) {
                this.registeredUserId = data.id;
                console.log("Registered user ID stored:", this.registeredUserId);
            }
            return data;
        });
    }
    static loginUser(usernameOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${BASE_URL}/login.php`;
            const resp = yield fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username_or_email: usernameOrEmail,
                    password: password,
                }),
            });
            const data = yield resp.json();
            console.log("Login/Registration response:", data);
            if (data.token) {
                this.token = data.token;
                console.log("Token stored:", this.token);
            }
            if (data.id) {
                this.registeredUserId = data.id;
                console.log("Userid stored:", this.registeredUserId);
            }
            return data;
        });
    }
    static getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = [];
            if (this.token) {
                params.push(`token=${encodeURIComponent(this.token)}`);
            }
            if (this.registeredUserId) {
                params.push(`id=${encodeURIComponent(this.registeredUserId)}`);
            }
            const queryString = params.length > 0 ? "?" + params.join("&") : "";
            const url = `${BASE_URL}/get_users.php${queryString}`;
            const resp = yield fetch(url);
            return resp.json();
        });
    }
    static sendMessage(senderId, receiverId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${BASE_URL}/send_message.php`;
            const resp = yield fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: this.token,
                    sender_id: senderId,
                    receiver_id: receiverId,
                    message: message,
                }),
            });
            return resp.json();
        });
    }
}
ApiService.token = null;
ApiService.registeredUserId = null;
