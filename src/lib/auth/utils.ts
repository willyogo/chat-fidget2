export const MIN_AUTH_INTERVAL = 5000; // Increase to 5 seconds between auth attempts
export const MAX_RETRIES = 2; // Limit max retries

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = MAX_RETRIES,
  baseDelay = MIN_AUTH_INTERVAL
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on specific error conditions
      if (error?.status === 400 || error?.message?.includes('Invalid login credentials')) {
        throw error;
      }
      
      if (attempt === maxAttempts - 1) {
        throw error;
      }
      
      await sleep(baseDelay * Math.pow(2, attempt));
    }
  }
  
  throw lastError || new Error('Max retry attempts reached');
}