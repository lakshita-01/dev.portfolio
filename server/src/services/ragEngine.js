const axios = require("axios");
require("dotenv").config();
const { loadResumeText } = require("./resumeLoader");

let resumeContext = "";
let authToken = null;
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
    
    // Get Puter auth token if credentials provided
    const username = process.env.PUTER_USERNAME;
    const password = process.env.PUTER_PASSWORD;
    
    if (username && password && username !== 'your_puter_username') {
      try {
        const response = await axios.post('https://api.puter.com/auth/signin', {
          username,
          password
        }, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (response.data && response.data.token) {
          authToken = response.data.token;
          console.log('[Puter] Authenticated successfully');
        } else {
          console.log('[Puter] Using anonymous mode (no token received)');
        }
      } catch (error) {
        console.log('[Puter] Auth failed, using anonymous mode');
      }
    } else {
      console.log('[Puter] Using anonymous mode (no credentials)');
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

RULES:
- Answer ONLY using the resume content below.
- If information is not available, say:
  "That information is not available in the resume. Please contact Lakshita directly at lakshitagupta9@gmail.com."
- Do NOT exaggerate or assume experience.
- Be concise and professional.

RESUME CONTENT:
${resumeContext}

User Question: ${userMessage}
`;

    // Call Puter AI API directly
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    
    const response = await axios.post('https://api.puter.com/drivers/call', {
      interface: 'puter-chat-completion',
      method: 'complete',
      args: {
        messages: [{ role: 'user', content: prompt }]
      }
    }, { headers });

    return response.data.message?.content || response.data.response || "Unable to get response.";

  } catch (error) {
    console.error('[Puter] Error:', error.message);
    return "Unable to respond right now. Please try again later.";
  }
};

module.exports = { getChatResponse };
