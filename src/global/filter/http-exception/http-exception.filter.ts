import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { getInfoFromReq } from 'src/global/helper/getInfoFromReq';
import { Logger } from 'winston';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    const status = exception.getStatus();

    const message = exception.message
      ? exception.message
      : status >= 500
      ? 'Internal server error'
      : 'Bad request';
    const errorResponse = {
      code: status,
      message,
      content: {},
    };

    this.logger.error(message, {
      status,
      req: getInfoFromReq(ctx.getRequest()),
    });

    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
