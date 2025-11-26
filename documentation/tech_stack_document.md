# Tech Stack Document for AI Schedule Auditor

This document explains the technology choices behind the **AI Schedule Auditor** in simple terms. It shows how each part of the system works together to give users a smooth experience when managing and auditing their schedules using natural language.

## 1. Frontend Technologies
These are the tools that make up what users see and interact with in their web browser.

- **Next.js 15 (App Router)**
  - A React-based framework that lets us mix server-side rendering (SSR) and client-side rendering (CSR).
  - Helps pages load quickly and keeps the application responsive.

- **React 19**
  - A popular library for building user interfaces with reusable components.
  - Makes it easy to update parts of the screen when data changes.

- **shadcn/ui**
  - A collection of pre-built, accessible UI components (buttons, modals, cards, etc.).
  - Ensures consistency and saves design time.

- **Tailwind CSS v4**
  - A utility-first styling tool that allows precise control with small, composable classes.
  - Speeds up styling and keeps the CSS footprint small.

- **@ai-sdk/react & assistant-ui**
  - Components specifically designed for building a chat interface with AI.
  - Provide a friendly chat window where users type schedule descriptions.

- **SWR (or React Query)**
  - A data-fetching library that keeps views up to date by automatically reloading data in the background.
  - Improves perceived speed and reduces the need for manual refreshes.

## 2. Backend Technologies
These technologies power the server side, handle data processing, and keep information safe.

- **Next.js API Routes**
  - Simple serverless endpoints that live alongside the frontend code.
  - Handle chat messages, call the AI, and read/write data.

- **Better Auth**
  - A complete solution for user sign-up, sign-in, and session handling.
  - Works out of the box with secure password storage and session cookies.

- **PostgreSQL**
  - A reliable, open-source relational database.
  - Stores user accounts, chat history, and structured event data.

- **Drizzle ORM**
  - A type-safe way to talk to the database from TypeScript code.
  - Ensures database queries match the defined data models and catches errors early.

- **Vercel AI SDK**
  - Provides seamless access to large language models (GPT-4/GPT-4o).
  - Uses **function calling** to turn plain-English schedule descriptions into structured event objects.

## 3. Infrastructure and Deployment
This section covers where the app runs and how code changes go live.

- **Vercel Platform**
  - Hosts the entire application in a serverless environment and distributes it via a global edge network.
  - Automatically builds and deploys new commits for continuous integration/continuous deployment (CI/CD).

- **Docker & Docker Compose**
  - Enable a consistent local development setup matching production.
  - Containers package all dependencies so "it works on my machine" issues disappear.

- **Git & GitHub**
  - Version control system to track code changes, collaborate on features, and handle reviews.
  - Integrates with Vercel for automatic deployments on pull requests and merges.

## 4. Third-Party Integrations
These external services enhance functionality without reinventing the wheel.

- **Vercel AI SDK**
  - Ties into OpenAI’s GPT-4/GPT-4o models for natural language understanding.

- **Better Auth**
  - Manages secure user authentication flows.

- **Potential Add-Ons (Future)**
  - Analytics tools (e.g., Google Analytics or Plausible) to track usage patterns.
  - Error monitoring (e.g., Sentry) for catching runtime issues in production.

## 5. Security and Performance Considerations
How the app stays safe and fast for everyone.

- **Authentication & Sessions**
  - Better Auth handles password hashing, secure cookies, and session expiration.

- **Data Protection**
  - Environment variables store secrets (API keys, database URLs) out of code.
  - Database connections use SSL to encrypt data in transit.

- **Input Validation & Sanitization**
  - Server-side checks ensure AI-generated data matches expected formats (dates, times).
  - Protects against accidental or malicious bad data.

- **Rate Limiting (Recommended)**
  - Limiting API calls to `/api/chat` helps control costs and prevents abuse of AI endpoints.

- **Caching & Revalidation**
  - SWR and Vercel edge caching reduce repeated data fetches and speed up response times.

## 6. Conclusion and Overall Tech Stack Summary

We chose a modern JavaScript/TypeScript stack centered around **Next.js** and **React** for a fast, interactive frontend. On the backend, **Next.js API Routes**, **Better Auth**, and **Drizzle ORM** with **PostgreSQL** provide a secure, reliable foundation. The **Vercel AI SDK** powers the core feature—turning plain-language inputs into structured schedule events via AI function calling.

Docker and Vercel ensure consistent development environments and smooth deployments. Together, these technologies deliver a user-friendly, scalable, and maintainable application that turns everyday language into actionable schedule management and insights.