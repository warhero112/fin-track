import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  currency: text("currency").notNull().default("USD"),
  language: text("language").notNull().default("en"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  amount: text("amount").notNull(), // Using text to avoid precision issues with decimal
  label: text("label").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(), // 'income' or 'expense'
  date: text("date").notNull(), // YYYY-MM-DD format
  createdAt: timestamp("created_at").defaultNow(),
});

// Goals table
export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  target: text("target").notNull(), // Using text to avoid precision issues with decimal
  current: text("current").notNull().default("0"),
  color: text("color").notNull().default("#007aff"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Messages table for conversation history
export const aiMessages = pgTable("ai_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
});

export const insertAiMessageSchema = createInsertSchema(aiMessages).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;

export type AiMessage = typeof aiMessages.$inferSelect;
export type InsertAiMessage = z.infer<typeof insertAiMessageSchema>;

// Additional schemas for validation
export const transactionFormSchema = insertTransactionSchema.extend({
  amount: z.string().min(1, "Amount is required"),
  label: z.string().min(1, "Description is required"),
});

export const goalFormSchema = insertGoalSchema.extend({
  target: z.string().min(1, "Target amount is required"),
  name: z.string().min(1, "Goal name is required"),
});

// Constants
export const CATEGORIES = [
  "Food", "Transportation", "Shopping", "Bills", "Utilities", 
  "Health", "Entertainment", "Travel", "Education", "Other", 
  "Salary", "Bonus"
] as const;

export const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs" }
] as const;

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "ja", name: "日本語" },
  { code: "si", name: "සිංහල" }
] as const;