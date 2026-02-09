const fs = require("fs");
const path = require("path");

const loadResumeText = async () => {
  try {
    // Try to load PDF first
    const pdfPath = path.join(__dirname, "../data/LAKSHITA_GUPTA_RESUME.pdf");
    if (fs.existsSync(pdfPath)) {
      const pdf = require("pdf-parse");
      const dataBuffer = fs.readFileSync(pdfPath);
      const data = await pdf(dataBuffer);
      return data.text;
    }

    // Fallback to text file
    const txtPath = path.join(__dirname, "../data/resume.txt");
    if (fs.existsSync(txtPath)) {
      return fs.readFileSync(txtPath, "utf8");
    }

    console.warn("Resume file not found at:", pdfPath, "or", txtPath);
    return "Resume not available. Please add LAKSHITA_GUPTA_RESUME.pdf or resume.txt to the data folder.";
  } catch (error) {
    console.error("Error loading resume:", error.message);
    return "Resume not available. Please add a valid resume file to the data folder.";
  }
};

module.exports = { loadResumeText };