import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@ExtractUserFromRequest() user: UserContextDto) {
    return this.authService.login(user.id);
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() dto: RegistrationInputDto) {
    await this.authService.registerUser(dto);
  }

  @Post('registration-confirmation')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async confirmRegistration(@Body() dto: ConfirmCodeDto) {
    return this.authService.confirmRegistration(dto.code);
  }

  @Post('registration-email-resending')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async resendConfirmationEmail(@Body() dto: ResendingInputDto) {
    return this.authService.resendConfirmationEmail(dto.email);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUser(@ExtractUserFromRequest() user: UserContextDto) {
    return this.authService.getUserData(user.id);
  }

  // @Post('refresh-token')
  // @UseGuards(RefreshTokenGuard)
  // async refreshToken(@ExtractUserFromRequest() user: UserContextDto) {
  //   return this.authService.refreshToken(user);
  // }

  // @Post('logout')
  // @UseGuards(RefreshTokenGuard)
  // async logout(@ExtractUserFromRequest() user: UserContextDto) {
  //   return this.authService.logout(user);
  // }

  @Post('new-password')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async newPassword(@Body() dto: NewPasswordInputDto) {
    return this.authService.changePassword(dto.newPassword, dto.recoveryCode);
  }
  @Post('password-recovery')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async passwordRecovery(@Body() dto: ResendingInputDto) {
    return this.authService.passwordRecovery(dto.email);
  }
}
