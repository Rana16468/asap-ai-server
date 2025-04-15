import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {

  id: string;
  role: 'client' | 'artist' | 'businessOwner';
  name:string;
  password: string;
  email: string;
  phoneNumber:string;
  verificationCode:number;
  isVerify:boolean;
  status: 'is-Progress' | 'Blocked';
  photo?:string;
  isDelete: boolean;
};

export interface UserModel extends Model<TUser> {
  // eslint-disable-next-line no-unused-vars
  isUserExistByCustomId(id: string): Promise<TUser>;
  // eslint-disable-next-line no-unused-vars
  isPasswordMatched(
    userSendingPassword: string,
    existingPassword: string,
  ): Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  isJWTIssuesBeforePasswordChange(
    passwordChangeTimestamp: Date,
    jwtIssuesTime: number,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
