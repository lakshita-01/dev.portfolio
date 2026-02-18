const puter = require("puter");
require("dotenv").config();
const { loadResumeText } = require("./resumeLoader");

let resumeContext = "";
let isAuthenticated = false;
let initializationPromise = null;
let lastResumeLoadTime = null;

// Initialize everything on server start
const initializeOnStartup = async () => {
  try {
    // Always reload resume on startup (no caching)
    console.log('[Puter] Loading resume...');
    resumeContext = await loadResumeText();
    lastResumeLoadTime = new Date();
    console.log('[Puter] Resume loaded successfully at', lastResumeLoadTime.toISOString());
    console.log('[Puter] Resume length:', resumeContext.length, 'characters');

    // Optional Puter auth using username/password from env
    const username = process.env.PUTER_USERNAME;
    const password = process.env.PUTER_PASSWORD;

    if (username && password) {
      try {
        await puter.auth.signIn(username, password);
        isAuthenticated = true;
        console.log('[Puter] Authenticated successfully');
      } catch (err) {
        console.log('[Puter] Puter auth failed, continuing anonymously');
      }
    } else {
      console.log('[Puter] No Puter credentials provided — running in anonymous mode');
    }

    console.log('[Puter] AI Assistant ready');
  } catch (error) {
    console.error('[Puter] Initialization failed:', error.message);
  }
};

// Start initialization immediately when module loads
initializationPromise = initializeOnStartup();

const getChatResponse = async (userMessage) => {
  try {
    // Wait for initialization to complete if still in progress
    await initializationPromise;

    // Force reload resume on every request to prevent caching
    console.log('[Puter] Reloading resume for fresh context...');
    resumeContext = await loadResumeText();
    console.log('[Puter] Resume reloaded, length:', resumeContext.length);
    console.log('[Puter] Resume snippet:', resumeContext.substring(0, 100).replace(/\n/g, ' '));

    const prompt = `
You are an AI Portfolio Assistant representing Lakshita Gupta.
Lakshita is actively looking for roles like Machine Learning Engineer, Software Engineer and web developer (fullstack/frontend/backend) for both internship and full-time roles.

RULES:
- Answer ONLY using the resume content below.
- If information is not available, say:
  "That information is not available in the resume. Please contact Lakshita directly."
- Do NOT exaggerate or assume experience.
- Be concise and professional.

RESUME CONTENT:
${resumeContext}

User Question: ${userMessage}
`;

    // Use puter SDK locally (no external API key required here)
    const aiResponse = await puter.ai.chat(prompt);
    // puter.ai.chat may return different shapes; normalize to string
    let reply = aiResponse?.message?.content || aiResponse?.content || (typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse));

    // Ensure exact footer is ALWAYS appended
    const footer = `---\nFor more details, contact Lakshita:\n📧 Email: lakshitagupta9@gmail.com\n📅 Book a Call: Click the 'Hire Me' button in the navbar\n🔗 LinkedIn: https://www.linkedin.com/in/lakshita-gupta01`;
    if (!reply.includes(footer)) {
      reply = reply.trim() + "\n\n" + footer;
    }

    return reply;

  } catch (error) {
    console.error('[Puter] Error:', error.message);
    return "Unable to respond right now. Please try again later.";
  }
};

module.exports = { getChatResponse };
