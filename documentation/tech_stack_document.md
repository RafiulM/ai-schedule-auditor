# Tech Stack Document for AI Schedule Auditor

This document explains, in everyday language, the technology choices behind the AI Schedule Auditor project. It highlights how each piece fits together so that anyone—technical or not—can understand why we picked it and how it makes the app work smoothly.

## 1. Frontend Technologies

Our goal on the frontend is a fast, interactive user interface that feels modern and cohesive. Here’s what we chose:

- Next.js 15 (App Router)
  - Provides a clear structure for pages and routes.
  - Lets us use Server Components for data-heavy pages (like the dashboard) and Client Components for interactive parts (like chat).
- React 19
  - A popular, well-supported library for building user interfaces with reusable components.
- shadcn/ui
  - A ready-made component library (buttons, cards, modals) that follows a consistent design style.
  - Ensures the chat interface (`assistant-ui`) and dashboard look like they belong together.
- assistant-ui & @ai-sdk/react
  - Specialized chat components and hooks for integrating our AI assistant.
  - Makes it easy to build a conversational interface without styling or streaming logic from scratch.
- Tailwind CSS v4
  - A utility-first CSS framework for rapid, precise styling.
  - Lets us customize layouts, colors, and spacing with simple class names.
- Optional enhancements for smoother data loading:
  - SWR or React Query for client-side data caching, automatic refresh, and error handling.

## 2. Backend Technologies

Behind the scenes, the backend handles user data, schedules, and AI requests. Here’s the stack:

- Next.js API Routes
  - Serverless endpoints integrated directly into the app.
  - We use `/api/auth` for authentication and `/api/chat` for processing chat messages.
- Better Auth
  - Manages secure sign-up, sign-in, and user sessions.
  - Keeps each user’s schedule and chat history private.
- Vercel AI SDK
  - Streams AI model responses with built-in support for function calling.
  - Lets us parse user messages, save events to the database, and send insights back in real time.
- PostgreSQL
  - A reliable, open-source relational database ideal for structured data like user accounts, events, and analytics.
- Drizzle ORM & drizzle-kit
  - Type-safe database queries and migrations written in TypeScript.
  - Ensures our database schema (users, schedules, events, chat_messages, ai_insights) stays in sync with code.
- Utilities and testing tools:
  - Vitest or Jest for unit tests (verifying our data processing and API logic).
  - Playwright for end-to-end tests (simulating user flows like chatting and viewing the calendar).

## 3. Infrastructure and Deployment

We chose infrastructure setups that make development smooth and production stable:

- Docker & Docker Compose
  - Containers for the Next.js app and PostgreSQL database.
  - Guarantees everyone on the team runs the same environment.
- Version Control with Git & GitHub
  - Tracks code changes, supports pull requests, and enables collaboration.
- CI/CD Pipeline (e.g., GitHub Actions)
  - Automatically runs linting, tests, and builds on each commit.
  - Deploys to a hosting service (like Vercel or AWS) when changes are merged to main.
- Hosting Platform (e.g., Vercel)
  - Optimized for Next.js, offers instant static optimization and serverless functions.
  - Simplifies scaling and global content delivery.

## 4. Third-Party Integrations

We rely on a few external services to avoid reinventing the wheel and provide robust features:

- Better Auth
  - Secure user authentication and session management without building our own auth system.
- Vercel AI SDK
  - Streamlines AI model integration and function calling for chat features.
- Optional analytics and monitoring (not yet implemented but easily added):
  - Google Analytics, Plausible, or another analytics tool for tracking user engagement.
  - Sentry or LogRocket for error tracking and performance monitoring.

## 5. Security and Performance Considerations

We want users to trust our app with their private data and enjoy a smooth experience:

- Security Measures:
  - Authentication with Better Auth ensures only logged-in users access their data.
  - Environment variables for secret keys (AI credentials, database URLs) kept out of source code.
  - HTTPS enforced in production to encrypt all data in transit.
  - Prepared statements and parameterized queries via Drizzle ORM to prevent SQL injection.
- Performance Optimizations:
  - Server Components in Next.js for faster initial load on data-heavy pages.
  - Streaming responses from the AI to show chat messages in real time.
  - Caching strategies with SWR or React Query to avoid unnecessary network calls.
  - Tailwind’s optimized build process removes unused styles, keeping CSS bundles small.

## 6. Conclusion and Overall Tech Stack Summary

The AI Schedule Auditor combines proven, modern technologies to deliver a secure, responsive, and visually consistent application:

- **Frontend**: Next.js 15 + React 19 + Tailwind CSS + shadcn/ui + assistant-ui
- **Backend**: Next.js API Routes + Better Auth + Vercel AI SDK + PostgreSQL + Drizzle ORM
- **Infrastructure**: Docker, GitHub (Git + Actions), Vercel
- **Security & Performance**: HTTPS, environment variables, server-side rendering, caching, streaming AI

Together, these choices support our goal: a friendly, conversational AI assistant that helps users build, visualize, and optimize their daily schedules with minimal friction. Each technology was selected for its reliability, developer experience, and ability to scale as the application grows.