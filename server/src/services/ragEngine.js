const puter = require("puter");
require("dotenv").config();
const { loadResumeText } = require("./resumeLoader");

let resumeContext = "";

// Load resume once at startup
(async () => {
  resumeContext = await loadResumeText();
})();

const getChatResponse = async (userMessage) => {
  try {
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
    console.error("Puter AI Error:", error);
    return "Unable to respond right now. Please try again later.";
  }
};

module.exports = { getChatResponse };
