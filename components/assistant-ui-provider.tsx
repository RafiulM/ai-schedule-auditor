"use client";

import * as React from "react";
// The provider from assistant-ui to enable its context in the app
import { AssistantProvider } from "@assistant-ui/react";

export function AssistantUIProvider({ children }: { children: React.ReactNode }) {
  return <AssistantProvider>{children}</AssistantProvider>;
}
