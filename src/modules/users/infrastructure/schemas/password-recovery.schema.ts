import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class PasswordRecovery {
  @Prop({ required: true, default: null })
  recoveryCode!: string;

  @Prop({ required: true, type: Date, default: null })
  expirationDate!: Date;
}

export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);
