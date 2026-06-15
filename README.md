# 🚀 Buildify

<p align="center">
  <b>The futuristic, AI-powered drag-and-drop website builder designed for speed, flexibility, and stunning aesthetics.</b>
</p>

## ✨ What Makes Buildify Stand Out

1. **AI-Powered Generation** — Generate entire website layouts or specific components instantly using Gemini 2.5 Flash.
2. **Production-Ready Export** — Not just a mockup tool. Export clean, functional React/Tailwind code ready for deployment.
3. **Secure Authentication** — Enterprise-grade security and user management powered by Stack Auth.
4. **Neon PostgreSQL** — Fast, serverless database syncing ensuring your projects are safely stored and instantly available.
5. **Dark Mode & Glassmorphism** — A premium, immersive editing experience with responsive design and modern micro-animations.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ installed
- **NeonDB** PostgreSQL database provisioned
- **Stack Auth** project initialized
- **Gemini API Key** from [aistudio.google.com](https://aistudio.google.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/devdatrt16-hub/Buildify.git
cd Buildify

# 2. Install dependencies
npm install

# 3. Create your .env.local file
cp .env.example .env.local   # Then fill in your credentials (see below)

# 4. Start the development server
npm run dev
# Server runs on http://localhost:3000
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Next.js / Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_stack_client_key
STACK_SECRET_SERVER_KEY=your_stack_server_key

# Database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# AI Model
GEMINI_API_KEY=your_gemini_api_key
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Serverless PostgreSQL connection string (Neon) |
| `GEMINI_API_KEY` | ✅ | API key for Google Gemini 2.5 Flash |
| `NEXT_PUBLIC_STACK_*` | ✅ | Stack Auth project configuration |

---

## 🧠 AI Integration Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant NextJS API
    participant Gemini AI
    participant NeonDB

    User->>Frontend: Enter prompt (e.g. "Dark Mode Pricing Table")
    Frontend->>NextJS API: POST /api/ai/generate
    NextJS API->>Gemini AI: Send context + prompt
    Gemini AI-->>NextJS API: Return JSON block definitions
    NextJS API-->>Frontend: DB POST /api/projects/:id
    NextJS API->>NeonDB: Sync JSON state securely
    NextJS API-->>Frontend: Render visual components
```

---

## 👥 Authentication & Data Security

| Role | Access | Routing |
|---|---|---|
| **Guest** | Landing Page (`/`) | Unauthenticated → Prompted to Sign In |
| **Authenticated User** | Dashboard, Editor (`/dashboard`, `/editor/:id`) | Login → Redirected to active projects |

All database operations are secured using Row-Level checks attached to the `StackServerApp` identity, ensuring users can only read, update, or delete projects they exclusively own.

---

## 🎨 UI & UX Design

### Design System

- **Immersive Dark Theme**: Deep black base with vibrant neon accents (`#00d4ff`, `#ff0ade`) inspired by futuristic interfaces.
- **Glassmorphism**: Semi-transparent floating panels with `backdrop-filter: blur()` for a premium workspace feel.
- **Dynamic Backgrounds**: Custom particle interactions providing infinite spatial depth.
- **Typography**: Clean, geometric sans-serif fonts prioritizing readability and visual hierarchy.

---

## 📡 API Reference

### User Projects

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | List all projects belonging to the current user |
| `POST` | `/api/projects` | Create a new empty project |
| `GET` | `/api/projects/:id` | Fetch specific project data |
| `PUT` | `/api/projects/:id` | Update project JSON payload |
| `DELETE` | `/api/projects/:id` | Delete a project |

### AI Interfaces

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/generate` | Generate UI blocks from natural language |
| `POST` | `/api/ai/rewrite` | AI text manipulation inside components |
| `POST` | `/api/ai/screenshot` | AI code generation from visual inputs |

---

<p align="center">
  <b>Built with ❤️ using Next.js, Neon Postgres, Stack Auth, Gemini AI, and a lot of ☕</b>
</p>
