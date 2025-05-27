import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from 'generated/prisma';

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: Request & { user: User } = context
      .switchToHttp()
      .getRequest();

    const user = request.user;

    if (user) {
      return user;
    } else {
      throw new HttpException('Unauthorized', 401);
    }
  },
);
