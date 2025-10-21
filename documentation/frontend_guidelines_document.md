# Frontend Guideline Document

This document explains how the frontend of the AI Schedule Auditor application is structured, the principles behind its design, and the tools and techniques used. It is written in everyday language, so anyone—technical or not—can follow along.

## 1. Frontend Architecture

### Framework and Libraries
- **Next.js 15 (App Router)**: Serves as the backbone. It supports both server-rendered and client-rendered components, giving us flexibility to optimize performance.
- **React 19**: The main UI library. We use it to build interactive components like the chat interface and calendar.
- **shadcn/ui**: A set of prebuilt, accessible React components styled with Tailwind CSS. It ensures a consistent look and feel across the app.
- **Tailwind CSS v4**: A utility-first CSS framework for rapid styling without writing long custom stylesheets.
- **TypeScript**: Adds type safety, catching errors early and making code easier to understand.

### How It Supports Scalability, Maintainability, and Performance
- **Server and Client Components**: Heavy data fetching (dashboard) runs on the server for speed, while interactive parts (chat) run in the browser for responsiveness.
- **Modular Folder Structure**: Features live under `/app`, shared UI bits under `/components`, and database logic under `/db`. This separation keeps code easy to find and change.
- **API Routes in Next.js**: Backend logic (like the chat endpoint) lives alongside frontend code, enabling tight integration and fewer external dependencies.
- **Code Splitting and Lazy Loading**: Next.js automatically splits bundles. We can also lazy-load components (e.g., the calendar) so users only download what they need.

## 2. Design Principles

We follow these core principles to create a user-friendly interface:

1. **Usability**: Every button, form, and interaction is designed to be straightforward. For example, chat messages clearly show when the assistant is typing or processing.
2. **Accessibility**: We use semantic HTML, ARIA labels, focus outlines, and ensure color contrast meets WCAG standards. This makes the app usable for people with disabilities.
3. **Responsiveness**: The layout adapts to screens of all sizes. On mobile, the calendar stacks vertically; on desktop, it sits alongside metrics cards.
4. **Clarity**: Information is grouped logically. The chat area, schedule view, and metrics each have distinct spaces so users aren’t overwhelmed.

### Applying These Principles
- Forms and buttons have clear labels and error messages.
- Interactive elements (like calendar events) have hover and focus states.
- The color palette and font choices maintain readability.

## 3. Styling and Theming

### Styling Approach
- **Tailwind CSS**: Utility classes (e.g., `p-4`, `text-gray-700`, `bg-primary-500`) let us style components directly in the markup, avoiding long external CSS files.
- **No CSS-in-JS**: All styling is done via Tailwind, ensuring consistent performance and easy theming.

### CSS Methodology
- We rely on Tailwind’s utility-first approach rather than BEM or SMACSS. This results in fewer naming conflicts and faster iteration.

### Theming
- **Dark Mode Support**: Built in via a `dark:` variant in Tailwind. Users can switch between light and dark themes, and the preference is saved in localStorage.

### Visual Style
- **Modern Flat Design with Glassmorphism Touches**: Clean, minimal shapes with occasional translucent panels (e.g., chat background) to add depth.

### Color Palette
- Primary: #4F46E5 (indigo-600)
- Secondary: #10B981 (emerald-500)
- Accent: #F59E0B (amber-500)
- Neutral Light: #F3F4F6 (gray-100)
- Neutral Dark: #1F2937 (gray-800)
- Danger: #EF4444 (red-500)

### Typography
- **Font Family**: Inter, for its readability and modern feel.
- Headings: 600 weight
- Body Text: 400 weight

## 4. Component Structure

### Organization
- `/app`: Contains top-level routes (e.g., `/chat`, `/dashboard`, plus `layout.tsx`).
- `/components`: Houses shared UI parts.
  - `/components/ui`: shadcn/ui overrides and wrappers.
  - `/components/ScheduleCalendar.tsx`: Custom calendar for the dashboard.
  - `/components/MetricCard.tsx`: Displays user metrics (e.g., meeting density).

### Reusability and Maintainability
- Each component does one thing. For example, `MetricCard` only renders a title, value, and optional chart.
- Props define data inputs, making components easy to test and reuse.
- Styles are scoped via Tailwind classes, so changes in one component don’t ripple unexpectedly.

## 5. State Management

### Approach
- **Local State**: React’s `useState` and `useReducer` for UI-specific states (e.g., toggling dark mode).
- **Global/Shared State**: React Context for theme and authentication info.
- **Server Data**: Next.js data fetching (server components) or **SWR**/**React Query** for client-side caching and revalidation.

### Chat and Schedule Flow
1. User sends a message in the chat (client state).
2. The message is POSTed to `/api/chat`.
3. The AI response streams back; we update the local message list.
4. On successful function calls, we revalidate the schedule data via SWR to refresh the calendar view.

## 6. Routing and Navigation

- **Next.js App Router**: File-based routing under `/app` directory.
- Pages:
  - `/chat/page.tsx`: The main chat interface (Client Component).
  - `/dashboard/page.tsx`: The schedule and metrics view (Server Component).
  - `/api/chat/route.ts`: Backend endpoint handling AI requests.
- **Navigation**: Next.js `Link` component for client-side transitions and prefetching.
- **Layout**: A shared header and sidebar in `layout.tsx` for consistent navigation.

## 7. Performance Optimization

- **React Server Components**: Offload data fetching to the server for faster first paint.
- **Image and Asset Optimization**: Next.js Image component & built-in asset hashing.
- **Tailwind Purge**: Removes unused CSS in production.
- **Lazy Loading**: Dynamic imports for heavy components like charts or the calendar.
- **Caching**: SWR/React Query caches schedule data and avoids redundant requests.

## 8. Testing and Quality Assurance

### Test Types
- **Unit Tests**: Vitest or Jest with React Testing Library for component logic.
- **Integration Tests**: Test interactions between components, such as chat input → API call → message list update.
- **End-to-End Tests**: Playwright to simulate user flows: sign-in, send a chat message, see it in the calendar.

### Tools and Configurations
- **ESLint**: Lint code for style and common errors.
- **Prettier**: Auto-formatting for consistent code style.
- **CI Pipeline**: Run linting, tests, and type checks on every push.

## 9. Conclusion and Overall Frontend Summary

To recap:
- We use **Next.js 15** with **React 19** for a hybrid rendering approach that balances performance and interactivity.
- **shadcn/ui** + **Tailwind CSS** power our modern, accessible design, with a flat aesthetic and subtle glassmorphism.
- A **component-based structure** keeps code modular and easy to maintain.
- **Context, SWR, and server components** manage state and data fetching smoothly.
- We optimize performance through server rendering, code splitting, and asset optimization.
- A testing strategy covering unit, integration, and end-to-end tests ensures reliability.

This setup aligns perfectly with the goal of building an AI-powered schedule auditor: fast, scalable, and user-friendly. Whether you’re adding new features or tweaking the UI, these guidelines will help you navigate the frontend codebase with confidence.
