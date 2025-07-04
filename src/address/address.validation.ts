import {
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
} from 'src/model/address.model';
import { z, ZodType } from 'zod';

export class AddressValidation {
  static readonly CREATE: ZodType<CreateAddressRequest> = z.object({
    contact_id: z.number().min(1).positive(),
    street: z.string().min(1).max(255).optional(),
    city: z.string().min(1).max(100).optional(),
    province: z.string().min(1).max(100).optional(),
    country: z.string().min(1).max(100),
    postal_code: z.string().min(1).max(10),
  });

  static readonly GET: ZodType<GetAddressRequest> = z.object({
    contact_id: z.number().min(1).positive(),
    address_id: z.number().min(1).positive(),
  });

  static readonly UPDATE: ZodType<UpdateAddressRequest> = z.object({
    id: z.number().min(1).positive(),
    contact_id: z.number().min(1).positive(),
    street: z.string().min(1).max(255).optional(),
    city: z.string().min(1).max(100).optional(),
    province: z.string().min(1).max(100).optional(),
    country: z.string().min(1).max(100),
    postal_code: z.string().min(1).max(10),
  });

  static readonly REMOVE: ZodType<RemoveAddressRequest> = z.object({
    contact_id: z.number().min(1).positive(),
    address_id: z.number().min(1).positive(),
  });
}
