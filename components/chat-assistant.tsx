"use client";

import { useChatRuntime } from "@assistant-ui/react";
import { ChatContainer, ChatMessage, MessageInput, Thread } from "@assistant-ui/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

export function MyAssistant() {
  const runtime = useChatRuntime({
    api: "/api/chat",
  });

  return (
    <ChatContainer runtime={runtime}>
      <Thread welcome="Hello! I'm your AI time management assistant. Tell me about your schedule, daily activities, or time management goals, and I'll help you optimize your routine!">
        <ChatMessage
          components={{
            UserAvatar: () => (
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            ),
            AssistantAvatar: () => (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-600 text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            ),
          }}
        />
      </Thread>
      <MessageInput />
    </ChatContainer>
  );
}