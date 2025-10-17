import { Bot, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date | null;
}

interface AIChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  quickSuggestions?: string[];
}

export default function AIChat({ 
  messages, 
  onSendMessage, 
  isLoading, 
  quickSuggestions = [] 
}: AIChatProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              data-testid={`message-${message.role}-${message.id}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-border text-card-foreground'
              }`}>
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Bot size={16} className="text-primary" />
                    <span className="text-xs font-medium text-primary">AI Advisor</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.createdAt && (
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border text-card-foreground max-w-xs px-4 py-2 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Bot size={16} className="text-primary" />
                  <span className="text-xs font-medium text-primary">AI Advisor</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Suggestions */}
      {quickSuggestions.length > 0 && (
        <div className="px-4 py-2">
          <ScrollArea orientation="horizontal">
            <div className="flex gap-2 pb-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(suggestion)}
                  className="flex-shrink-0 text-xs"
                  data-testid={`button-suggestion-${index}`}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-background border-t border-border">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your finances..."
            disabled={isLoading}
            className="flex-1"
            data-testid="input-ai-message"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            data-testid="button-send-message"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}