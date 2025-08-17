import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserContextDto } from '../../dto/user-context.dto';

export interface RequestWithUser extends Request {
  user?: UserContextDto;
}

export const ExtractUserFromRequest = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserContextDto => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      throw new UnauthorizedException(
        'There is no user in the request object!',
      );
    }

    return request.user;
  },
);
