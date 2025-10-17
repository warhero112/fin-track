import type { Transaction, Goal, User, AiMessage } from "@shared/schema";

const API_BASE = "";

export const api = {
  // User
  async getUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/api/user`);
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  },

  async updateUser(data: Partial<User>): Promise<User> {
    const res = await fetch(`${API_BASE}/api/user`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update user");
    return res.json();
  },

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    const res = await fetch(`${API_BASE}/api/transactions`);
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return res.json();
  },

  async createTransaction(data: any): Promise<Transaction> {
    const res = await fetch(`${API_BASE}/api/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create transaction");
    return res.json();
  },

  async updateTransaction(id: string, data: any): Promise<Transaction> {
    const res = await fetch(`${API_BASE}/api/transactions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update transaction");
    return res.json();
  },

  async deleteTransaction(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/transactions/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete transaction");
  },

  // Goals
  async getGoals(): Promise<Goal[]> {
    const res = await fetch(`${API_BASE}/api/goals`);
    if (!res.ok) throw new Error("Failed to fetch goals");
    return res.json();
  },

  async createGoal(data: any): Promise<Goal> {
    const res = await fetch(`${API_BASE}/api/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create goal");
    return res.json();
  },

  async updateGoal(id: string, data: any): Promise<Goal> {
    const res = await fetch(`${API_BASE}/api/goals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update goal");
    return res.json();
  },

  async deleteGoal(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/goals/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete goal");
  },

  // AI
  async getAiMessages(): Promise<AiMessage[]> {
    const res = await fetch(`${API_BASE}/api/ai/messages`);
    if (!res.ok) throw new Error("Failed to fetch AI messages");
    return res.json();
  },

  async sendAiMessage(message: string): Promise<{ userMessage: AiMessage; assistantMessage: AiMessage }> {
    const res = await fetch(`${API_BASE}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error("Failed to send AI message");
    return res.json();
  },

  async clearAiMessages(): Promise<{ success: boolean; welcomeMessage: AiMessage }> {
    const res = await fetch(`${API_BASE}/api/ai/messages`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to clear AI messages");
    return res.json();
  }
};
