import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const ReqUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  if (!user) {
    throw new UnauthorizedException({
      code: 'not_authorized',
      detail: "You aren't authorized to execute this action",
    });
  }
  return user;
});
