import { z } from 'zod';
import { USER_ACCESSIBILITY, USER_ROLE } from './user.constant';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'User name is Required' }),

    password: z.string({ required_error: 'Password is Required' }),

    email: z
      .string({ required_error: 'Email is Required' })
      .email('Invalid email format')
      .refine(
        (email) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        {
          message: 'Invalid email format',
        },
      ),

    phoneNumber: z
      .string({ required_error: 'Phone number is required' })
      .refine(
        (phone) => {
          return (
            /^(\+?\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,10}$/.test(phone) &&
            phone.replace(/[^0-9]/g, '').length >= 7
          );
        },
        {
          message:
            'Invalid phone number format. Please include country code for international numbers',
        },
      ).default('01828170792'),

    role: z
      .enum([USER_ROLE.artist, USER_ROLE.client, USER_ROLE.businessOwner], {
        required_error: 'Role is Required',
      })
      .default(USER_ROLE.client),

    status: z
      .enum([USER_ACCESSIBILITY.isProgress, USER_ACCESSIBILITY.blocked], {
        required_error: 'Status is Required',
        invalid_type_error: 'Invalid status value',
      })
      .default(USER_ACCESSIBILITY.isProgress),

    photo: z.string().optional(),
  }),
});


const UserVerification = z.object({
  body: z.object({
    verificationCode: z
      .number({ required_error: 'varification code is required' })
      .min(6, { message: 'min 6 character accepted' }),
  }),
});

const ChnagePasswordSchema = z.object({
  body: z.object({
    newpassword: z
      .string({ required_error: 'new password is required' })
      .min(6, { message: 'min 6 character accepted' }),
    oldpassword: z
      .string({ required_error: 'old password is  required' })
      .min(6, { message: 'min 6 character accepted' }),
  }),
});


const UpdateUserProfileSchema=z.object({
     body:z.object({
          username: z
          .string({ required_error: 'user name is required' })
          .min(3, { message: 'min 3 character accepted' })
          .max(15, { message: 'max 15 character accepted' }).optional(),
          photo:z.string({required_error:"optional photot"}).url().optional(),
     }),

})

const UserValidationSchema = {
  createUserZodSchema,
  UserVerification,
  ChnagePasswordSchema,
  UpdateUserProfileSchema
};

export default UserValidationSchema;
