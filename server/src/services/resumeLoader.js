const fs = require("fs");
const path = require("path");

const loadResumeText = async () => {
  try {
    const pdfPath = path.join(__dirname, "../data/LAKSHITA_GUPTA_RESUME.pdf");
    console.log('[Resume] Loading PDF from:', pdfPath);
    
    if (fs.existsSync(pdfPath)) {
      const stats = fs.statSync(pdfPath);
      console.log('[Resume] PDF found, size:', stats.size, 'bytes, modified:', stats.mtime);
      
      const pdf = require("pdf-parse");
      const dataBuffer = fs.readFileSync(pdfPath);
      const data = await pdf(dataBuffer);
      
      console.log('[Resume] PDF parsed successfully, text length:', data.text.length);
      
      return data.text;
    }

    const txtPath = path.join(__dirname, "../data/resume.txt");
    if (fs.existsSync(txtPath)) {
      console.log('[Resume] Using text file fallback');
      return fs.readFileSync(txtPath, "utf8");
    }

    console.warn("[Resume] No resume file found");
    return "Resume not available. Please add LAKSHITA_GUPTA_RESUME.pdf to the data folder.";
  } catch (error) {
    console.error("[Resume] Error loading resume:", error.message);
    return "Resume not available. Please add a valid resume file to the data folder.";
  }
};

module.exports = { loadResumeText };