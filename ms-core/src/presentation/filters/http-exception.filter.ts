import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { getCorrelationId } from '../../common/logger/async-local-storage';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = 
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      correlationId: getCorrelationId(),
      message: status === HttpStatus.INTERNAL_SERVER_ERROR 
        ? 'Internal server error' 
        : message,
    };

    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      correlation_id: getCorrelationId(),
      service: 'ms-core',
      layer: 'presentation',
      component: 'HttpExceptionFilter',
      event: 'HTTP_EXCEPTION',
      message: exception instanceof Error ? exception.message : 'Unknown error',
      context: {
        statusCode: status,
        path: request.url,
        method: request.method,
        stack: exception instanceof Error ? exception.stack : undefined,
      },
    };

    this.logger.error(JSON.stringify(logEntry));

    response.status(status).json(errorResponse);
  }
}
