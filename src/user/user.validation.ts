import { z, ZodType } from 'zod';
import { RegisterUserRequest } from 'src/model/user.model';

export class UserValidation {
  static readonly REGISTER: ZodType<RegisterUserRequest> = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
    name: z.string().min(1).max(100),
  });
}
