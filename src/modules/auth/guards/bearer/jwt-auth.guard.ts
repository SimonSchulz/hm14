import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DomainException } from '../../../../core/exeptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exeptions/domain-exception-codes';
import { UserContextDto } from '../../../../core/dto/user-context.dto';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = UserContextDto>(err: any, user: TUser) {
    if (err || !user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Unauthorized',
      });
    }
    return user;
  }
}
