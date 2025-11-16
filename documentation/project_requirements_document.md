# AI Schedule Auditor – Project Requirements Document (PRD)

## 1. Project Overview

**AI Schedule Auditor** is a full-stack web application that lets users manage, audit, and optimize their personal schedules through a simple chat interface. Instead of filling out forms or jumping between apps, you just tell the AI what you want—like “Schedule a meeting with Sarah next Monday at 2 PM for 30 minutes”—and behind the scenes the system extracts all the details as structured events. Those events are then stored in a database and displayed on a calendar and analytics dashboard.

This project aims to remove friction from schedule management and give actionable insights on how you spend your time. By combining natural language understanding (using GPT-4/GPT-4o via the Vercel AI SDK) with a clean UI (Next.js, React, Tailwind CSS), the app will let users quickly capture events, visualize their week or month, and eventually get efficiency recommendations. Success will be measured by: 1) parsing accuracy of extracted events, 2) chat response times under 1 second on average, 3) user adoption and retention metrics, and 4) system uptime of 99.9% or higher.

## 2. In-Scope vs. Out-of-Scope

### In-Scope (Version 1.0)
- **Natural Language Chat Interface**: Users can type or paste schedule details in plain English.
- **AI-Driven Event Extraction**: GPT-4/GPT-4o function calling extracts `eventName`, `date`, `time`, `duration`, `location`, etc.
- **User Authentication & Sessions**: Secure sign-up, sign-in, and session handling via Better Auth.
- **Data Persistence**: Store users, sessions, chat history, and events in PostgreSQL via Drizzle ORM.
- **Calendar View**: A responsive month/week calendar component showing extracted events.
- **Metrics Dashboard**: Simple charts and summary cards (e.g., total hours, event counts).
- **Basic Error Handling**: Clear feedback on parsing failures or API errors.
- **Containerized Local Dev & Cloud Deployment**: Docker Compose locally; Vercel production.

### Out-of-Scope (Planned for Later Phases)
- Recurring events or series scheduling.
- Conflict detection or automatic rescheduling suggestions.
- Push notifications, email reminders, or SMS alerts.
- Native mobile apps (iOS/Android).
- Integrations with external calendars (Google Calendar, Outlook).
- Advanced productivity analytics (e.g., unproductive time blocks, workload balancing).
- User feedback loop for AI corrections (thumbs up/down on parsing accuracy).

## 3. User Flow

When a new user lands on the site, they see a clean landing page with a “Sign Up” or “Sign In” button. After creating an account (or logging in), they’re taken to the **Dashboard**, which has a top navigation bar, a left-side menu (for “Calendar,” “Metrics,” “Settings”), and a main content area showing the current month’s calendar and summary cards (total events, total hours). A chat icon or panel sits in the bottom-right corner, inviting the user to “Tell me about your schedule.”

The user clicks the chat panel and types something like: “Add a 1-hour call with Marketing team tomorrow at 3 PM at Zoom.” The chat UI sends this message to the backend API, which authenticates the session, calls GPT-4o with function definitions, gets back structured event data, and writes it to the database. The chat then displays a confirmation (“Done! I’ve added ‘Call with Marketing team’ on [date] at 3 PM.”). The user closes the chat, refreshes (or waits for live update), and sees the new event appear on the calendar and reflected in the metrics.

## 4. Core Features

- **Authentication Module**
  • Sign-up / Sign-in forms using Better Auth.
  • Session cookies / tokens with secure HTTP-only flags.

- **Chat Interface Component**
  • Based on `@ai-sdk/react` and `assistant-ui`.
  • Sends user messages to `/api/chat` and streams AI responses.

- **AI Function Calling**
  • Define `create_event` function schema for GPT-4o.
  • Extract event fields: name, date, time, duration, location.
  • Graceful fallback when extraction fails.

- **API Route: `/api/chat`**
  • Authenticate user.
  • Forward messages to Vercel AI SDK.
  • Persist chat and event data via Drizzle ORM.
  • Return structured replies.

- **Dashboard Components**
  • `calendar-view.tsx`: Month/week grid showing events.
  • `metrics-chart.tsx`: Bar/pie charts for time distribution.
  • `summary-cards.tsx`: Key stats (total events, busiest day).

- **Database Layer**
  • PostgreSQL tables: `users`, `sessions`, `chat_messages`, `events`.
  • Drizzle ORM for type-safe queries and migrations.

- **Styling & UI Library**
  • Tailwind CSS v4 utility classes.
  • shadcn/ui for buttons, modals, form inputs.

- **Deployment & DevOps**
  • Docker Compose for local containers (app + Postgres).
  • Vercel serverless functions, edge caching, and CI/CD.

## 5. Tech Stack & Tools

- **Frontend**
  • Next.js 15 (App Router)
  • React 19
  • Tailwind CSS v4
  • shadcn/ui component library
  • `@ai-sdk/react`, `assistant-ui` for chat UI
  • SWR or React Query (data fetching)

- **Backend**
  • Next.js API Routes (`app/api/chat/route.ts`)
  • Better Auth (auth and session management)
  • Drizzle ORM (PostgreSQL adapter)
  • PostgreSQL (data persistence)

- **AI Integration**
  • Vercel AI SDK with GPT-4 / GPT-4o
  • Function calling for structured data extraction

- **Dev & Deployment**
  • Docker & Docker Compose (local dev)
  • Vercel for production (serverless + edge)
  • GitHub Actions (CI) implicitly via Vercel
  • Recommended IDE: VS Code with docker, Tailwind, and ESLint plugins

## 6. Non-Functional Requirements

- **Performance**: 
  • Chat API response shipped within 1 second (target).
  • Page load (First Contentful Paint) under 2 seconds.

- **Security**:
  • HTTPS everywhere; secure, HTTP-only session cookies.
  • Encryption for data at rest (PostgreSQL) and in transit.
  • OWASP Top 10 considerations (XSS, CSRF, SQL Injection) addressed via framework defaults and input validation.

- **Usability & Accessibility**:
  • WCAG 2.1 AA compliance for core flows.
  • Responsive design for desktop/tablet screens.
  • Clear error messages and loading states.

- **Reliability**:
  • 99.9% uptime SLA on production.
  • Automated alerts for failures via Vercel.

- **Scalability**:
  • Handle up to 10,000 monthly active users initially.
  • Plan for horizontal scaling of serverless functions.

## 7. Constraints & Assumptions

- **AI Model Availability**: Assumes GPT-4o (function calling) is accessible via Vercel AI SDK.
- **English-only Input**: MVP supports natural language in English.
- **Deploy Environment**: Production on Vercel; local dev via Docker.
- **No External Calendar Access**: MVP does not integrate with Google/Outlook APIs.
- **Database**: PostgreSQL instance must be provisioned separately (e.g., Vercel Postgres).

## 8. Known Issues & Potential Pitfalls

- **API Rate Limits & Costs**:
  • OpenAI/GPT calls have usage costs and rate limits.
  • Mitigation: implement per-user rate limiting, caching repeated queries, and fallback messages if limits are hit.

- **Parsing Ambiguities**:
  • Users may phrase dates/times unclearly ("next Monday" vs. exact date).
  • Mitigation: add disambiguation prompts ("Did you mean April 3rd?") or simple client-side date picker fallback.

- **AI Errors & Bias**:
  • Incorrect extractions could lead to bad data.
  • Mitigation: validate returned fields server-side (e.g., date format checks) and display error states.

- **Database Migrations**:
  • Schema changes require careful Drizzle migrations.
  • Mitigation: adopt a versioned migration strategy and test upgrades in staging.

- **Network Latency**:
  • Multiple round trips (chat UI → API → AI model → DB).
  • Mitigation: stream AI responses, show optimistic UI updates in chat, and batch DB writes when possible.

---
This PRD provides a clear, unambiguous blueprint of the AI Schedule Auditor MVP. All core requirements, boundaries, user journeys, and potential risks are outlined so that subsequent technical documents (Tech Stack Details, Frontend Guidelines, Backend Architecture, etc.) can be created confidently without additional clarifications.