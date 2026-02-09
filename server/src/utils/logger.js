const logger = {
  info: (message, ...args) => console.log(`[INFO] ${message}`, ...args),
  error: (message, ...args) => console.error(`[ERROR] ${message}`, ...args),
  security: (message, ...args) => console.warn(`[SECURITY] ${message}`, ...args),
  warn: (message, ...args) => console.warn(`[WARN] ${message}`, ...args),
  auth: (message, ...args) => console.log(`[AUTH] ${message}`, ...args),
};

module.exports = logger;