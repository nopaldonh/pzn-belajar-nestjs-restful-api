import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { UserResponse } from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host
      .switchToHttp()
      .getResponse<Response<WebResponse<UserResponse>>>();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        errors: exception.getResponse() as string,
      });
    } else if (exception instanceof ZodError) {
      response.status(400).json({
        errors: 'Validation error',
      });
    } else {
      response.status(500).json({
        errors: (exception as HttpException).message,
      });
    }
  }
}
