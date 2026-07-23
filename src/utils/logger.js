/**
 * Lightweight Logging Utility
 *
 * Suppresses verbose development logs in production builds while ensuring
 * critical errors are always recorded.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  info: (...args) => {
    if (isDev) {
      console.log('[INFO]', ...args);
    }
  },
  warn: (...args) => {
    if (isDev) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args) => {
    // Always log errors regardless of environment
    console.error('[ERROR]', ...args);
  },
  debug: (...args) => {
    if (isDev) {
      console.debug('[DEBUG]', ...args);
    }
  },
};

export default logger;
