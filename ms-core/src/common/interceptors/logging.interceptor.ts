import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StructuredLogger } from '../logger/logger.service';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: StructuredLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, body, headers } = request;
    const startTime = Date.now();

    this.logger.info(
      'presentation',
      'HttpLoggingInterceptor',
      'HTTP_REQUEST_START',
      `${method} ${url}`,
      { 
        method, 
        url, 
        ip, 
        userAgent: headers['user-agent'],
        body: this.sanitizeBody(body),
      },
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.logger.info(
            'presentation',
            'HttpLoggingInterceptor',
            'HTTP_RESPONSE_SUCCESS',
            `${method} ${url} completed`,
            { 
              method, 
              url, 
              statusCode: 200,
              responseLength: JSON.stringify(data).length,
            },
            duration,
          );
        },
      error: (error) => {
        const duration = Date.now() - startTime;
        this.logger.error(
          'presentation',
          'HttpLoggingInterceptor',
          'HTTP_RESPONSE_ERROR',
          `${method} ${url} failed`,
          error,
          {
            method,
            url,
            statusCode: error.status || 500,
            durationMs: duration,
          },
        );
      },
      }),
    );
  }

  private sanitizeBody(body: unknown): unknown {
    if (!body || typeof body !== 'object') return body;
    const sanitized = { ...body as Record<string, unknown> };
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.secret;
    delete sanitized.authorization;
    return sanitized;
  }
}
