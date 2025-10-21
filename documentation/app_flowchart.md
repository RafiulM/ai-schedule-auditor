flowchart TD
    Start[Start] --> Auth[User Authentication]
    Auth --> ChatPage[Chat interface]
    ChatPage --> APIChat[Call chat api]
    APIChat --> AISDK[Vercel AI SDK]
    AISDK --> DB[Database operations]
    DB --> AISDK
    AISDK --> ChatResponse[AI response]
    ChatResponse --> ChatPage
    ChatPage --> Dashboard[View Dashboard]
    Dashboard --> DB
    DB --> Dashboard
    Dashboard --> CalendarDisplay[Render calendar and metrics]