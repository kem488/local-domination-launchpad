import { useErrorLogger } from '@/hooks/useErrorLogger';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogData {
  message: string;
  level: LogLevel;
  source: string;
  metadata?: Record<string, any>;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private errorLogger: ReturnType<typeof useErrorLogger> | null = null;

  setErrorLogger(logger: ReturnType<typeof useErrorLogger>) {
    this.errorLogger = logger;
  }

  debug(message: string, source: string, metadata?: Record<string, any>) {
    this.log({ message, level: 'debug', source, metadata });
  }

  info(message: string, source: string, metadata?: Record<string, any>) {
    this.log({ message, level: 'info', source, metadata });
  }

  warn(message: string, source: string, metadata?: Record<string, any>) {
    this.log({ message, level: 'warn', source, metadata });
  }

  error(message: string, source: string, metadata?: Record<string, any>) {
    this.log({ message, level: 'error', source, metadata });
  }

  private log(data: LogData) {
    // Always log to console in development
    if (this.isDevelopment) {
      const logMethod = console[data.level] || console.log;
      logMethod(`[${data.source}] ${data.message}`, data.metadata || '');
    }

    // Log to error tracking system in production for warn/error levels
    if (!this.isDevelopment && ['warn', 'error'].includes(data.level) && this.errorLogger) {
      this.errorLogger.logError({
        level: data.level as 'warn' | 'error',
        message: data.message,
        source: data.source,
        metadata: data.metadata
      });
    }
  }
}

export const logger = new Logger();