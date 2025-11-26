# Security Guidelines for AI Schedule Auditor

This document outlines security standards and best practices tailored to the **AI Schedule Auditor** full-stack application. It aligns with industry principles—Security by Design, Least Privilege, Defense in Depth—and addresses the specific architecture, technologies, and workflows of this repository.

---

## 1. Security by Design & Governance

- **Embed security early:** Integrate security reviews into every sprint and pull request. Use threat modeling to identify risks in AI function calling, chat flows, and database interactions.
- **Secure defaults:** Ship all components (Next.js, PostgreSQL, Docker, Vercel) with hardened configurations. Disable debug modes in production (`NEXT_PUBLIC_VERCEL_ENV` checks).
- **Least privilege:** Grant minimal permissions:
  - Database users can only read/write specific schemas (`auth`, `schedule`).
  - Vercel serverless functions run with a restricted IAM role.
- **Defense in depth:** Combine multiple controls at each layer—network (TLS), application (input validation), database (row-level security).

---

## 2. Authentication & Access Control

### 2.1 Robust Authentication
- Use **Better Auth** with:
  - Strong password policy: minimum 12 characters, mixed case, digits, symbols.
  - Secure hashing: Argon2 or bcrypt (configured in Better Auth). Unique salts per user.
- Enforce **Multi-Factor Authentication (MFA)** for privileged or admin accounts via TOTP (email or authenticator apps).

### 2.2 Session Management
- Generate unpredictable session tokens. Store cookies with `HttpOnly`, `Secure`, `SameSite=Strict`.
- Implement idle (e.g., 15 min) and absolute (e.g., 24 h) timeouts in sessions.
- On logout, revoke sessions in database and invalidate tokens.

### 2.3 Role-Based Access Control (RBAC)
- Define roles: `user`, `admin`, `auditor`.
- Server-side check in every API route (`app/api/chat`, schedule endpoints) to ensure only authorized roles can perform sensitive operations (e.g., deleting events, system audits).
- Use middleware in Next.js App Router to validate tokens and permissions.

---

## 3. Input Validation & Output Encoding

### 3.1 Chat & AI Function Input
- Sanitize chat messages to strip control characters before passing to LLM.
- Validate structured parameters returned from function calling:
  - Date format (ISO 8601), time zones.
  - Duration within acceptable bounds (e.g., 5 min–24 h).
  - String lengths and allowed characters for event name/location.

### 3.2 Preventing Injection Attacks
- Use **Drizzle ORM** with parameterized queries exclusively—never interpolate raw values.
- Escape user-supplied values in any SQL or command contexts.

### 3.3 XSS & Template Injection
- In React/Next.js, do not use `dangerouslySetInnerHTML` on untrusted content.
- Use context-aware encoding via built-in React escaping.
- Define a strict **Content Security Policy (CSP)** header:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' https://cdn.jsdelivr.net; img-src 'self' data:; frame-ancestors 'none';
  ```

---

## 4. Data Protection & Privacy

### 4.1 Encryption
- **In transit:** Enforce HTTPS (TLS 1.2+) for all origins. Redirect HTTP to HTTPS in Vercel config.
- **At rest:** Enable PostgreSQL encryption (e.g., AWS RDS encryption) and disk encryption for Docker volumes.

### 4.2 Secrets Management
- Do **not** hardcode API keys, DB credentials, or AI service tokens. Use:
  - Vercel Environment Variables (encrypted).
  - Docker secrets for local development.
  - Optionally, integrate AWS Secrets Manager or Vault for production.

### 4.3 Sensitive Data Handling
- Avoid storing PII in logs. Mask or truncate any personal identifiers in chat transcripts.
- Implement a **data deletion** workflow for user-initiated account removal: cascade delete chat history, events, and sessions.
- Comply with GDPR/CCPA: inform users about data retention, provide export and erase mechanisms.

---

## 5. API & Service Security

### 5.1 Secure API Endpoints
- **TLS only:** All `/api/*` routes served over HTTPS.
- **Rate limiting & throttling:** Implement at the edge or via middleware (e.g., Next.js Rate Limit package) for `/api/chat` to mitigate brute-force and DoS.
- **CORS:** Restrict origins to your frontend domains:
  ```js
  // Example Next.js middleware
  export function middleware(req) {
    const origin = req.headers.get('origin')
    if (origin !== 'https://yourapp.com') return new Response(null, { status: 403 })
  }
  ```

### 5.2 Input Sanitization in APIs
- Re-validate user identity (`getUser()` or `getSession()`) on every request.
- Use a schema validation library (e.g., Zod) for JSON payloads in API routes.

---

## 6. Web Application Security Hygiene

- **CSRF Protection:** Use anti-CSRF tokens for all state-changing POST/PUT/DELETE forms and fetch requests. NextAuth/Better Auth may provide built-in utilities.
- **Security Headers:** Configure in `next.config.js` headers array:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: no-referrer-when-downgrade`
  - `X-Frame-Options: DENY`
- **Secure Cookies:** All cookies set with `Secure`, `HttpOnly`, and `SameSite=Strict`.
- **Subresource Integrity (SRI):** When importing external scripts (e.g., CDN for Tailwind), include integrity hashes.

---

## 7. Infrastructure & Configuration Management

- **Hardened Docker Images:** Use minimal base images (e.g., `node:alpine`), run as non-root user.
- **Port Exposure:** Only expose necessary ports (3000 for app, 5432 for DB behind network firewall).
- **Automatic Updates:** Scan and update OS packages and npm dependencies regularly. Leverage Dependabot or Snyk.
- **Disable Dev Features in Prod:** Ensure `NEXT_PUBLIC_VERCEL_ENV !== 'development'` to disable verbose logging and React devtools.

---

## 8. Dependency Management

- **Software Composition Analysis (SCA):** Integrate tools like Snyk or GitHub Dependabot to detect CVEs in dependencies (`drizzle-orm`, `@ai-sdk/react`, `shadcn/ui`).
- **Lockfiles:** Commit `package-lock.json`/`yarn.lock` and `Pipfile.lock` if applicable to ensure deterministic builds.
- **Minimize Footprint:** Audit your dependencies; remove unused packages (e.g., unused analytics scripts).

---

## 9. Logging, Monitoring & Incident Response

- **Centralized Logging:** Ship application logs to a secure service (e.g., Sentry, Datadog). Scrub sensitive data before logging.
- **Alerting:** Configure alerts on error rate spikes, rate limit breaches, or anomalous authentication events.
- **Incident Playbook:** Document steps for handling data breaches, compromised secrets, or unauthorized access.

---

## 10. Testing & Validation

- **Automated Tests:** Write unit tests for utility functions and integration tests for API routes using **Vitest** or **Jest**.
- **Penetration Testing:** Conduct periodic security assessments and automated scanning (e.g., OWASP ZAP).
- **Continuous Integration:** Incorporate linting, type checks, SCA scans, and security tests into CI pipeline on every PR.

---

## Conclusion
By adhering to these guidelines, the AI Schedule Auditor application will maintain a robust security posture throughout development, deployment, and production operations. Regularly revisit and update these practices to adapt to new threats and evolving project requirements.