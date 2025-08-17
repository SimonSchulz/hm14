import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserContextDto } from '../../../../core/dto/user-context.dto';

@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest<TUser = UserContextDto>(err: any, user: TUser) {
    if (err || !user) {
      return null as TUser;
    } else {
      return user;
    }
  }
}
