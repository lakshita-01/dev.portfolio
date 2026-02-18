# 🚀 Interactive AI Portfolio Platform

This is a premium, high-performance portfolio platform built for modern engineers. It showcases your work with eye-catching animations, real-time analytics, and an AI-powered assistant that can answer recruiter questions using RAG (Retrieval-Augmented Generation).

## ✨ Features
- **AI Portfolio Assistant**: LangChain/OpenAI integrated chatbot that knows your resume.
- **Real-Time Analytics Dashboard**: Monitor live visitors and traffic trends via WebSockets and Recharts.
- **Glassmorphism UI**: High-end aesthetic using Tailwind CSS and Framer Motion.
- **Responsive Charts**: Visual tech-stack representation with Radar charts.
- **Admin Gateway**: Secure JSON Web Token (JWT) authentication for your private dashboard.
- **🎨 Vibrant Theme System**: Dynamic light/dark mode with 14 vibrant colors and smooth transitions.
- **🌓 Theme Persistence**: User preference saved to localStorage with system preference detection.
- **♿ Full Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support.

## 🛠️ Prerequisites
- **Node.js**: v18 or newer
- **MongoDB**: Local instance or MongoDB Atlas URI
- **OpenAI API Key**: For the AI Chatbot functionality

## 🚦 Installation & Setup

1. **Clone and Install Backend Dependencies**:
    npm install

2. **Setup Client**:
    cd client
    npm install
    cd ..

3. **Environment Variables**:
    Create a `.env` file in the root directory:
    PORT=5000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_random_string
    OPENAI_API_KEY=your_openai_key

4. **Initialize Admin (Optional but recommended)**:
    Since this is a new setup, you need to create an admin user to access the dashboard.
    You can use Postman to POST to `http://localhost:5000/api/auth/register` with:
    { "username": "admin", "password": "yourpassword" }

## 🚀 Running the Application

Run both the server and client concurrently from the root:
    npm run dev

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📂 Project Structure
- `server/`: Express backend with Socket.IO, Mongoose models, and AI Logic.
- `client/`: Vite + React frontend with Tailwind CSS.
- `src/services/ragEngine.js`: The "brain" of the chat assistant.
- `src/components/AIChat.jsx`: The floating glassmorphism chat component.
- `src/context/ThemeContext.jsx`: Global theme management with light/dark mode.
- `src/components/Navbar.jsx`: Navigation bar with theme toggle button.

## 🎨 Theme System

### Overview
The portfolio features a vibrant color palette with full light and dark mode support. Users can toggle themes with a single click, and their preference is automatically saved.

### Features
- ✅ **Light Mode**: 7 vibrant professional colors with soft backgrounds
- ✅ **Dark Mode**: 7 neon vibrant colors with dark backgrounds  
- ✅ **Theme Toggle**: Sun/Moon button in the navbar for easy switching
- ✅ **Smart Persistence**: localStorage saves user preference
- ✅ **System Detection**: Respects OS dark mode setting on first visit
- ✅ **Smooth Transitions**: 300ms color animations between themes
# Interactive AI Portfolio

A compact, production-ready portfolio platform featuring a modern UI, theme system, real-time analytics, and an AI-powered resume assistant.

**Primary features**
- **AI Assistant (RAG)**: Retrieval-augmented chat assistant powered by `server/src/services/ragEngine.js` which uses your resume as context.
- **Real-time analytics**: Live visitor tracking and dashboards (websockets + charts).
- **Admin dashboard**: JWT-protected admin routes for viewing analytics and managing access.
- **Responsive UI**: Vite + React frontend with Tailwind CSS and Framer Motion for smooth animations and glassmorphism styling.
- **Theme system**: Light/dark mode with persistence and system preference detection (`client/src/context/ThemeContext.jsx`).
- **Accessibility-minded**: Keyboard navigation and accessible color contrasts.

## Quick setup

Prerequisites: Node.js (v18+), MongoDB (local or Atlas), optional Puter/OpenAI credentials for AI features.

1. Install dependencies (root):
```
npm install
```
2. Install client deps:
```
cd client
npm install
cd ..
```
3. Create `.env` in the root with the required vars (example):
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PUTER_USERNAME=your_user      # optional
PUTER_PASSWORD=your_pass      # optional
```

4. Start dev servers:
```
npm run dev
```

Frontend: http://localhost:5173 — Backend: http://localhost:5000

## Project layout (key files)
- `server/` — Express API, Socket.IO, Mongoose models
  - `server/src/routes/chat.js` — chat route that uses `ragEngine.js`
  - `server/src/services/ragEngine.js` — AI assistant (RAG)
- `client/` — Vite + React app
  - `client/src/components/AIChat.jsx` — chat UI
  - `client/src/context/ThemeContext.jsx` — theme provider

## Cleanup performed
- Removed obsolete file: `server/src/services/ragEngine_old.js` (not referenced).

## Notes & troubleshooting
- If the AI assistant doesn't respond, check your Puter/OpenAI credentials and network access.
- If the admin dashboard is empty, ensure MongoDB is running and an admin user exists.

If you want, I can now:
- run a static analysis to find more unused imports/files, or
- prune additional unused docs and run a quick client build to verify everything.
