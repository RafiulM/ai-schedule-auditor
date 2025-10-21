# Backend Structure Document

## 1. Backend Architecture

Our backend is built on the Next.js App Router, leveraging its API routes for all server-side logic. We use familiar design patterns to keep the code organized and maintainable:

- **API Route Handlers**: Each feature has its own endpoint file under `/app/api`, following RESTful conventions. 
- **Modular Services**: Business logic lives in standalone modules (for example, an `aiService` or `scheduleService`) that API routes call. This separation makes it easy to add or replace features without affecting unrelated parts.
- **ORM Layer**: Drizzle ORM provides a type-safe, query builder layer between our Node.js code and PostgreSQL. It ensures compile-time checks on table and column names.

This setup supports:

- **Scalability**: Next.js API routes can be deployed serverlessly or on containers. Drizzle and PostgreSQL scale independently, and queries are optimized with indexes.
- **Maintainability**: Clear directory structure, modular services, and TypeScript typings help developers understand and update code quickly.
- **Performance**: We use server-side rendering only where needed (dashboard data), while real-time chat interactions happen in client components, keeping latency low.

## 2. Database Management

We chose PostgreSQL (a relational SQL database) for its reliability and strong querying capabilities. Key points:

- **Drizzle ORM**: A TypeScript-first ORM that generates SQL under the hood. It prevents runtime errors by validating table and column names at build time.
- **Data Organization**:
  - `users`: authentication and profile data
  - `schedules`: metadata grouping events by date or project
  - `events`: individual calendar entries (title, start/end times, type)
  - `chat_messages`: user–assistant conversation history
  - `ai_insights`: computed insights or recommendations tied to schedules
- **Migrations & Seeding**: We use Drizzle’s migration tool to evolve schemas safely. A seeding script populates sample data for testing and local development.
- **Backups & Retention**: Automated daily database backups, with a 7-day retention policy to guard against accidental data loss.

## 3. Database Schema

Below is a human-readable overview, followed by the SQL definition for PostgreSQL.

**Entities & Relationships**

- **User**: has many Schedules and Chat Messages
- **Schedule**: belongs to a User, has many Events and Insights
- **Event**: belongs to a Schedule and a User
- **Chat Message**: belongs to a User
- **AI Insight**: belongs to a Schedule

**PostgreSQL Schema**

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedules
CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  schedule_id INT REFERENCES schedules(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  event_type VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- AI Insights
CREATE TABLE ai_insights (
  id SERIAL PRIMARY KEY,
  schedule_id INT REFERENCES schedules(id) ON DELETE CASCADE,
  insight TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```  

## 4. API Design and Endpoints

We use RESTful-style Next.js API routes under `/app/api`. Key endpoints:

- **Authentication** (`/app/api/auth/[...nextauth]`)
  - Sign up, sign in, and session management via Better Auth.
- **Chat** (`/app/api/chat/route.ts`)
  - POST: Accepts user message, streams AI response via Vercel AI SDK, and optionally saves events or messages through Drizzle.
- **Schedules** (`/app/api/schedules/route.ts`)
  - GET: Fetches all schedules for the authenticated user.
  - POST: Creates a new schedule entry.
- **Events** (`/app/api/events/route.ts`)
  - GET: Retrieves events for a given schedule.
  - POST: Adds a new event parsed from chat or direct input.
- **Insights** (`/app/api/insights/route.ts`)
  - GET: Returns AI-generated insights for a schedule.

Endpoints enforce authentication middleware so only logged-in users can access or modify their data.

## 5. Hosting Solutions

We deploy the backend to **Vercel**, which offers:

- **Serverless Functions**: Automatic scaling of API routes without server management.
- **Global Edge Network**: Low-latency delivery for both static assets and API responses.
- **Integrated CI/CD**: Every commit triggers a build and deploy, ensuring the latest code is live quickly.

For local development and containerized hosting, we use Docker & Docker Compose. This mirrors production by running:

- A **Node.js** container for the Next.js app
- A **PostgreSQL** container for the database

## 6. Infrastructure Components

- **Load Balancing & Edge**: Vercel’s global edge network balances traffic across regions automatically.
- **CDN**: Static assets (JavaScript, CSS, images) are cached at edge nodes for fast delivery.
- **Caching**:
  - **SWR** or **React Query** on the frontend caches API responses.
  - **Database query caching** via PostgreSQL’s built-in caching and indexes.
- **Docker**: Ensures reproducible environments for development and staging.

All components work together to deliver fast page loads, snappy API responses, and reliable uptime.

## 7. Security Measures

- **Authentication & Authorization**: Better Auth handles secure session cookies and JWT tokens. All API routes check user identity and resource ownership.
- **Transport Security**: HTTPS enforced via Vercel.
- **Encryption**:
  - **In Transit**: TLS for all network traffic.
  - **At Rest**: PostgreSQL data volumes encrypted by default on managed hosting.
- **Environment Variables**: Secrets (database URL, AI API keys) stored securely in Vercel’s environment settings.
- **Input Validation**: All incoming data is validated and sanitized to prevent SQL injection or XSS.
- **Dependency Audits**: Regular `npm audit` and Dependabot PRs keep libraries up to date.

## 8. Monitoring and Maintenance

- **Logging**: Next.js logs and Vercel function logs provide request and error tracing.
- **Error Tracking**: Sentry (or a similar service) captures exceptions in production.
- **Performance Monitoring**: Vercel Analytics and database slow-query logs identify bottlenecks.
- **Health Checks**: Synthetic tests (via Pingdom or Uptime.com) monitor API endpoints.
- **Automated Migrations**: Drizzle’s migration tool runs schema updates as part of the CI pipeline.
- **Backup Rotation**: Daily database backups with automated cleanup of old snapshots.

## 9. Conclusion and Overall Backend Summary

Our backend is a modern, cloud-ready stack built around Next.js API routes, PostgreSQL, and Drizzle ORM. It balances developer productivity (TypeScript, modular services) with operational excellence (serverless scaling, CDN, edge caching). Key strengths:

- **Scalable**: Serverless functions and a managed database scale with user demand.
- **Secure**: Better Auth, HTTPS, and encryption protect user data.
- **Maintainable**: Clear code organization, type-safe ORM, and automated migrations streamline updates.
- **Performant**: Global edge network, CDNs, and caching deliver a fast user experience.

This setup aligns perfectly with the goal of an AI-powered schedule auditor: real-time chat, secure personal data handling, and an insightful dashboard—all delivered through a reliable, maintainable backend.