const puter = require("puter");
require("dotenv").config();
const { loadResumeText } = require("./resumeLoader");

let resumeContext = "";
let isLoading = false;
let isAuthenticated = false;

// Silent authentication with Puter
const authenticatePuter = async () => {
  if (isAuthenticated) return true;
  
  try {
    // Suppress all console output during auth
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
    
    // Authenticate with Puter using credentials from env
    const username = process.env.PUTER_USERNAME;
    const password = process.env.PUTER_PASSWORD;
    
    if (username && password) {
      await puter.auth.signIn(username, password);
      isAuthenticated = true;
    } else {
      // Use anonymous mode if no credentials
      isAuthenticated = true;
    }
    
    // Restore console
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
    
    return true;
  } catch (error) {
    // Silently fail and use anonymous mode
    isAuthenticated = true;
    return true;
  }
};

// Lazy load resume when first needed
const ensureResumeLoaded = async () => {
  if (!resumeContext && !isLoading) {
    isLoading = true;
    try {
      resumeContext = await loadResumeText();
    } catch (error) {
      console.error("Resume load error:", error.message);
    } finally {
      isLoading = false;
    }
  }
};

const getChatResponse = async (userMessage) => {
  try {
    // Ensure authenticated before making requests
    await authenticatePuter();
    await ensureResumeLoaded();
    
    const prompt = `
You are an AI Portfolio Assistant representing Lakshita Gupta.

RULES:
- Answer ONLY using the resume content below.
- If information is not present, say:
  "That information is not available in the resume. Please contact Lakshita directly at lakshitagupta9@gmail.com."
- Do NOT exaggerate or assume experience.
- Be concise and professional.

RESUME CONTENT:
${resumeContext}

User Question: ${userMessage}
`;

    const response = await puter.ai.chat(prompt);

    return response;

  } catch (error) {
    console.error("Puter AI Error:", error.message);
    return "Unable to respond right now. Please try again later.";
  }
};

module.exports = { getChatResponse };
