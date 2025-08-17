import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContextDto } from '../../dto/user-context.dto';
import { RequestWithUser } from './extract-user-from-request.decorator';

export const ExtractUserIfExistsFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserContextDto | null => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      return null;
    }

    return request.user as UserContextDto;
  },
);
