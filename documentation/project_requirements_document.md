# Project Requirements Document (PRD)

## 1. Project Overview

The AI Schedule Auditor is a full-stack, web-based assistant designed to help users plan, audit, and optimize their daily and weekly schedules through a natural language chat interface. Instead of juggling multiple calendars or manually entering events, users simply tell the AI what they have planned—meetings, workouts, focus blocks—and the system parses their input, stores structured events, and returns both confirmations and actionable insights.

We’re building this tool to solve two main problems: (1) the friction of manual calendar management, and (2) the lack of real-time, personalized feedback on how users spend their time. Key success criteria include seamless sign-up/sign-in, a responsive chat experience with sub-2-second reply times, accurate event parsing and storage, a clean calendar dashboard, and basic analytics (e.g., meeting density, free-time ratio) that help users spot and correct scheduling imbalances.

## 2. In-Scope vs. Out-of-Scope

### In-Scope (Version 1.0)
- User Authentication (sign-up, sign-in, session management) via Better Auth.  
- Natural language chat interface built with `assistant-ui` and `@ai-sdk/react`.  
- AI Chat API (`/api/chat`) using Vercel AI SDK and GPT-4 (or GPT-4o) for parsing schedule entries.  
- Structured data storage in PostgreSQL through Drizzle ORM (tables: `users`, `events`, `chat_messages`, `ai_insights`).  
- Protected Dashboard route with a calendar view (e.g., `react-big-calendar` or shadcn/ui calendar component) displaying stored events.  
- Metrics cards showing meeting density, free-time ratio, and focus blocks.  
- Basic theming (light/dark mode) using shadcn/ui and Tailwind CSS.  
- Docker + Docker Compose setup for local development and deployment.

### Out-of-Scope (Later Phases)
- Drag-and-drop event editing on the calendar.  
- Two-way sync with external calendars (Google Calendar, Outlook).  
- Mobile-only native apps (React Native, SwiftUI, etc.).  
- Team or group scheduling features (shared calendars).  
- Advanced AI suggestions (e.g., auto-rescheduling or priority reordering).

## 3. User Flow

A new user lands on the homepage and clicks “Sign Up.” They provide an email and password and verify their account. After authentication, they are redirected to the main chat page (`/chat`). Here, they type messages like “I have a team meeting at 9 AM tomorrow and a gym session at 5 PM.” The chat interface streams the AI’s response—confirming the meeting and gym session—and behind the scenes the `/api/chat` endpoint parses the text, creates structured event records in the database, and returns both text and JSON confirmations.

Once events are stored, the user navigates to the Dashboard (`/dashboard`). A calendar component visualizes the events by date and time. Alongside it, metric cards show a summary: number of meetings, total free time, and suggested focus blocks. If the user wants to add or adjust events, they return to the chat page, enter new details, and see updates reflected immediately on the dashboard. This loop continues as they refine their schedule.

## 4. Core Features

- **Authentication & Authorization**  
  • Sign-up, sign-in, and secure session handling with Better Auth.  
  • Protected routes (`/dashboard`, `/chat`).  

- **Chat-Based Schedule Input**  
  • Frontend built with `assistant-ui` components and `@ai-sdk/react` hooks.  
  • Sends user messages to `/api/chat` and streams AI responses.  

- **AI Chat API**  
  • Next.js API route (`app/api/chat/route.ts`).  
  • Uses Vercel AI SDK + GPT-4 (or GPT-4o) with function calling.  
  • Parses natural language into structured JSON (fields: title, date, startTime, endTime, type).  

- **Database & ORM**  
  • PostgreSQL for persistent storage.  
  • Drizzle ORM for type-safe schema definitions: `events`, `chat_messages`, `ai_insights`.  

- **Dashboard & Calendar View**  
  • Calendar component showing events by day/week.  
  • Metric cards (meeting count, free-time ratio, focus blocks).  

- **Insights Engine**  
  • Server-side functions that compute simple analytics.  
  • Stores insights in `ai_insights` table for history and trend analysis.  

- **Theming & UI**  
  • shadcn/ui component library with Tailwind CSS.  
  • Dark mode toggle.  

- **Containerization & Deployment**  
  • Dockerfiles for the Next.js app and PostgreSQL service, plus Docker Compose.  

## 5. Tech Stack & Tools

- Frontend:  
  • Next.js 15 (App Router) with React 19.  
  • shadcn/ui components, Tailwind CSS v4.  

- Backend & Data:  
  • Next.js API Routes.  
  • Better Auth for authentication.  
  • PostgreSQL (v14+) and Drizzle ORM.  

- AI & Machine Learning:  
  • Vercel AI SDK (function calling).  
  • OpenAI GPT-4 or GPT-4o model.  

- Tools & Infrastructure:  
  • TypeScript for static typing.  
  • Docker & Docker Compose.  
  • Testing: Vitest or Jest (unit), Playwright (end-to-end).  

- Optional IDE Integrations:  
  • Cursor or Windsurf extensions for AI-powered code suggestions.  

## 6. Non-Functional Requirements

- **Performance**:  
  • Chat responses streamed within 1–2 seconds.  
  • Dashboard page load under 300 ms (server-side render).  

- **Security**:  
  • HTTPS everywhere, secure HTTP headers (CSP, HSTS).  
  • Password hashing, session cookies with `SameSite` and `Secure`.  
  • Environment variables for secrets, no hard-coding of API keys.  

- **Compliance & Privacy**:  
  • GDPR compliance for personal data (users can delete account and data).  
  • Data encryption at rest (PostgreSQL encryption) and in transit.  

- **Usability & Accessibility**:  
  • WCAG 2.1 AA accessibility standards.  
  • Responsive design for desktop and tablet screens.  

- **Scalability & Reliability**:  
  • Support for 1,000+ concurrent users.  
  • Proper error handling and retry logic on AI calls.  

## 7. Constraints & Assumptions

- Must have access to GPT-4 (or GPT-4o) via Vercel AI SDK; rate limits apply.  
- PostgreSQL v14+ and Docker required in development environment.  
- Assumes modern browsers (Chrome, Firefox, Safari) with ES6 support.  
- Next.js version locked to 15.x for App Router compatibility.  
- User’s schedule data is private—no public sharing or social features in v1.0.  

## 8. Known Issues & Potential Pitfalls

- **API Rate Limits**:  
  • OpenAI usage may exceed free or paid tiers—monitor usage and implement exponential back-off.  

- **Streaming & CORS**:  
  • Handling SSE (Server-Sent Events) streaming in Next.js routes can be tricky; test thoroughly.  

- **Database Migrations**:  
  • Drizzle migrations may need manual review for complex schema changes—always run in staging first.  

- **Calendar Performance**:  
  • Rendering hundreds of events can be slow; consider virtualization or event clustering.  

- **Error Handling**:  
  • AI or database failures should surface user-friendly messages in chat; log errors server-side for later debugging.  

By following this PRD, the AI Schedule Auditor will have a clear blueprint for its first release: an intuitive chat interface backed by solid authentication, reliable data storage, basic analytics, and a user-friendly dashboard. This document leaves no ambiguity about scope, tech choices, or core flows, ensuring development can proceed smoothly and confidently.