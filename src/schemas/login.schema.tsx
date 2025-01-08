import {Schema} from '@utils';
import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  username: yup.string().required(Schema.noEmpty),
  password: yup.string().min(6, Schema.minPassword).required(Schema.noEmpty),
});

export type LoginInput = yup.InferType<typeof loginSchema>;
