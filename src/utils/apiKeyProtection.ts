interface APIKeyValidationResult {
  isValid: boolean;
  error?: string;
  rateLimit?: {
    remaining: number;
    resetTime: number;
  };
}

interface ProtectedAPICall {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

class APIKeyProtection {
  private rateLimits = new Map<string, { count: number; resetTime: number }>();
  private readonly MAX_REQUESTS_PER_MINUTE = 60;
  private readonly SENSITIVE_HEADERS = ['authorization', 'x-api-key', 'apikey'];

  // Rate limiting
  private checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const limit = this.rateLimits.get(identifier);
    
    if (!limit || now > limit.resetTime) {
      this.rateLimits.set(identifier, {
        count: 1,
        resetTime: now + 60000 // Reset after 1 minute
      });
      return true;
    }
    
    if (limit.count >= this.MAX_REQUESTS_PER_MINUTE) {
      return false;
    }
    
    limit.count++;
    return true;
  }

  // Sanitize sensitive data from logs
  sanitizeForLogging(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized = { ...data };
    
    // Remove sensitive headers
    if (sanitized.headers) {
      this.SENSITIVE_HEADERS.forEach(header => {
        if (sanitized.headers[header]) {
          sanitized.headers[header] = '[REDACTED]';
        }
      });
    }

    // Remove API keys from URLs
    if (sanitized.url) {
      sanitized.url = sanitized.url.replace(/([?&]api_?key=)[^&]+/gi, '$1[REDACTED]');
    }

    // Remove sensitive data from body
    if (sanitized.body && typeof sanitized.body === 'object') {
      const sensitiveFields = ['password', 'token', 'secret', 'key', 'apiKey'];
      sensitiveFields.forEach(field => {
        if (sanitized.body[field]) {
          sanitized.body[field] = '[REDACTED]';
        }
      });
    }

    return sanitized;
  }

  // Validate API key format
  validateAPIKey(apiKey: string, expectedFormat?: 'supabase' | 'openai' | 'stripe'): APIKeyValidationResult {
    if (!apiKey || typeof apiKey !== 'string') {
      return { isValid: false, error: 'API key is required' };
    }

    // Check for common patterns that might indicate a leaked key
    const suspiciousPatterns = [
      /^(sk-|pk_|rk_)/, // Stripe patterns
      /^eyJ/, // JWT patterns
      /^[A-Za-z0-9]{32,}$/ // Long alphanumeric strings
    ];

    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(apiKey));
    
    if (expectedFormat) {
      switch (expectedFormat) {
        case 'supabase':
          if (!apiKey.startsWith('eyJ')) {
            return { isValid: false, error: 'Invalid Supabase API key format' };
          }
          break;
        case 'openai':
          if (!apiKey.startsWith('sk-')) {
            return { isValid: false, error: 'Invalid OpenAI API key format' };
          }
          break;
        case 'stripe':
          if (!apiKey.startsWith('sk_') && !apiKey.startsWith('pk_')) {
            return { isValid: false, error: 'Invalid Stripe API key format' };
          }
          break;
      }
    }

    return { isValid: true };
  }

  // Secure API call wrapper
  async makeProtectedAPICall({ endpoint, method, headers = {}, body }: ProtectedAPICall): Promise<Response> {
    const identifier = `${endpoint}-${method}`;
    
    // Check rate limit
    if (!this.checkRateLimit(identifier)) {
      throw new Error('Rate limit exceeded. Please wait before making more requests.');
    }

    // Validate headers for sensitive data
    const sanitizedHeaders = { ...headers };
    this.SENSITIVE_HEADERS.forEach(header => {
      if (sanitizedHeaders[header]) {
        const validation = this.validateAPIKey(sanitizedHeaders[header]);
        if (!validation.isValid) {
          throw new Error(`Invalid API key: ${validation.error}`);
        }
      }
    });

    // Add security headers
    const secureHeaders = {
      ...sanitizedHeaders,
      'X-Requested-With': 'XMLHttpRequest',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };

    try {
      const response = await fetch(endpoint, {
        method,
        headers: secureHeaders,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'omit' // Don't include cookies for API calls
      });

      // Log sanitized request details (without sensitive data)
      console.log('API Call:', this.sanitizeForLogging({
        endpoint,
        method,
        status: response.status,
        headers: secureHeaders
      }));

      return response;
    } catch (error) {
      // Log sanitized error
      console.error('API Call Failed:', this.sanitizeForLogging({
        endpoint,
        method,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
      throw error;
    }
  }

  // Environment validation
  validateEnvironment(): { isSecure: boolean; warnings: string[] } {
    const warnings: string[] = [];
    let isSecure = true;

    // Check if running on HTTPS in production
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      warnings.push('Application is not running on HTTPS');
      isSecure = false;
    }

    // Check for development mode in production
    if (process.env.NODE_ENV === 'development' && location.hostname !== 'localhost') {
      warnings.push('Development mode detected in production environment');
      isSecure = false;
    }

    // Check for exposed sensitive data in global scope
    const globalKeys = Object.keys(window);
    const suspiciousGlobals = globalKeys.filter(key => 
      key.toLowerCase().includes('key') || 
      key.toLowerCase().includes('secret') ||
      key.toLowerCase().includes('token')
    );

    if (suspiciousGlobals.length > 0) {
      warnings.push(`Potentially sensitive data in global scope: ${suspiciousGlobals.join(', ')}`);
    }

    return { isSecure, warnings };
  }
}

export const apiKeyProtection = new APIKeyProtection();

// Export utility functions
export const {
  validateAPIKey,
  makeProtectedAPICall,
  sanitizeForLogging,
  validateEnvironment
} = apiKeyProtection;