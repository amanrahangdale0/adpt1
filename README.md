# ADPT Mark 6 - AI Study Planner

A full-featured AI-powered study planning application with offline capabilities, personalized scheduling, and intelligent tutoring.

## Features

✨ **AI Study Assistant** - Chat with AI and generate study goals from your notes
📅 **Smart Scheduling** - AI-generated study schedules with calendar export
📚 **Subject Management** - Track subjects, difficulty, and exam dates
📊 **Progress Dashboard** - Monitor XP, streaks, and daily goals
🔔 **Smart Notifications** - Browser notifications for upcoming study sessions
💾 **Offline Support** - Local storage with caching
🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui components

## Project info

**URL**: https://lovable.dev/projects/f98a5fb1-2f4e-4313-a655-7259495307db

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key (for AI features)

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f98a5fb1-2f4e-4313-a655-7259495307db) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd "ADPT mark 6"

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Create environment file for backend
cp .env.example .env
# Edit .env and add your OpenAI API key:
# OPENAI_API_KEY=your_actual_api_key_here

# Step 5: Start both frontend and backend servers
npm run dev:all

# Or run them separately:
# Terminal 1 - Backend server:
npm run server

# Terminal 2 - Frontend dev server:
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

### Frontend
- Vite - Build tool and dev server
- TypeScript - Type safety
- React 18 - UI library
- React Router - Navigation
- shadcn/ui - UI component library
- Radix UI - Headless UI components
- Tailwind CSS - Styling
- TanStack Query - Data fetching
- Sonner - Toast notifications

### Backend
- Node.js + Express - REST API server
- OpenAI API - AI chat and goal generation
- Multer - File upload handling
- CORS - Cross-origin requests
- dotenv - Environment configuration

## Fixed Issues

All critical errors have been resolved:

✅ **Missing Dependencies** - Added multer for file uploads
✅ **Import Paths** - Fixed all module import paths
✅ **TypeScript Errors** - Replaced `any` types with proper types
✅ **Empty Files** - Implemented chatAPI, notesAPI, createICS, useNotifications
✅ **Hook Dependencies** - Fixed React Hook dependency warnings
✅ **Interface Issues** - Converted empty interfaces to type aliases
✅ **Tailwind Config** - Fixed ES module import syntax
✅ **File Structure** - Created uploads directory and .gitignore

## API Endpoints

### Backend Server (Port 5000)

- `POST /api/ai/chat` - AI chat completions
- `POST /api/ai/upload` - Upload and summarize notes
- `POST /api/ai/goals` - Generate study goals
- `POST /api/schedule` - Create study schedule (needs implementation)

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f98a5fb1-2f4e-4313-a655-7259495307db) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
