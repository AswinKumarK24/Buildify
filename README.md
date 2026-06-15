# Buildify

A high-performance, open-source no-code layout studio built with Next.js, TypeScript, and Tailwind CSS. It features a tactile drag-and-drop canvas, real-time property editing, and multi-device responsive previews. The tool instantly compiles visual layouts into clean, production-grade HTML and Tailwind CSS code blocks.

## Features

- **Drag-and-Drop Canvas**: Intuitive visual editor with tactile component placement
- **Real-Time Property Editing**: Instant updates to component properties with live preview
- **Multi-Device Previews**: Responsive design preview for desktop, tablet, and mobile
- **Code Export**: Generate clean, production-grade HTML and Tailwind CSS code blocks
- **Component Library**: Pre-built UI components including navbars, hero sections, forms, and more
- **Project Management**: Create, edit, and manage multiple projects with cloud persistence

## Installation

```bash
# Clone the repository
git clone https://github.com/AswinKumarK24/Buildify.git
cd Buildify

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# AI Service
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Vercel Deployment (optional)
VERCEL_TOKEN=your_vercel_token

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
buildify/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/         # API routes
│   │   ├── dashboard/   # Dashboard page
│   │   ├── editor/      # Editor workspace
│   │   ├── login/       # Authentication
│   │   └── signup/      # Authentication
│   ├── components/
│   │   ├── ui/          # Reusable UI components
│   │   ├── auth/        # Authentication components
│   │   └── editor/      # Editor-specific components
│   ├── lib/             # Utility functions and configurations
│   ├── hooks/           # Custom React hooks
│   └── store/           # State management (Zustand)
├── public/              # Static assets
└── package.json
```

## Usage

1. **Sign Up**: Create an account to access the dashboard
2. **Create Project**: Click "New Project" to start building
3. **Drag Components**: Drag blocks from the left sidebar to the canvas
4. **Edit Properties**: Click any component to edit its properties in the right panel
5. **Preview**: Use the Preview button to see your design without editing tools
6. **Export**: Download your design as HTML or copy the generated Tailwind CSS code

## Tech Stack

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **@dnd-kit**: Drag-and-drop functionality
- **Framer Motion**: Animation library
- **Supabase**: Database and authentication
- **Gemini AI**: AI-powered component generation

## License

This project is open-source and available under the MIT License.

---

Built with 💖 by Aswin Kumar
