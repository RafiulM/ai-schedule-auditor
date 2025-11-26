# AI Schedule Auditor

A modern web application that transforms how you manage your schedule through natural language interaction with an AI assistant. Instead of traditional calendar interfaces, simply chat with an AI to add events, audit your time usage, and receive personalized productivity insights.

## ✨ Key Features

- 🤖 **AI Chat Assistant** - Natural language interface powered by GPT-4o for schedule management
- 📅 **Smart Calendar View** - Visual calendar with color-coded event types
- 📊 **Analytics Dashboard** - Time allocation metrics and productivity insights
- 🔐 **Secure Authentication** - User accounts with Better Auth
- 💾 **Persistent Storage** - PostgreSQL database with Drizzle ORM
- 🌙 **Dark Mode** - Full dark mode support with system preference detection
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS v4
- 🚀 **Real-time Updates** - Live chat streaming with Vercel AI SDK

## 🛠 Tech Stack

### Frontend
- **Next.js 15** with App Router and Turbopack
- **React 19** for user interface components
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **shadcn/ui** component library (40+ pre-built components)
- **@ai-sdk/react** and **assistant-ui** for chat interface
- **Lucide React** for icons

### Backend & AI
- **Next.js API Routes** for serverless functions
- **Better Auth** for authentication and session management
- **Drizzle ORM** with PostgreSQL adapter
- **Vercel AI SDK** with OpenAI GPT-4o
- **Zod** for schema validation

### Database
- **PostgreSQL** as primary data store
- **Drizzle Kit** for database migrations and studio

### Development & Deployment
- **Docker & Docker Compose** for local development
- **Vercel** for production deployment

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following:
- Node.js 18+ installed
- Docker and Docker Compose (for database setup)
- OpenAI API key (for AI functionality)

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

3. **Environment Variables Setup**
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` with your configuration:
     ```env
     # Database Configuration (defaults work with Docker)
     DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres
     POSTGRES_DB=postgres
     POSTGRES_USER=postgres
     POSTGRES_PASSWORD=postgres

     # Authentication
     BETTER_AUTH_SECRET=your_secret_key_here
     BETTER_AUTH_URL=http://localhost:3000
     NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

     # OpenAI Configuration
     OPENAI_API_KEY=your_openai_api_key_here
     ```

4. **Start the development server**
   ```bash
   # Start PostgreSQL with Docker
   npm run db:up

   # Push database schema
   npm run db:push

   # Start the development server
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** with your browser

## 📖 Usage

### 1. Sign Up / Sign In
- Create a new account or sign in to access the AI assistant
- Your data is securely stored and associated with your account

### 2. Chat with AI Assistant
Once logged in, you can interact with the AI assistant using natural language:

**Add Events:**
- "Schedule a team meeting tomorrow at 2 PM for 1 hour"
- "Add gym workout every Monday and Thursday at 6 AM"
- "I have a doctor's appointment next Friday at 10:30 AM"

**Get Insights:**
- "How much time did I spend in meetings this week?"
- "What's my productivity pattern like?"
- "Suggest ways to optimize my schedule"

### 3. View Calendar & Analytics
- Navigate to the Dashboard to see your schedule in calendar format
- View analytics to understand time allocation patterns
- Color-coded events for different categories (meetings, work, personal, etc.)

### 4. AI-Generated Insights
The AI provides personalized recommendations based on:
- Your time allocation patterns
- Meeting density and scheduling conflicts
- Productivity trends
- Work-life balance analysis

## 🗄 Database Schema

The application uses the following main tables:

- **events** - Stores schedule events with title, description, start/end times, and type
- **chat_messages** - Logs conversation history between user and AI
- **ai_insights** - Stores AI-generated insights and recommendations
- **users/sessions** - Authentication data managed by Better Auth

## 🛠 Development Commands

### Application
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database
- `npm run db:up` - Start PostgreSQL in Docker
- `npm run db:down` - Stop PostgreSQL container
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Drizzle migration files
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:reset` - Reset database (drop all tables and recreate)

### Docker
- `npm run docker:build` - Build application Docker image
- `npm run docker:up` - Start full application stack (app + database)
- `npm run docker:down` - Stop all containers
- `npm run docker:logs` - View container logs

## 🚀 Deployment

### Production Deployment on Vercel

1. **Deploy to Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Add Environment Variables in Vercel Dashboard:**
   - `DATABASE_URL`: Your managed PostgreSQL connection string
   - `BETTER_AUTH_SECRET`: Generate a secure secret
   - `BETTER_AUTH_URL`: Your Vercel deployment URL
   - `NEXT_PUBLIC_BETTER_AUTH_URL`: Your Vercel deployment URL
   - `OPENAI_API_KEY`: Your OpenAI API key

3. **Setup Database:**
   ```bash
   # Push schema to your managed database
   npm run db:push
   ```

### Docker Deployment

1. **Configure environment variables** with production values
2. **Deploy:**
   ```bash
   npm run docker:up
   ```

## 🎨 Event Types

The application supports the following event categories, each with its own color:

- 🔵 **Meeting** - Professional meetings and calls
- 🟢 **Work** - Focused work sessions
- 🟡 **Focus** - Deep work or study sessions
- 🔴 **Break** - Rest and relaxation periods
- 🟠 **Exercise** - Physical activities and workouts
- 🟣 **Meal** - Breakfast, lunch, dinner
- ⚪ **Personal** - Personal activities and appointments
- 🔘 **Other** - Miscellaneous events

## 🔒 Security Features

- Secure authentication with Better Auth
- Session-based authentication with secure cookies
- Type-safe database operations with Drizzle ORM
- Environment variable configuration for sensitive data
- SQL injection prevention with parameterized queries

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Optimized for desktop, tablet, and mobile devices
- Touch-friendly interface elements
- Adaptive layouts for different screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing [Issues](https://github.com/RafiulM/ai-schedule-auditor/issues)
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## 🗺 Project Roadmap

- [ ] Mobile app development
- [ ] Integration with Google Calendar and Outlook
- [ ] Advanced analytics and reporting
- [ ] Team collaboration features
- [ ] AI-powered scheduling recommendations
- [ ] Time tracking integration
- [ ] Multi-language support

---

Built with ❤️ by [Rafiul Islam](https://github.com/RafiulM)