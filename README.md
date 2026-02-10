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
- ✅ **Full Accessibility**: WCAG AA compliant contrast ratios
- ✅ **Mobile Optimized**: Works perfectly on all screen sizes

### Color Palette

**Light Mode (7 Colors)**
```
🟪 Purple   #9333ea   - Headings & primary text
🟩 Pink     #db2777   - Secondary accents
🟦 Cyan     #0891b2   - Links & interactions
🟩 Lime     #65a30d   - Success states
🟧 Orange   #ea580c   - Warnings
🟦 Blue     #1d4ed8   - Information
🟪 Violet   #7c3aed   - Alternative accent
```

**Dark Mode (7 Neon Colors)**
```
🟪 Purple   #a855f7   - Primary bright accent
🟩 Pink     #ec4899   - Secondary bright accent
🟦 Cyan     #06b6d4   - Bright links
🟩 Lime     #84cc16   - Bright success
🟧 Orange   #f97316   - Bright warnings
🟦 Blue     #3b82f6   - Bright information
🟪 Violet   #8b5cf6   - Bright alternative
```

### How to Use

**For End Users**
1. Look for the Sun ☀️ or Moon 🌙 icon in the top-right navbar
2. Click to toggle between light and dark modes
3. Your preference is automatically saved
4. On next visit, your chosen theme will be restored

**For Developers**
Use the `useTheme` hook to access theme state in any component:

```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div className="bg-vibrant-lightBg dark:bg-vibrant-darkBg
                    text-gray-900 dark:text-white
                    transition-colors duration-300">
      {isDark ? 'Dark Mode Active' : 'Light Mode Active'}
    </div>
  );
}
```

### Tailwind Classes for Themes

```css
/* Text Colors */
text-vibrant-light-purple           /* Light mode purple */
dark:text-vibrant-neon-purple       /* Dark mode neon purple */

/* Backgrounds */
bg-vibrant-lightBg                  /* Light background */
dark:bg-vibrant-darkBg              /* Dark background */

/* Smooth Transitions */
transition-colors duration-300      /* Apply to all theme-aware elements */

/* Glass Effect Cards */
glass-card                          /* Already supports both themes */
glass-input                         /* Already supports both themes */
```

### Technical Implementation

**Files Modified:**
- `client/tailwind.config.js` - Added vibrant color palette & dark mode configuration
- `client/src/index.css` - Updated CSS for light/dark mode support
- `client/src/App.jsx` - Wrapped with ThemeProvider
- `client/src/components/Navbar.jsx` - Added theme toggle button

**New Component:**
- `client/src/context/ThemeContext.jsx` - Global theme state management

### How It Works

1. **On First Visit**: System checks for saved preference in localStorage, then checks OS preference
2. **Default**: Dark mode is applied if no preference is found
3. **Theme Switch**: Clicking the toggle button updates theme state and adds/removes `dark` class from HTML
4. **Persistence**: User preference is saved to localStorage automatically
5. **Styling**: Tailwind CSS uses the `dark:` prefix to apply dark mode styles

## 💡 Troubleshooting
- **AI not responding?** Ensure your OpenAI key is valid and has credits.
- **Theme not toggling?** Check that the toggle button is visible in the navbar (should show Sun/Moon icon)
- **Theme not persisting?** Verify that localStorage is enabled in your browser
- **Colors not displaying?** Run `npm run dev` to rebuild Tailwind CSS
- **Dashboard blank?** Make sure MongoDB is running and you have logged in via `/login`.
- **Styling issues?** Run `npm run dev` to ensure PostCSS is processing Tailwind classes.
#
