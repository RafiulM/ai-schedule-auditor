# AI Schedule Auditor

A modern AI-powered schedule management application that helps users plan, audit, and optimize their daily and weekly schedules through natural language conversation. Simply tell the AI what you have planned—meetings, workouts, focus blocks—and the system parses your input, stores structured events, and provides actionable insights.

## 🌟 Key Features

- 🤖 **AI-Powered Chat Interface** - Natural language schedule input using GPT-4
- 🔐 **Secure Authentication** - User signup/signin with Better Auth
- 📅 **Smart Calendar Dashboard** - Visual schedule overview with analytics
- 📊 **Time Analytics** - Meeting density, free-time ratio, and focus block insights
- 🎨 **Modern UI/UX** - Beautiful, responsive design with dark mode support
- ⚡ **Real-time Processing** - Sub-2-second AI response times
- 🗄️ **Type-safe Database** - PostgreSQL with Drizzle ORM
- 🐳 **Docker Ready** - Complete containerized development setup

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router with Turbopack)
- **Language:** TypeScript
- **Authentication:** [Better Auth](https://better-auth.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **AI Integration:** [OpenAI GPT-4](https://openai.com/) via [Vercel AI SDK](https://sdk.vercel.ai/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (New York style)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Chat Interface:** [assistant-ui](https://assistant-ui.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Theming:** [next-themes](https://github.com/pacocoursey/next-themes)

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** installed
- **Docker and Docker Compose** (for PostgreSQL)
- **OpenAI API key** (for AI chat functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RafiulM/ai-schedule-auditor.git
   cd ai-schedule-auditor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration (see Environment Variables section)
   ```

4. **Start the development database**
   ```bash
   npm run db:up
   ```

5. **Initialize the database schema**
   ```bash
   npm run db:push
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration (defaults work with Docker setup)
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Authentication
BETTER_AUTH_SECRET=your_very_secure_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# AI Configuration (Required for chat functionality)
OPENAI_API_KEY=your_openai_api_key_here
```

### Getting Your OpenAI API Key

1. Visit [OpenAI API](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Add the key to your `.env` file

## 📁 Project Structure

```
ai-schedule-auditor/
├── app/                        # Next.js app router pages
│   ├── api/                   # API routes
│   │   └── chat/              # AI chat endpoint
│   ├── dashboard/             # Protected dashboard route
│   ├── sign-in/              # Authentication pages
│   ├── sign-up/              # User registration
│   ├── globals.css           # Global styles with dark mode
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Landing page
├── components/                # React components
│   ├── ui/                   # shadcn/ui components
│   └── chat/                 # Chat interface components
├── db/                        # Database configuration
│   ├── index.ts              # Database connection
│   └── schema/               # Database schemas (users, events, insights)
├── hooks/                     # Custom React hooks
├── lib/                       # Utility functions
│   ├── auth.ts               # Better Auth configuration
│   └── utils.ts              # General utilities
├── drizzle.config.ts         # Drizzle ORM configuration
├── docker-compose.yaml       # Docker services configuration
└── Dockerfile                # Application container definition
```

## 🔧 Development Commands

### Application
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database
- `npm run db:up` - Start PostgreSQL in Docker
- `npm run db:down` - Stop PostgreSQL container
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:reset` - Reset database (drop and recreate)

### Docker
- `npm run docker:build` - Build application Docker image
- `npm run docker:up` - Start full application stack
- `npm run docker:down` - Stop all containers

## 💡 How It Works

### 1. Natural Language Input
Users simply type or speak their schedule plans:
- "I have a team meeting at 9 AM tomorrow and a gym session at 5 PM"
- "Block out 2 hours for focused work on Wednesday afternoon"
- "Add a lunch break at 12:30 PM today"

### 2. AI-Powered Parsing
The AI chat endpoint processes natural language and extracts:
- Event titles and descriptions
- Date and time information
- Event types (meetings, focus blocks, breaks, etc.)
- Recurrence patterns

### 3. Structured Storage
All parsed events are stored in a structured database with:
- User-specific data isolation
- Type-safe schema with Drizzle ORM
- Full audit trail of changes

### 4. Visual Dashboard
The calendar dashboard provides:
- Interactive calendar view with all events
- Analytics cards showing:
  - Meeting density by week
  - Free-time ratio
  - Focus block distribution
  - Productivity insights

## 🚀 Deployment

### Option 1: Vercel (Recommended)

1. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Configure Environment Variables in Vercel Dashboard**
   - `DATABASE_URL`: Your managed PostgreSQL connection string
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `BETTER_AUTH_SECRET`: Generate a secure secret
   - `BETTER_AUTH_URL`: Your Vercel deployment URL

3. **Setup Production Database**
   ```bash
   # Push schema to your managed database
   npm run db:push
   ```

### Option 2: Docker Deployment

1. **Configure Production Environment**
   ```bash
   cp .env.example .env.production
   # Edit with production values
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Production Environment Variables

```env
# Required for production
DATABASE_URL=postgresql://user:password@host:port/database
OPENAI_API_KEY=your_production_openai_key
BETTER_AUTH_SECRET=generate-a-very-secure-32-character-key
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com

# Optional optimizations
NODE_ENV=production
```

## 📊 Database Schema

The application uses four main tables:

- **`users`** - User authentication and profile information
- **`events`** - Structured schedule events with AI parsing metadata
- **`chat_messages`** - Complete chat history for context and debugging
- **`ai_insights`** - Computed analytics and productivity recommendations

## 🔒 Security Features

- **Secure Authentication** - Password hashing with bcrypt
- **Session Management** - Secure HTTP-only cookies
- **Data Isolation** - User-specific data separation
- **Environment Security** - No hardcoded secrets
- **CORS Protection** - Proper cross-origin configuration
- **Input Validation** - Type-safe database operations

## 🎯 Key Success Metrics

- **Sub-2-second AI response times** for real-time interaction
- **99.9% uptime** with proper error handling
- **Intuitive onboarding** with < 3 steps to first schedule entry
- **Mobile-responsive** design for on-the-go scheduling
- **GDPR compliant** data handling and user privacy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Troubleshooting Guide](docs/troubleshooting.md)
2. Search existing [GitHub Issues](https://github.com/RafiulM/ai-schedule-auditor/issues)
3. Create a new issue with detailed information about your problem

## 🔮 Roadmap

### Version 1.1 (Planned)
- [ ] Calendar drag-and-drop event editing
- [ ] Event recurrence patterns
- [ ] Time zone support
- [ ] Mobile app (React Native)

### Version 2.0 (Future)
- [ ] External calendar integration (Google Calendar, Outlook)
- [ ] Team scheduling features
- [ ] Advanced AI scheduling suggestions
- [ ] Email/SMS notifications

---

**Built with ❤️ using modern web technologies**