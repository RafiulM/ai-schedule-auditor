"use client";

import * as React from "react";
import { Thread, Composer, Message } from "@assistant-ui/react";

export default function ChatInterface() {
  return (
    <div className="flex flex-col h-[500px] rounded-lg border bg-card">
      <div className="flex-1 overflow-y-auto p-4">
        <Thread>
          <Message />
        </Thread>
      </div>
      <div className="border-t p-3">
        <Composer placeholder="Tell me about your schedule..." />
      </div>
    </div>
  );
}
