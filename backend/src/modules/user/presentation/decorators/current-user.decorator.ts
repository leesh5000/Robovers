import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '../../application/services/auth.service.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof TokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);