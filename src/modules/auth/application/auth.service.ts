import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { NodemailerService } from './nodemailer.service';
import { UsersQueryRepository } from '../../users/infrastructure/repositories/users.query.repository';
import { JwtService } from '@nestjs/jwt';
import { emailExamples } from '../domain/tamplates/email-confirmation-message';
import { UsersService } from '../../users/application/users.service';
import { DomainException } from '../../../core/exeptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exeptions/domain-exception-codes';
import { RegistrationInputDto } from '../dto/registration-input.dto';
import { UserContextDto } from '../../../core/dto/user-context.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly bcryptService: BcryptService,
    private readonly nodemailerService: NodemailerService,
    private jwtService: JwtService,
  ) {}
  login(userId: string) {
    const accessToken = this.jwtService.sign({
      id: userId,
    } as UserContextDto);

    return {
      accessToken,
    };
  }

  async validateUser(loginOrEmail: string, password: string) {
    const user =
      await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return null;

    const isPassValid = await this.bcryptService.checkPassword(
      password,
      user.passwordHash,
    );

    if (!isPassValid) return null;

    return user;
  }

  async registerUser(dto: RegistrationInputDto): Promise<string> {
    await this.usersQueryRepository.checkExistByLoginOrEmail(
      dto.login,
      dto.email,
    );
    const id = await this.usersService.create(dto);
    const user = await this.usersQueryRepository.findByLoginOrEmail(dto.email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    this.nodemailerService.sendEmail(
      user.email,
      user.emailConfirmation.confirmationCode,
      emailExamples.registrationEmail,
    );
    return id;
  }
  async changePassword(
    newPassword: string,
    recoveryCode: string,
  ): Promise<boolean> {
    const passwordHash = await this.bcryptService.generateHash(newPassword);
    return await this.usersService.setNewPassword(passwordHash, recoveryCode);
  }
  async getUserData(id: string) {
    return this.usersQueryRepository.me(id);
  }
  async passwordRecovery(email: string) {
    const user = await this.usersQueryRepository.findByLoginOrEmail(email);
    if (!user) return null;
    user.setRecoveryCode();
    await user.save();
    const recovery = user.passwordRecovery;
    this.nodemailerService.sendEmail(
      email,
      recovery.recoveryCode,
      emailExamples.registrationEmail,
    );
  }
  async confirmRegistration(code: string) {
    const result = await this.usersService.setConfirmationEmail(code);
    if (!result) {
      throw new BadRequestException('email already confirmed or not exist');
    }
  }
  async resendConfirmationEmail(email: string) {
    const code = await this.usersService.updateConfirmationEmail(email);
    if (!code) return false;
    this.nodemailerService.sendEmail(
      email,
      code,
      emailExamples.registrationEmail,
    );
    return true;
  }
}
