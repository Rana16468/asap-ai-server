import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../app/config';
import { USER_ACCESSIBILITY, USER_ROLE } from './user.constant';

const TUserSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: [true, 'user name is Required'] },
    password: { type: String, required: [true, 'Password is Required'] },
    email: {
      type: String,
      required: [true, 'Email is Required'],
      trim: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'phone number is required'],
      unique: true,
    },

    verificationCode: {
      type: Number,
      required: [true, 'verification Code is Required'],
      unique: true,
    },
    isVerify: {
      type: Boolean,
      required: [false, 'isVartify is  not required'],
      default: false,
    },

    role: {
      type: String,
      enum: {
        values: [USER_ROLE.artist, USER_ROLE.client, USER_ROLE.businessOwner],
        message: '{VALUE} is Not Required',
      },
      required: [true, 'Role is Required'],
      default: USER_ROLE.client,
    },
    status: {
      type: String,
      enum: {
        values: [USER_ACCESSIBILITY.isProgress, USER_ACCESSIBILITY.blocked],
        message: '{VALUE} is not required',
      },
      required: [true, 'Status is Required'],
      default: 'is-Progress',
    },
    photo: { type: String, required: [false, 'photo is bnot required'] },
    isDelete: {
      type: Boolean,
      required: [true, 'isDeleted is Required'],
      default: false,
    },
  },
  {
    timestamps: true, //createAt  and updateAt
  },
);

TUserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

// mongoose middlewere
TUserSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});
TUserSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

TUserSchema.pre('find', function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});
TUserSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});
TUserSchema.pre('findOne', function (next) {
  this.find({ isDelete: { $ne: true } });

  next();
});

TUserSchema.statics.isUserExistByCustomId = async function (id: string) {
  return await users.findOne({ id });
};
TUserSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashPassword: string,
) {
  const password = await bcrypt.compare(plainTextPassword, hashPassword);
  return password;
};
TUserSchema.statics.isJWTIssuesBeforePasswordChange = async function (
  passwordChangeTimestamp: Date,
  jwtIssuesTime: number,
) {
  const passwordChangeTime = new Date(passwordChangeTimestamp).getTime() / 1000;
  return passwordChangeTime > jwtIssuesTime;
};

export const users = model<TUser, UserModel>('users', TUserSchema);
