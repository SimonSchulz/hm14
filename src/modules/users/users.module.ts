import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersQueryRepository } from './infrastructure/repositories/users.query.repository';
import { UsersRepository } from './infrastructure/repositories/users.repository';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './infrastructure/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersQueryRepository, UsersRepository],
  exports: [
    MongooseModule,
    UsersService,
    UsersQueryRepository,
    UsersRepository,
  ],
})
export class UsersModule {}
