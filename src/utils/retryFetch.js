/**
 * Utility for retrying failed API requests with exponential backoff
 */

import logger from './logger';

export const retryFetch = async (fn, options = {}) => {
  const { retries = 3, delay = 1000, backoff = 2 } = options;

  let lastError;
  let currentDelay = delay;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      logger.warn(`Attempt ${attempt} failed. Retrying in ${currentDelay}ms...`, err.message);

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        currentDelay *= backoff;
      }
    }
  }

  logger.error(`All ${retries} attempts failed.`, lastError);
  throw lastError;
};
