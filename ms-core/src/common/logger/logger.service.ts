import { Injectable, Logger } from '@nestjs/common';
import { getCorrelationId } from './async-local-storage';

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: string;
  correlation_id: string | undefined;
  service: string;
  layer: string;
  component: string;
  event: string;
  message: string;
  context?: LogContext;
  duration_ms?: number;
}

@Injectable()
export class StructuredLogger {
  private readonly logger = new Logger('StructuredLogger');

  private formatLog(
    level: string,
    layer: string,
    component: string,
    event: string,
    message: string,
    context?: LogContext,
    durationMs?: number,
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      correlation_id: getCorrelationId(),
      service: 'ms-core',
      layer,
      component,
      event,
      message,
      context,
      duration_ms: durationMs,
    };
  }

  info(
    layer: string,
    component: string,
    event: string,
    message: string,
    context?: LogContext,
    durationMs?: number,
  ): void {
    const logEntry = this.formatLog('INFO', layer, component, event, message, context, durationMs);
    this.logger.log(JSON.stringify(logEntry));
  }

  error(
    layer: string,
    component: string,
    event: string,
    message: string,
    error: Error,
    context?: LogContext,
  ): void {
    const logEntry = this.formatLog('ERROR', layer, component, event, message, {
      ...context,
      error_message: error.message,
      error_stack: error.stack,
    });
    this.logger.error(JSON.stringify(logEntry));
  }

  debug(
    layer: string,
    component: string,
    event: string,
    message: string,
    context?: LogContext,
  ): void {
    const logEntry = this.formatLog('DEBUG', layer, component, event, message, context);
    this.logger.debug(JSON.stringify(logEntry));
  }

  warn(
    layer: string,
    component: string,
    event: string,
    message: string,
    context?: LogContext,
  ): void {
    const logEntry = this.formatLog('WARN', layer, component, event, message, context);
    this.logger.warn(JSON.stringify(logEntry));
  }
}
