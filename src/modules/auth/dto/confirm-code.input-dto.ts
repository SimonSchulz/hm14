import { IsString } from 'class-validator';

export class ConfirmCodeDto {
  @IsString()
  readonly code!: string;
}
