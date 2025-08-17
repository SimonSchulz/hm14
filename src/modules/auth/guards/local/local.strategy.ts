import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../../application/auth.service';
import { UserContextDto } from '../../../../core/dto/user-context.dto';
import { DomainException } from '../../../../core/exeptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exeptions/domain-exception-codes';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login' });
  }
  async validate(username: string, password: string): Promise<UserContextDto> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Invalid username or password',
      });
    }

    return user as UserContextDto;
  }
}
