import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import { runWithCorrelationId } from './async-local-storage';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const correlationId = (req.headers['x-request-id'] as string) || uuid();
    res.setHeader('x-request-id', correlationId);
    runWithCorrelationId(correlationId, () => {
      next();
    });
  }
}
