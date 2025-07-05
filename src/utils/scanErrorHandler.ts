
import { logger } from "@/utils/logger";

export const getErrorMessage = (error: any): string => {
  if (error?.message?.includes('couldn\'t find')) {
    return 'We couldn\'t find your business on Google. Please try:\n• Using your exact business name as it appears on Google\n• Including your city or postcode\n• Checking if your business has a Google Business Profile';
  }
  if (error?.message?.includes('API')) {
    return 'Our scanning service is temporarily busy. This usually resolves quickly - please try again in 30 seconds.';
  }
  if (error?.name === 'TypeError' || error?.message?.includes('fetch')) {
    return 'Connection issue detected. Please check your internet connection and try again. If the problem persists, try refreshing the page.';
  }
  if (error?.message?.includes('rate limit')) {
    return 'Too many scan requests. Please wait 60 seconds before trying again to ensure accurate results.';
  }
  return 'Scan temporarily unavailable. Our technical team has been notified. Please try again in a few minutes or contact support if this continues.';
};

export const withRetry = async <T>(
  operation: () => Promise<T>, 
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries exceeded');
};

export const logError = (error: any, context: string, details?: any) => {
  logger.error(`Error in ${context}`, 'errorHandler', {
    error,
    message: error?.message,
    stack: error?.stack,
    name: error?.name,
    ...details
  });
};

export const showToastError = (title: string, description: string) => {
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        title,
        description,
        variant: 'destructive'
      }
    }));
  }
};
