# Orion ✨

A personal AI assistant with deep calendar, task management, document creation and web search integrations — powered by AI.

**[Live Demo →](https://orion-inky-six.vercel.app/)**

---

## Overview

Orion is an intelligent personal assistant that seamlessly integrates with your calendar, tasks, and the web to help you stay organized and productive. Built with modern web technologies, it features a polished interface with streaming responses, intelligent memory extraction, and real-time document generation.

---

## Sample Interactions

**Calendar Management:**
> "What's on my calendar this week?"

> "Find a 30-minute slot for a call tomorrow afternoon"

> "Create a meeting with John next Tuesday at 2pm about the new project"

**Task Management:**
> "Show me my todos and what's overdue"

> "Add 'Review PR #123' to my Todoist for tomorrow"

**Knowledge & Research:**
> "Create a document about React Server Components for my team presentation"

> "Search for the latest news about AI agents"

**Memory System:**
> "Remember that I prefer morning meetings before 11am"

**Image-to-Event:**
> *[Uploads event flyer image]* → Automatically extracts details and creates calendar event

---

## Features

### AI Chat Interface
- Clean, polished chat UI with streaming responses and real-time updates
- Multi-modal input supporting text and image uploads
- Artifacts system with streaming document generation in side panel
- Custom UI components for each AI tool response
- Persistent conversation history with intelligent memory extraction (RAG)
- Command palette (⌘K / Ctrl+K) for quick chat search

### Integrations

| Integration | Capabilities |
|-------------|--------------|
| **Google Calendar** | View events, create new events with natural language, find available time slots |
| **Todoist** | Fetch existing tasks, create new tasks, toggle task completion status |
| **Web Search** | Real-time web search powered by Tavily with synthesized, sourced answers |
| **Documents** | Generate well-structured markdown documents with streaming updates |

### Memory System

Orion uses an intelligent memory extraction system that identifies and stores important user preferences, personal facts, habits, and communication styles. The system employs a multi-stage pipeline:

1. **Keyword Filtering** — Quick pre-filter to identify messages potentially containing lasting information
2. **AI Decision Gate** — Claude Haiku determines if information is worth remembering (filters out temporary tasks and one-off requests)
3. **Structured Extraction** — Extracts specific memories with categories (preferences, facts, habits, goals)
4. **Embedding Storage** — Stores memories with semantic embeddings (OpenAI text-embedding-3-small) for contextual understanding

Memories are automatically injected into the system prompt to personalize responses naturally across all conversations.

### Additional Features
- **Authentication** — Secure Google OAuth via Supabase with automatic token refresh
- **Theme Support** — Light, dark, and system themes with persistent preferences
- **Image-to-Event** — Upload event flyers and Orion extracts details using Claude's vision capabilities to create calendar events
- **Responsive Design** — Optimized for desktop and mobile with adaptive layouts

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.0.10 with App Router |
| Frontend | React 19.2.0, TypeScript 5 |
| AI Model | Anthropic Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) |
| AI SDK | Vercel AI SDK 6.0+ with streaming and tool calling |
| Auth & Database | Supabase (PostgreSQL + Auth) |
| Embeddings | OpenAI text-embedding-3-small (for memory system) |
| OAuth Integrations | Google Calendar, Google Docs, Todoist |
| Web Search | Tavily AI SDK |
| State Management | Zustand (client state), React Query (server state) |
| Styling | Tailwind CSS 4 with PostCSS |
| UI Components | shadcn/ui with Radix UI primitives |
| Deployment | Vercel |

---

## Architecture Highlights

- **Streaming AI Agent** — Uses Vercel AI SDK's `streamText()` with structured tool calling for calendar, tasks, documents, and web search. Real-time streaming of responses with UI updates.
- **Tool Execution Pattern** — Preview-before-confirmation approach: AI formats tool calls, user reviews, then execution happens. Prevents unintended actions.
- **Memory Pipeline** — Multi-stage extraction: keyword filtering → AI decision (Haiku) → structured extraction → embedding storage. Filters temporary tasks from lasting preferences.
- **Conversation Context** — Full conversation history passed to Claude with injected memory context (last 3 memories). Not traditional RAG with semantic search.
- **Artifact Streaming** — Real-time document generation with word-level streaming and transient UI updates via DataStream events.

---

## CI/CD Pipeline

| Check | Description |
|-------|-------------|
| **Lint Check** | ESLint validation on every pull request via GitHub Actions |
| **Claude Code Review** | AI-powered code review using Anthropic's claude-code-action |
| **Vercel Preview** | Automatic preview deployments for every PR |

See [.github/workflows/ci.yml](.github/workflows/ci.yml) for full CI configuration.

---

## Project Structure

```
├── app/                  # Next.js App Router
│   ├── api/              # API routes (chat, calendar, todos, docs, auth)
│   ├── auth/             # Authentication pages
│   └── chat/[chatId]/    # Chat interface
├── components/           # React components
│   ├── Auth/             # Authentication UI
│   ├── Chat/             # Chat interface and message components
│   ├── Home/             # Home interface
│   ├── Modals/           # Modals (search, integrations, memories)
│   └── ui/               # shadcn/ui components
├── contexts/             # React Context (user state, streaming data)
├── store/                # Zustand stores (chat, artifacts, sidebar, auth)
├── hooks/                # Custom React hooks
├── services/             # Business logic
│   ├── client/           # Client-side API calls
│   └── server/           # Server-side logic (calendar, todoist, memory, artifacts)
├── data/                 # Data access layer (Supabase CRUD)
├── tools/                # AI tool definitions (calendar, todos, documents)
├── constants/            # App constants and prompts
├── types/                # TypeScript definitions
├── utils/                # Utility functions
└── infra/                # Infrastructure (Supabase clients)
```

---

## Key Implementation Highlights

### Streaming Architecture
The application uses Vercel AI SDK's `streamText()` function to stream AI responses in real-time. Artifact generation streams word-by-word using transient data events that update the UI without being persisted to the database until completion.

### Memory Extraction Pipeline
1. **Keyword Pre-filter:** Fast check for memory-related keywords (preference words, personal pronouns)
2. **AI Gate Decision:** Claude Haiku analyzes if message contains lasting information worth storing
3. **Structured Extraction:** Extracts specific memories with categories using Zod schemas
4. **Embedding Storage:** Stores with OpenAI embeddings for semantic understanding

### Tool Calling Pattern
All AI tools follow a preview-before-execution pattern:
1. AI generates tool call with parameters
2. UI displays preview to user
3. User approves or rejects
4. Only approved tools execute actual API calls

This prevents unintended calendar events, todos, or other actions.

### OAuth Token Refresh
Google OAuth tokens automatically refresh when expired using stored refresh tokens. The system intercepts 401 errors, refreshes the token, and retries the original request transparently.

---

## Contact

Built by [aidqen](https://github.com/aidqen)

- **GitHub:** [github.com/aidqen](https://github.com/aidqen)
- **Email:** [idanmarkin8@example.com](mailto:idanmarkin8@example.com)
- **Twitter/X:** [@aidqen](https://x.com/aidqen)
- **LinkedIn:** [linkedin.com/in/idan-markin](https://www.linkedin.com/in/idan-markin)

**Repository:** [github.com/aidqen/orion](https://github.com/aidqen/orion)