import { BadRequestException, Injectable } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { NodemailerService } from './nodemailer.service';
import { UsersQueryRepository } from '../../users/infrastructure/repositories/users.query.repository';
import { User } from '../../users/domain/entities/user.entity';
import { emailExamples } from '../domain/tamplates/email-confirmation-message';
import { UsersService } from '../../users/application/users.service';
import { DomainException } from '../../../core/exeptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exeptions/domain-exception-codes';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly bcryptService: BcryptService,
    private readonly nodemailerService: NodemailerService,
  ) {}
  async login(loginOrEmail: string, password: string) {
    const user = await this.validateUser(loginOrEmail, password);
    if (!user) return null;

    //return { accessToken, refreshToken };
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

  async registerUser(
    login: string,
    pass: string,
    email: string,
  ): Promise<string> {
    const isUserExists =
      await this.usersQueryRepository.checkExistByLoginOrEmail(login, email);

    if (isUserExists) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'wrong credentials',
      });
    }

    const passwordHash = await this.bcryptService.generateHash(pass);
    const newUser = new User(login, email, passwordHash);

    const id = await this.usersService.create(newUser);

    this.nodemailerService
      .sendEmail(
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
        emailExamples.registrationEmail,
      )
      .catch((err) => console.error('Error in send email:', err));

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
    await this.nodemailerService.sendEmail(
      email,
      recovery.recoveryCode!,
      emailExamples.registrationEmail,
    );
  }
  async confirmRegistration(code: string) {
    return this.usersService.setConfirmationEmail(code);
  }
  async resendConfirmationEmail(email: string) {
    const code = await this.usersService.updateConfirmationEmail(email);
    if (!code) return false;
    await this.nodemailerService.sendEmail(
      email,
      code,
      emailExamples.registrationEmail,
    );
    return true;
  }
}
