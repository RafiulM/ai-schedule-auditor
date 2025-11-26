# Backend Structure Document for AI Schedule Auditor

## 1. Backend Architecture

The backend is built on Next.js API Routes, combining serverless functions with a modern JavaScript/TypeScript stack. Key design choices include:

-  **Framework & Serverless Functions**: 
   - Next.js App Router powers both pages and API endpoints under `/app/api`.  
   - Each API route runs as a lightweight serverless function, scaling automatically.
-  **Modular Layers & Design Patterns**:
   - Routes layer (`app/api`) handles HTTP requests and authentication.  
   - Service layer (inside API routes) manages business logic (e.g., AI calls, validation).  
   - Data layer (`db/` with Drizzle ORM) abstracts database interactions with type-safe queries.
-  **Scalability & Performance**:
   - Serverless functions spin up on demand, so the backend scales to match traffic.  
   - Cold starts are minimized by Vercel’s edge network.  
   - Caching strategies (e.g., edge caching for static data, SWR on the client) speed up repeated fetches.  
-  **Maintainability**:
   - Clear separation of concerns: routing, business logic, data access, and utilities.  
   - Type-safe code with TypeScript and Drizzle ORM prevents many runtime errors.  
   - Environment configurations (via `.env`) centralize secrets and connection strings.

## 2. Database Management

All persistent data lives in PostgreSQL, an industry-standard relational database. Data management practices include:

-  **Technology & ORM**:
   - PostgreSQL as the primary data store.  
   - Drizzle ORM provides type-safe schema definitions and query builders in TypeScript.  
-  **Data Organization**:
   - Authentication data (users, sessions) in separate tables under an `auth` schema.  
   - Application data (events and chat messages) in tables under a `schedule` schema.  
-  **Access Patterns**:
   - CRUD operations for events and chat messages via Drizzle queries in API routes.  
   - Indexed columns (e.g., `user_id`, `event_date`) speed up searches and date-based queries.  
-  **Data Practices**:
   - Migrations handled by Drizzle’s migration tool to evolve schema safely.  
   - Connection pooling (managed by Vercel and pg library) ensures database connections stay healthy.  

## 3. Database Schema

### Human-Readable Description

-  **Users Table** stores user profile and login credentials.  
-  **Sessions Table** tracks active sessions and tokens for each user.  
-  **Events Table** holds structured schedule entries (name, date, time, duration, location).  
-  **Chat Messages Table** logs raw user messages and AI responses, linked to events when applicable.

### SQL Schema (PostgreSQL)

```sql
-- Authentication Schema
CREATE TABLE auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE auth.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedule Schema
CREATE TABLE schedule.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration INTERVAL NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE schedule.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK(role IN ('user','ai')) NOT NULL,
  content TEXT NOT NULL,
  related_event_id UUID REFERENCES schedule.events(id),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```  

## 4. API Design and Endpoints

The backend exposes a RESTful interface via Next.js API routes. Main endpoints include:

-  **POST `/api/chat`**  
   - Purpose: Process user messages, call the AI model, extract structured event data, and save both messages and events.  
   - Flow:  
     1. Authenticate request via session token.  
     2. Forward message to Vercel AI SDK with function definitions.  
     3. Receive AI response and function call output.  
     4. Persist new event (if created) and chat message.  
     5. Return AI reply to the client.

-  **GET `/api/events`**  
   - Purpose: Fetch a user’s events for display in the dashboard.  
   - Supports query parameters like date ranges or sorting.

-  **GET `/api/chat/history`**  
   - Purpose: Retrieve past chat messages for conversation continuity.

-  **Auth Endpoints** (handled by Better Auth under the hood):  
   - Sign-up, sign-in, sign-out, session validation.

Each endpoint performs input validation, authenticates the user, and returns JSON payloads with clear status codes (200, 401, 500).

## 5. Hosting Solutions

We host the backend on Vercel’s serverless platform, complemented by local Docker setups for development:

-  **Vercel (Production)**:
   - Serverless functions automatically deploy from the `main` branch.  
   - Global edge network accelerates content delivery and reduces latency.  
   - Built-in CI/CD runs on each push, ensuring zero-downtime deployments.  
-  **Docker & Docker Compose (Local Dev)**:
   - Containers for Next.js app and local PostgreSQL instance.  
   - Ensures consistent environments and easy onboarding.

Benefits:
-  Scalability: Functions scale per request.  
-  Reliability: Automatic retries and health checks.  
-  Cost-Effectiveness: Pay-per-use billing for serverless invocations.

## 6. Infrastructure Components

Key components work together to ensure high performance:

-  **Load Balancing**: Handled by Vercel’s global edge network, distributing requests across the nearest region.  
-  **CDN**: Static assets and frontend pages cached at the edge for low latency.  
-  **Caching Mechanisms**:
   - Edge caching for static resources managed by Vercel.  
   - Client-side caching with SWR or React Query to minimize redundant API calls.  
-  **Database Connection Pool**: Managed by the `pg` library with pooling settings, preventing overload.  
-  **Container Network** (Dev): Docker Compose links app and database containers over a private network.

## 7. Security Measures

We follow industry best practices to protect user data and comply with privacy standards:

-  **Authentication & Authorization**:
   - Better Auth manages sign-up, sign-in, password hashing, and sessions.  
   - Drizzle adapter stores session tokens securely in PostgreSQL.  
   - API routes validate session tokens on every request.
-  **Data Encryption**:
   - HTTPS enforced on all endpoints.  
   - Database connections secured with TLS.  
   - Environment secrets stored in Vercel’s secret manager and never committed to code.
-  **Input Validation & Rate Limiting**:
   - Server-side validation for all incoming data.  
   - Future enhancement: rate limiting on `/api/chat` to prevent abuse.
-  **Vulnerability Protection**:
   - Regular dependency audits (npm audit) and security patches.  
   - HTTP headers (CSP, HSTS) configured to prevent common web attacks.

## 8. Monitoring and Maintenance

To keep the backend reliable and performant, we use:

-  **Logging & Error Tracking**:
   - Application logs via Vercel’s built-in logging dashboard.  
   - Integration with Sentry or a similar service for exception tracking (recommended).  
-  **Performance Monitoring**:
   - Vercel Analytics for function latency and error rates.  
   - Database metrics (CPU, connections, query times) via a managed Postgres dashboard.
-  **Maintenance Strategies**:
   - Automated migrations on deployment using Drizzle’s CLI.  
   - Scheduled dependency updates and security reviews.  
   - Backup policies: Regular automated database backups through the cloud provider.

## 9. Conclusion and Overall Backend Summary

The AI Schedule Auditor’s backend is a modern, serverless architecture that balances scalability, maintainability, and performance:

-  **Serverless API** on Vercel ensures auto-scaling and global reach.  
-  **PostgreSQL + Drizzle ORM** delivers robust data management with type safety.  
-  **Better Auth** guarantees secure authentication and session handling.  
-  **AI Integration** via Vercel AI SDK and function calling enables seamless natural language processing.  
-  **Infrastructure**—from edge caching to containerized dev environments—provides consistency and speed.

Together, these components empower users to manage schedules through an intuitive chat interface while giving the development team a clear, modular, and secure foundation to build upon.