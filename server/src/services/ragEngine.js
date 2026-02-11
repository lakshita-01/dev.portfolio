const puter = require("puter");
require("dotenv").config();
const { loadResumeText } = require("./resumeLoader");

let resumeContext = "";
let isLoading = false;
let isAuthenticated = false;

// Completely suppress all output
const suppressOutput = () => {
  const noop = () => {};
  console.log = noop;
  console.error = noop;
  console.warn = noop;
  console.info = noop;
  console.debug = noop;
  process.stdout.write = noop;
  process.stderr.write = noop;
};

const restoreOutput = (original) => {
  console.log = original.log;
  console.error = original.error;
  console.warn = original.warn;
  console.info = original.info;
  console.debug = original.debug;
  process.stdout.write = original.stdout;
  process.stderr.write = original.stderr;
};

// Silent authentication with Puter
const authenticatePuter = async () => {
  if (isAuthenticated) return true;
  
  const original = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug,
    stdout: process.stdout.write,
    stderr: process.stderr.write
  };
  
  try {
    suppressOutput();
    
    const username = process.env.PUTER_USERNAME;
    const password = process.env.PUTER_PASSWORD;
    
    if (username && password) {
      await puter.auth.signIn(username, password);
    }
    
    isAuthenticated = true;
    restoreOutput(original);
    return true;
  } catch (error) {
    restoreOutput(original);
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
      // Silent
    } finally {
      isLoading = false;
    }
  }
};

const getChatResponse = async (userMessage) => {
  const original = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug,
    stdout: process.stdout.write,
    stderr: process.stderr.write
  };
  
  try {
    suppressOutput();
    
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
    
    restoreOutput(original);
    return response;

  } catch (error) {
    restoreOutput(original);
    return "Unable to respond right now. Please try again later.";
  }
};

module.exports = { getChatResponse };
