import { z, ZodType } from 'zod';
import {
  CreateContactRequest,
  UpdateContactRequest,
} from 'src/model/contact.model';

export class ContactValidation {
  static readonly CREATE: ZodType<CreateContactRequest> = z.object({
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().min(1).max(100).email().optional(),
    phone: z.string().min(1).max(20).optional(),
  });

  static readonly UPDATE: ZodType<UpdateContactRequest> = z.object({
    id: z.number().positive(),
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().min(1).max(100).email().optional(),
    phone: z.string().min(1).max(20).optional(),
  });
}
