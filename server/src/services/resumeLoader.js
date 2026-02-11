const fs = require("fs");
const path = require("path");

const loadResumeText = async () => {
  try {
    // Try to load PDF first
    const pdfPath = path.join(__dirname, "../data/LAKSHITA_GUPTA_RESUME.pdf");
    console.log('[Resume] Checking PDF at:', pdfPath);
    
    if (fs.existsSync(pdfPath)) {
      const stats = fs.statSync(pdfPath);
      console.log('[Resume] PDF found, size:', stats.size, 'bytes, modified:', stats.mtime);
      
      const pdf = require("pdf-parse");
      const dataBuffer = fs.readFileSync(pdfPath);
      const data = await pdf(dataBuffer);
      
      console.log('[Resume] PDF parsed, text length:', data.text.length);
      console.log('[Resume] First 200 chars:', data.text.substring(0, 200));
      
      return data.text;
    }

    // Fallback to text file
    const txtPath = path.join(__dirname, "../data/resume.txt");
    if (fs.existsSync(txtPath)) {
      console.log('[Resume] Using text file fallback');
      return fs.readFileSync(txtPath, "utf8");
    }

    console.warn("[Resume] No resume file found at:", pdfPath, "or", txtPath);
    return "Resume not available. Please add LAKSHITA_GUPTA_RESUME.pdf or resume.txt to the data folder.";
  } catch (error) {
    console.error("[Resume] Error loading resume:", error.message);
    return "Resume not available. Please add a valid resume file to the data folder.";
  }
};

module.exports = { loadResumeText };