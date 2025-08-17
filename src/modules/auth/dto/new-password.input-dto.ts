import { IsString } from 'class-validator';
import { IsStringWithTrim } from '../../../core/decorators/validation/is-string-with-trim';
import { passwordConstraints } from '../../../core/constraints/constraints';

export class NewPasswordInputDto {
  @IsString()
  readonly recoveryCode!: string;
  @IsStringWithTrim(
    passwordConstraints.minLength,
    passwordConstraints.maxLength,
  )
  readonly newPassword!: string;
}
