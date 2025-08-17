import { AuthController } from './controllers/auth.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './application/auth.service';
import { BcryptService } from './application/bcrypt.service';
import { NodemailerService } from './application/nodemailer.service';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    JwtModule.register({
      secret: 'access-token-secret',
      signOptions: { expiresIn: '60m' }, // Время жизни токена
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, BcryptService, NodemailerService],
  exports: [],
})
export class AuthModule {}
