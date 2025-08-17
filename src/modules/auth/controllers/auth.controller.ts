import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginInputDto } from '../dto/login-input-dto';
import { RegistrationInputDto } from '../dto/registration-input.dto';
import { ConfirmCodeDto } from '../dto/confirm-code.input-dto';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../../core/decorators/transform/extract-user-from-request.decorator';
import { UserContextDto } from '../../../core/dto/user-context.dto';
import { ResendingInputDto } from '../dto/resending.input-dto';
import { NewPasswordInputDto } from '../dto/new-password.input-dto';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/login
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() dto: LoginInputDto) {
    return this.authService.login(dto.loginOrEmail, dto.password);
  }

  // POST /auth/registration
  @Post('registration')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() dto: RegistrationInputDto) {
    await this.authService.registerUser(dto);
  }

  // POST /auth/registration-confirmation
  @Post('registration-confirmation')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async confirmRegistration(@Body() dto: ConfirmCodeDto) {
    return this.authService.confirmRegistration(dto.code);
  }

  // POST /auth/registration-email-resending
  @Post('registration-email-resending')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async resendConfirmationEmail(@Body() dto: ResendingInputDto) {
    return this.authService.resendConfirmationEmail(dto.email);
  }

  // GET /auth/me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUser(@ExtractUserFromRequest() user: UserContextDto) {
    return this.authService.getUserData(user.id);
  }

  // POST /auth/refresh-token
  // @Post('refresh-token')
  // @UseGuards(RefreshTokenGuard)
  // async refreshToken(@ExtractUserFromRequest() user: UserContextDto) {
  //   return this.authService.refreshToken(user);
  // }

  // // POST /auth/logout
  // @Post('logout')
  // @UseGuards(RefreshTokenGuard)
  // async logout(@ExtractUserFromRequest() user: UserContextDto) {
  //   return this.authService.logout(user);
  // }

  // POST /auth/new-password
  @Post('new-password')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async newPassword(@Body() dto: NewPasswordInputDto) {
    return this.authService.changePassword(dto.newPassword, dto.recoveryCode);
  }

  // POST /auth/password-recovery
  @Post('password-recovery')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async passwordRecovery(@Body() dto: ResendingInputDto) {
    return this.authService.passwordRecovery(dto.email);
  }
}
