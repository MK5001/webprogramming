// src/ApiService.ts

export interface ApiResponse {
    success?: boolean;
    error?: string;
    id?: string;
    token?: string; 
  }
  
  // Example user type
  export interface User {
    id: string;
    name: string;
    group_id: string;
  }

  export interface ChatMessage {
    sender_id: string;
    receiver_id: string;
    message: string;
    timestamp?: number;
  }
  
  const BASE_URL = "http://webp-ilv-backend.cs.technikum-wien.at/messenger";
  
  export class ApiService {
    
    private static token: string | null = null;
    private static registeredUserId: string | null = null;
  
    static getToken(): string | null {
      return this.token;
    }
  
    static getRegisteredUserId(): string | null {
      return this.registeredUserId;
    }
  
  
    // 1) Register a new user
    static async registerUser(
      name: string,
      email: string,
      password: string,
      groupId: string
    ): Promise<ApiResponse> {
      const url = `${BASE_URL}/registrieren.php`;
      
      const body = new URLSearchParams();
      body.append("name", name);
      body.append("email", email);
      body.append("password", password);
      body.append("group_id", groupId);

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });
      const data: ApiResponse = await resp.json();
  
      // If the response includes "id", store it
      if (data.id) {
        this.registeredUserId = data.id;
        console.log("Registered user ID stored:", this.registeredUserId);
      }
  
      return data;
    }
  
    // 2) Login
static async loginUser(usernameOrEmail: string, password: string): Promise<ApiResponse> {
  const url = `${BASE_URL}/login.php`;

  const formData = new FormData();
  formData.append("username_or_email", usernameOrEmail);
  formData.append("password", password);

  const resp = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data: ApiResponse = await resp.json();
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
}
  
    // 3) Get Users
  
  static async getUsers(): Promise<User[] | { error?: string }> {
    const params: string[] = [];
  
    if (this.token) {
      params.push(`token=${this.token}`);
    }
  
    if (this.registeredUserId) {
      params.push(`id=${this.registeredUserId}`);
    }
  
    // Construct the final query string
    // e.g. "?token=abc123&id=42" or "" if neither is set
    const queryString = params.length > 0 ? "?" + params.join("&") : "";
  
    const url = `${BASE_URL}/get_users.php${queryString}`;
  
    const resp = await fetch(url);
    return resp.json();
  }

    static async getConversation(
      user1Id: string,
      user2Id: string
    ): Promise<ChatMessage[] | { error?: string }> {
      const params: string[] = [];

      if (this.token) {
        params.push(`token=${encodeURIComponent(this.token)}`);
      }

      params.push(`user1_id=${encodeURIComponent(user1Id)}`);
      params.push(`user2_id=${encodeURIComponent(user2Id)}`);

      const url = `${BASE_URL}/get_conversation.php?${params.join("&")}`;

      const resp = await fetch(url);
      return resp.json();
    }
  
  
    // 4) Send Message
static async sendMessage(
  senderId: string,
  receiverId: string,
  message: string
): Promise<ApiResponse> {
  const url = `${BASE_URL}/send_message.php`;

  const resp = await fetch(url, {
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
}
}
  