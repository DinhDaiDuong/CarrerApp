import {Schema} from '@utils';
import * as yup from 'yup';
export const signUpSchema = yup.object({
  name: yup.string().required(Schema.noEmpty),
  email: yup.string().email().required(Schema.noEmpty),
  password: yup.string().min(6, Schema.minPassword).required(Schema.noEmpty),
  username: yup.string().required(Schema.noEmpty),
});

export type SignUpInput = yup.InferType<typeof signUpSchema>;
