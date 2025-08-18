import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../../core/decorators/validation/public.decorator';
@Injectable()
export class BasicAuthGuard implements CanActivate {
  private readonly validUsername = 'admin';
  private readonly validPassword = 'qwerty';

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (!('authorization' in request.headers)) {
      return true;
    }
    const authHeader = request.headers.authorization;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    if (authHeader === undefined || !authHeader.startsWith('Basic ')) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const base64Credentials = authHeader.split(' ')[1];
    let credentials: string;
    try {
      credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    } catch {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const [username, password] = credentials.split(':');

    if (!username || !password) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (username === this.validUsername && password === this.validPassword) {
      return true;
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
