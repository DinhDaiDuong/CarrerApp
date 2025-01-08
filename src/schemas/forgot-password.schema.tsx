import { Schema } from '@utils';
import * as yup from 'yup';
export const forgotPasswordSchema = yup.object({
  newPassword: yup.string().min(6, Schema.minPassword).required(Schema.noEmpty),
  username: yup.string().required(Schema.noEmpty),
});

export type ForgotPasswordInput = yup.InferType<typeof forgotPasswordSchema>;
