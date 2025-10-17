import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertGoalSchema, insertAiMessageSchema } from "@shared/schema";
import Anthropic from "@anthropic-ai/sdk";

export async function registerRoutes(app: Express): Promise<Server> {
  const DEMO_USER_ID = "demo-user-001";

  // Initialize Anthropic client
  const anthropic = process.env.ANTHROPIC_API_KEY 
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

  // User routes
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(DEMO_USER_ID);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/user", async (req, res) => {
    try {
      const { currency, language } = req.body;
      const user = await storage.updateUser(DEMO_USER_ID, { currency, language });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions(DEMO_USER_ID);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validated = insertTransactionSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID
      });
      const transaction = await storage.createTransaction(validated);
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/transactions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await storage.updateTransaction(id, req.body);
      
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTransaction(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Goal routes
  app.get("/api/goals", async (req, res) => {
    try {
      const goals = await storage.getGoals(DEMO_USER_ID);
      res.json(goals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const validated = insertGoalSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID
      });
      const goal = await storage.createGoal(validated);
      res.json(goal);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/goals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const goal = await storage.updateGoal(id, req.body);
      
      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }
      
      res.json(goal);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/goals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteGoal(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Goal not found" });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI Message routes
  app.get("/api/ai/messages", async (req, res) => {
    try {
      const messages = await storage.getAiMessages(DEMO_USER_ID);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      // Store user message
      const userMessage = await storage.createAiMessage({
        userId: DEMO_USER_ID,
        role: "user",
        content: message
      });

      if (!anthropic) {
        // Fallback response when API key not available
        const fallbackResponse = await storage.createAiMessage({
          userId: DEMO_USER_ID,
          role: "assistant",
          content: "I'm your AI financial advisor! To enable full AI-powered insights, please add your Anthropic API key. In the meantime, I can see you're doing well with your finances!"
        });
        
        return res.json({
          userMessage,
          assistantMessage: fallbackResponse
        });
      }

      // Get conversation history
      const history = await storage.getAiMessages(DEMO_USER_ID);
      const recentHistory = history.slice(-10); // Last 10 messages

      // Get user's financial data for context
      const transactions = await storage.getTransactions(DEMO_USER_ID);
      const goals = await storage.getGoals(DEMO_USER_ID);
      
      // Calculate financial metrics
      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthTx = transactions.filter(t => t.date.startsWith(currentMonth));
      const income = monthTx.filter(t => t.type === "income").reduce((s, t) => s + parseFloat(t.amount), 0);
      const expenses = monthTx.filter(t => t.type === "expense").reduce((s, t) => s + parseFloat(t.amount), 0);
      const savingsRate = income > 0 ? ((income - expenses) / income * 100) : 0;

      // Create context prompt
      const systemPrompt = `You are a helpful AI financial advisor for FinTrack, a personal finance application. 
You have access to the user's financial data and should provide personalized, actionable advice.

Current Financial Summary:
- Monthly Income: $${income.toFixed(2)}
- Monthly Expenses: $${expenses.toFixed(2)}
- Savings Rate: ${savingsRate.toFixed(1)}%
- Number of Transactions: ${transactions.length}
- Active Goals: ${goals.length}

${goals.length > 0 ? `Goals:
${goals.map(g => `- ${g.name}: $${g.current} / $${g.target} (${(parseFloat(g.current) / parseFloat(g.target) * 100).toFixed(1)}%)`).join('\n')}` : ''}

Provide clear, concise, and encouraging financial advice. Be specific and reference their actual data when relevant.
Keep responses under 150 words unless they ask for detailed analysis.`;

      // Call Anthropic API
      const completion = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          ...recentHistory.map(m => ({
            role: m.role as "user" | "assistant",
            content: m.content
          }))
        ]
      });

      const assistantContent = completion.content[0].type === 'text' 
        ? completion.content[0].text 
        : "I apologize, I couldn't generate a response.";

      // Store assistant message
      const assistantMessage = await storage.createAiMessage({
        userId: DEMO_USER_ID,
        role: "assistant",
        content: assistantContent
      });

      res.json({
        userMessage,
        assistantMessage
      });
    } catch (error: any) {
      console.error("AI Chat error:", error);
      res.status(500).json({ error: error.message || "Failed to process AI request" });
    }
  });

  app.delete("/api/ai/messages", async (req, res) => {
    try {
      await storage.clearAiMessages(DEMO_USER_ID);
      
      // Create initial welcome message
      const welcomeMessage = await storage.createAiMessage({
        userId: DEMO_USER_ID,
        role: "assistant",
        content: "Hi! I'm your AI financial advisor. I can help you analyze your spending, set better goals, optimize your budget, and answer any financial questions. What would you like to know about your finances?"
      });
      
      res.json({ success: true, welcomeMessage });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
