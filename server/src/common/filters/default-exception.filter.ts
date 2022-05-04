import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class DefaultExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger('Error');

  override catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const url = request.url;
    const headers = JSON.stringify(request.headers, null, 2);
    const body = JSON.stringify(request.body, null, 2);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let title = 'Internal Server Error';
    let error = 'None';
    let stack = 'None';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      title = exception.message;

      if (exception.stack) {
        stack = exception.stack.replace(/ {4}/g, '  ');
      }

      let res = exception.getResponse();

      if (typeof res === 'object') {
        res = JSON.stringify(res, null, 2);
      }

      error = res;
    } else if (exception instanceof QueryFailedError) {
      title = exception.name;

      if (exception.stack) {
        stack = exception.stack.replace(/ {4}/g, '  ');
      }

      error = JSON.stringify(exception, null, 2);
    } else if (exception instanceof Error) {
      title = exception.name;

      if (exception.stack) {
        stack = exception.stack.replace(/ {4}/g, '  ');
      }

      let res = exception.message;

      if (typeof res === 'object') {
        res = JSON.stringify(res, null, 2);
      }

      error = res;
    } else {
      error = JSON.stringify(exception, null, 2);
    }

    const log = `${title} [${status}]\n\n[URL]:\n${url}\n\n[HEADERS]:\n${headers}\n\n[BODY]:\n${body}\n\n[ERROR]:\n${error}\n\n[STACK]:\n${stack}\n\n`;

    this.logger.error(log);

    response.status(status).json('See logs');
  }
}
