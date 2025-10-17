import AIChat from '../AIChat';
import { useState } from 'react';

const initialMessages = [
  {
    id: "1",
    role: "assistant" as const,
    content: "Hi! I'm your AI financial advisor. I can help you analyze your spending, set better goals, optimize your budget, and answer any financial questions. What would you like to know about your finances?",
    timestamp: new Date()
  }
];

const quickSuggestions = [
  "How can I improve my savings rate?",
  "Analyze my spending patterns",
  "Help me optimize my budget",
  "Should I adjust my goals?"
];

export default function AIChatExample() {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: "Thank you for your question! Based on your financial data, I can see some opportunities for improvement. Let me analyze your spending patterns and provide personalized recommendations.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="h-96 border border-border rounded-lg overflow-hidden">
      <AIChat
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        quickSuggestions={quickSuggestions}
      />
    </div>
  );
}