"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export function MyAssistant() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Hello! I&apos;m your AI time management assistant. Tell me about your schedule, daily activities, or time management goals, and I&apos;ll help you optimize your routine!
          </div>
        )}
        {messages.map((message) => {
          console.log('Message:', message); // Debug log to see message structure
          return (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-600 text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {message.parts && message.parts.length > 0 ? (
                message.parts.map((part, index) => {
                  console.log('Part:', part); // Debug log to see part structure
                  if (part.type === "text") {
                    return (
                      <div key={index}>
                        {part.text}
                      </div>
                    );
                  }
                  // Handle tool outputs
                  if (part.type && part.type.startsWith('tool-') && (part as any).output) {
                    return (
                      <div key={index}>
                        {(part as any).output}
                      </div>
                    );
                  }
                  // Handle step-start parts (usually empty)
                  if (part.type === "step-start") {
                    return null;
                  }
                  return null;
                })
              ) : (
                <div className="text-gray-500 italic">
                  No content available
                </div>
              )}
            </div>
            {message.role === "user" && (
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          );
        })}
        {(status === 'submitted' || status === 'streaming') && (
          <div className="flex gap-3 justify-start">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-blue-600 text-white">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
              Thinking...
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Tell me about your schedule..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={status !== 'ready'}
          />
          <button
            type="submit"
            disabled={status !== 'ready' || !input?.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}