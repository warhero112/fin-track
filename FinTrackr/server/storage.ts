import { 
  type User, 
  type InsertUser,
  type Transaction,
  type InsertTransaction,
  type Goal,
  type InsertGoal,
  type AiMessage,
  type InsertAiMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Transaction operations
  getTransactions(userId: string): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: string): Promise<boolean>;
  
  // Goal operations
  getGoals(userId: string): Promise<Goal[]>;
  getGoal(id: string): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, goal: Partial<InsertGoal>): Promise<Goal | undefined>;
  deleteGoal(id: string): Promise<boolean>;
  
  // AI Message operations
  getAiMessages(userId: string): Promise<AiMessage[]>;
  createAiMessage(message: InsertAiMessage): Promise<AiMessage>;
  clearAiMessages(userId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private transactions: Map<string, Transaction>;
  private goals: Map<string, Goal>;
  private aiMessages: Map<string, AiMessage>;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.goals = new Map();
    this.aiMessages = new Map();
    
    // Initialize with demo user
    const demoUser: User = {
      id: "demo-user-001",
      name: "FinTrack User",
      email: "user@fintrack.app",
      currency: "USD",
      language: "en",
      createdAt: new Date()
    };
    this.users.set(demoUser.id, demoUser);
    
    // Initialize AI messages with welcome message
    const welcomeMessage: AiMessage = {
      id: randomUUID(),
      userId: "demo-user-001",
      role: "assistant",
      content: "Hi! I'm your AI financial advisor. I can help you analyze your spending, set better goals, optimize your budget, and answer any financial questions. What would you like to know about your finances?",
      createdAt: new Date()
    };
    this.aiMessages.set(welcomeMessage.id, welcomeMessage);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      name: insertUser.name,
      email: insertUser.email,
      currency: insertUser.currency || "USD",
      language: insertUser.language || "en",
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Transaction operations
  async getTransactions(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: string, transactionData: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...transactionData };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    return this.transactions.delete(id);
  }

  // Goal operations
  async getGoals(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values())
      .filter(g => g.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getGoal(id: string): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const goal: Goal = {
      id,
      userId: insertGoal.userId,
      name: insertGoal.name,
      target: insertGoal.target,
      current: insertGoal.current || "0",
      color: insertGoal.color || "#007aff",
      createdAt: new Date()
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: string, goalData: Partial<InsertGoal>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;
    
    const updatedGoal = { ...goal, ...goalData };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  async deleteGoal(id: string): Promise<boolean> {
    return this.goals.delete(id);
  }

  // AI Message operations
  async getAiMessages(userId: string): Promise<AiMessage[]> {
    return Array.from(this.aiMessages.values())
      .filter(m => m.userId === userId)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async createAiMessage(insertMessage: InsertAiMessage): Promise<AiMessage> {
    const id = randomUUID();
    const message: AiMessage = {
      ...insertMessage,
      id,
      createdAt: new Date()
    };
    this.aiMessages.set(id, message);
    return message;
  }

  async clearAiMessages(userId: string): Promise<boolean> {
    const userMessages = Array.from(this.aiMessages.values())
      .filter(m => m.userId === userId);
    
    userMessages.forEach(m => this.aiMessages.delete(m.id));
    return true;
  }
}

export const storage = new MemStorage();
