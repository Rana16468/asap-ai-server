import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../app/error/ApiError';
import { TUser } from './user.interface';
import { users } from './user.model';
import sendEmail from '../../utility/sendEmail';
import emailcontext from '../../utility/emailcontex/sendvarificationData';
import config from '../../app/config';
import { jwtHelpers } from '../../app/jwtHalpers/jwtHalpers';
import { USER_ACCESSIBILITY } from './user.constant';
import bcrypt from 'bcrypt';

const createUserIntoDb = async (payload: TUser) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const otp = Number(Math.floor(100000 + Math.random() * 900000).toString());
    payload.verificationCode = otp;

    const userBuilder = new users(payload);

    const result = await userBuilder.save({ session });

    await sendEmail(
      result.email,
      emailcontext.sendvarificationData(
        result.email,
        otp,
        'User Verification Email',
      ),
      'Verification OTP Code',
    );

    await session.commitTransaction();
    session.endSession();

    return result && { message: 'Checked Your Email Box And Varify' };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new ApiError(
      httpStatus.SERVICE_UNAVAILABLE,
      'User creation failed. Rolled back transaction.',
      error,
    );
  }
};

const userVarificationIntoDb = async (verificationCode: number) => {
  try {
    if (!verificationCode) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Verification code is required',
        '',
      );
    }

    const updatedUser = await users.findOneAndUpdate(
      { verificationCode },
      { isVerify: true },
      { new: true },
    );

    if (!updatedUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Invalid verification code', '');
    }

    const jwtPayload = {
      id: updatedUser.id,
      role: updatedUser.role,
      email: updatedUser.email,
    };

    let accessToken: string | null = null;

    if (updatedUser.isVerify) {
      accessToken = jwtHelpers.generateToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.expires_in as string,
      );
    }

    return {
      message: 'User verification successful',
      accessToken,
    };
  } catch (error: any) {
    throw new ApiError(
      httpStatus.SERVICE_UNAVAILABLE,
      'Verification auth error',
      error,
    );
  }
};

const chnagePasswordIntoDb = async (
  payload: {
    newpassword: string;
    oldpassword: string;
  },
  id: string,
) => {
  try {
    const isUserExist = await users.findOne(
      {
        $and: [
          { _id: id },
          { isVerify: true },
          { status: USER_ACCESSIBILITY.isProgress },
          { isDelete: false },
        ],
      },
      { password: 1 },
    );

    if (
      await users.isPasswordMatched(
        config.googleauth as string,
        isUserExist?.password as string,
      )
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "social media auth don't allow change password",
        '',
      );
    }

    if (!isUserExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found', '');
    }

    if (
      !(await users.isPasswordMatched(
        payload.oldpassword,
        isUserExist?.password,
      ))
    ) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Old password does not match',
        '',
      );
    }

    const newHashedPassword = await bcrypt.hash(
      payload.newpassword,
      Number(config.bcrypt_salt_rounds),
    );

    const updatedUser = await users.findByIdAndUpdate(
      id,
      { password: newHashedPassword },
      { new: true },
    );
    if (!updatedUser) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'password  change database error',
        '',
      );
    }

    return {
      success: true,
      message: 'Password updated successfully',
    };
  } catch (error: any) {
    throw new ApiError(
      httpStatus.SERVICE_UNAVAILABLE,
      'Password change failed',
      error,
    );
  }
};

const UserServices = {
  createUserIntoDb,
  userVarificationIntoDb,
  chnagePasswordIntoDb,
};

export default UserServices;
