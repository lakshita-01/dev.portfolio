const puter = require("puter");
require("dotenv").config();
const { loadResumeText } = require("./resumeLoader");

let resumeContext = "";
let isLoading = false;
let isInitialized = false;

// Initialize Puter silently in background
const initializePuter = async () => {
  if (isInitialized) return;
  try {
    // Suppress console logs during initialization
    const originalLog = console.log;
    const originalError = console.error;
    console.log = () => {};
    console.error = () => {};
    
    // Initialize Puter (it's anonymous by default, no login needed)
    await puter.ai.chat("test").catch(() => {});
    
    // Restore console
    console.log = originalLog;
    console.error = originalError;
    
    isInitialized = true;
  } catch (error) {
    // Silently fail, will retry on first actual use
  }
};

// Initialize on module load
initializePuter();

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
