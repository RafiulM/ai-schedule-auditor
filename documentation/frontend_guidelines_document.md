# Frontend Guideline Document

This document lays out the frontend architecture, design principles, and technologies used in the AI Schedule Auditor project. It’s written in clear everyday language so anyone can understand how the frontend is set up, why decisions were made, and how to work with it.

## 1. Frontend Architecture

### Frameworks and Libraries
- **Next.js 15 (App Router)**: Handles routing, server-side rendering (SSR), and client-side rendering (CSR) in one framework.
- **React 19**: Powers reusable UI components and stateful logic.
- **shadcn/ui**: A headless component library built on Tailwind CSS for consistent, accessible UI elements.
- **Tailwind CSS v4**: Provides utility-first styling for rapid, responsive design.
- **@ai-sdk/react & assistant-ui**: Offer ready-made chat components for the AI conversation interface.
- **SWR (or React Query)** (implied): Manages client-side data fetching and caching.

### Supporting Scalability, Maintainability, and Performance
- **Server Components & Client Components**: Next.js splits logic where it runs best, reducing bundle size and improving load times.
- **Code Splitting**: Automatic in Next.js—each page only loads what it needs.
- **Modular Structure**: Pages, components, and utilities are in dedicated folders (`app/`, `components/`, `lib/`), making it easy to find, update, and extend code.
- **Type Safety**: TypeScript across the board (including Drizzle ORM schemas) reduces bugs and makes refactoring safer.

## 2. Design Principles

### Key Principles
- **Usability**: Simple, conversational chat interface—no complex forms to fill.
- **Accessibility**: Components from shadcn/ui follow WAI-ARIA guidelines, and Tailwind’s classes make it easy to maintain color contrast.
- **Responsiveness**: Layouts adapt gracefully from mobile to desktop using Tailwind’s responsive utilities.
- **Consistency**: A shared component library and theme ensures a familiar look and behavior everywhere.

### Applying These Principles
- **Chat Interface**: Clear message bubbles, consistent padding, and an obvious input area.
- **Dashboard**: Card layouts and charts adjust to screen size; keyboard navigation and semantic HTML tags support screen readers.
- **Forms and Buttons**: Uniform styling and focus states make interactive elements easy to spot and use.

## 3. Styling and Theming

### Styling Approach
- **Utility-First with Tailwind CSS**: Compose UI directly in JSX with Tailwind classes for margin, padding, colors, and typography.
- **No Additional CSS Methodology**: Relying on Tailwind avoids custom BEM or SMACSS overhead.
- **Dark Mode Support**: Class-based dark mode (`.dark`) configured in `tailwind.config.js`.

### Theming
- **Theme Provider**: Defined at `app/layout.tsx` to wrap the app and allow light/dark toggling.
- **Global Tokens**: Colors, spacing, and typography live in `tailwind.config.js` so they’re easy to update.

### Visual Style
- Clean, **modern flat design** with subtle shadows and rounded corners.
- Slight **glassmorphism** effect on the chat panel (semi-transparent background + backdrop blur).

### Color Palette
- Primary: `#4F46E5` (indigo-600)
- Primary Light: `#EEF2FF` (indigo-100)
- Primary Dark: `#4338CA` (indigo-700)
- Secondary: `#22D3EE` (cyan-400)
- Accent: `#FACC15` (yellow-400)
- Background: `#FFFFFF` (light mode), `#111827` (dark mode)
- Surface/Card: `#F3F4F6` (gray-100), `#1F2937` (gray-800)
- Text: `#111827` (gray-900), `#E5E7EB` (gray-200 in dark)

### Fonts
- **Inter** (variable): A clean, legible sans-serif font loaded globally.

## 4. Component Structure

### Organization
- **`app/`**: Page folders follow Next.js App Router conventions, each with its own `page.tsx` and optionally `layout.tsx` and `loading.tsx`.
- **`components/`**:
  - **`chat-assistant.tsx`**: Client component for the AI chat interface.
  - **`dashboard/`**: Subfolder with `calendar-view.tsx`, `metrics-chart.tsx`, and `summary-cards.tsx`.
  - **`ui/`**: Shadcn/ui building blocks (buttons, inputs, modals) customized for this project.
  - **`auth-buttons.tsx`**: Sign-in, sign-up, and sign-out controls.

### Reusability
- Common UI elements (buttons, cards, form controls) are in `components/ui/`—import these rather than rebuilding styles.
- Dashboard components share layout utilities (grid, flex) to stay consistent.

### Benefits of Component-Based Architecture
- **Maintainability**: Fix or update one component, and every place that uses it updates automatically.
- **Testability**: Isolated components are easier to unit-test.
- **Speed**: Developers pick from a library of pre-built pieces rather than starting from scratch.

## 5. State Management

### Approach
- **Local State**: Chat input and UI toggles via React’s `useState` or `useReducer` inside client components.
- **Server State**: Fetched schedule and event data managed by **SWR** (or React Query), with caching, revalidation, and optimistic updates when creating events.

### Sharing State
- Custom hooks (e.g., `useScheduleData`) wrap SWR calls and expose data, loading, and error states to multiple components.
- Context API is available for global settings (e.g., theme, user session) but used sparingly to avoid overuse.

## 6. Routing and Navigation

### Routing
- **Next.js App Router**: File-based routing under `app/`. Each folder with `page.tsx` becomes a route.
- **API Routes**: Under `app/api/`, routes like `/api/chat` handle server logic.

### Navigation Structure
- **Global Layout** (`app/layout.tsx`): Wraps pages with header, footer, and theme provider.
- **Header/Nav Bar**: Links to Dashboard (`/dashboard`), Chat (`/dashboard` or integrated), and Sign-in/Sign-out.
- **Protected Routes**: Middleware or server checks redirect unauthenticated users to `/sign-in`.

## 7. Performance Optimization

### Strategies
- **Lazy Loading**: Components that aren’t needed immediately (charts, calendar) are dynamically imported.
- **Image Optimization**: Next.js `<Image>` component automatically resizes and lazy-loads images.
- **Code Splitting**: Built into Next.js so each route only ships its own code.
- **CSS Purging**: Tailwind’s JIT removes unused utility classes from production builds.

### Impact on User Experience
- Faster initial load and interactive times.
- Reduced bandwidth usage, especially on mobile.
- Smooth transitions when navigating between pages.

## 8. Testing and Quality Assurance

### Testing Strategies
- **Unit Tests**: Use **Vitest** or **Jest** to test individual React components and utility functions.
- **Integration Tests**: Verify how components work together (e.g., chat-assistant sends message to API). 
- **End-to-End (E2E) Tests**: Tools like **Playwright** or **Cypress** simulate real user flows: sign-in, chat, calendar updates.
- **Visual Regression**: Use **Storybook** + **Chromatic** to catch unintended UI changes.

### Tools and Frameworks
- **ESLint** & **Prettier**: Enforce code style and catch syntax errors.
- **TypeScript**: Type checks at build time.
- **GitHub Actions**: Run linting, type checks, and tests on every pull request.
- **Sentry** (optional): For runtime error monitoring in production.

## 9. Conclusion and Overall Frontend Summary

The AI Schedule Auditor frontend combines modern web best practices with a clear structure:
- **Next.js** and **React** for flexible rendering.
- **Tailwind CSS** and **shadcn/ui** for a consistent, accessible design system.
- **AI Chat UI** to capture user input naturally.
- **SWR** for smooth data loading and cache management.

These guidelines ensure the application is easy to understand, maintain, and extend. By following them, developers can keep the interface fast, reliable, and user-friendly while aligning with the project’s goal of making schedule management simple and intelligent.