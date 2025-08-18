import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/repositories/users.repository';
import { InputUserDto } from '../dto/user.input.dto';
import { User } from '../domain/entities/user.entity';
import { UsersQueryRepository } from '../infrastructure/repositories/users.query.repository';
import { BcryptService } from '../../auth/application/bcrypt.service';
import { UserDocument } from '../infrastructure/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async create(dto: InputUserDto, admin?: boolean): Promise<string> {
    const existUser = await this.usersQueryRepository.findByLoginOrEmail(
      dto.email,
    );
    if (existUser) throw new BadRequestException('email already exists');
    dto.password = await this.bcryptService.generateHash(dto.password);
    const user = User.createUser(dto.login, dto.email, dto.password, admin);
    return this.usersRepository.create(user);
  }

  async delete(id: string): Promise<boolean> {
    return this.usersRepository.delete(id);
  }
  async setNewPassword(
    passwordHash: string,
    recoveryCode: string,
  ): Promise<boolean> {
    const user = (await this.usersRepository.findByRecoveryCode(
      recoveryCode,
    )) as UserDocument;
    if (!user) return false;
    const recovery = user.passwordRecovery;
    if (recovery.expirationDate && recovery.expirationDate < new Date()) {
      return false;
    }
    user.setPassword(passwordHash);
    await user.save();
    return true;
  }
  async setConfirmationEmail(confirmationCode: string): Promise<boolean> {
    const user = (await this.usersRepository.findByConfirmationCode(
      confirmationCode,
    )) as UserDocument;
    if (!user) {
      return false;
    }
    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException('email already confirmed');
    }
    const recovery = user.emailConfirmation;
    if (
      confirmationCode !== recovery.confirmationCode ||
      (recovery.expirationDate && recovery.expirationDate < new Date())
    ) {
      return false;
    }
    user.setEmailConfirmation();
    await user.save();
    return true;
  }
  async updateConfirmationEmail(email: string) {
    const user = (await this.usersQueryRepository.findByLoginOrEmail(
      email,
    )) as UserDocument;
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException('email already confirmed');
    }
    user.setEmailConfirmationCode();
    await user.save();
    return user.emailConfirmation.confirmationCode;
  }
}
