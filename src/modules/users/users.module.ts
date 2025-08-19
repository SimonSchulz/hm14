import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersQueryRepository } from './infrastructure/repositories/users.query.repository';
import { UsersRepository } from './infrastructure/repositories/users.repository';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './infrastructure/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth/application/auth.service';
import { BcryptService } from '../auth/application/bcrypt.service';
import { NodemailerService } from '../auth/application/nodemailer.service';
import { AuthController } from '../auth/controllers/auth.controller';
import { LocalStrategy } from '../auth/guards/local/local.strategy';
import { JwtStrategy } from '../auth/guards/bearer/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import {
  BasicGuard,
  BasicStrategy,
} from '../auth/guards/basic/basic-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'access-token-secret',
      signOptions: { expiresIn: '6m' },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    UsersQueryRepository,
    UsersRepository,
    AuthService,
    BcryptService,
    NodemailerService,
    LocalStrategy,
    JwtStrategy,
    BasicStrategy,
    BasicGuard,
  ],
  exports: [
    MongooseModule,
    UsersService,
    UsersQueryRepository,
    UsersRepository,
  ],
})
export class UsersModule {}
