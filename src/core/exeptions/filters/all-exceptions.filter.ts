import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseBody } from './error-response-body.type';
import { DomainExceptionCode } from '../domain-exception-codes';

@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Unknown exception occurred.';

    // безопасная проверка, если exception - объект с нужными свойствами
    if (typeof exception === 'object' && exception !== null) {
      if ('status' in exception && typeof exception.status === 'number') {
        status = exception.status;
      }
      if ('message' in exception && typeof exception.message === 'string') {
        message = exception.message;
      }
    }

    const responseBody: ErrorResponseBody = {
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      extensions: [],
      code: DomainExceptionCode.InternalServerError,
    };

    response.status(status).json(responseBody);
  }
}
