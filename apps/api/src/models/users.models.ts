import mongoose from "mongoose";

/* ================================================================================================= */
/*  SUB-SCHEMAS                                                                                      */
/* ================================================================================================= */

interface DBPasswordMetadata {
  algorithm?: string;
  updatedAt?: Date;
  failedLoginAttempts?: number;
  lockUntil?: Date;
}

const PasswordMetadataSchema = new mongoose.Schema<DBPasswordMetadata>(
  {
    algorithm: {
      type: String,
      enum: ["bcrypt"],
      default: "bcrypt",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

interface DBCredentials {
  passwordHash: string;
  passwordMetadata: DBPasswordMetadata;
}

const CredentialsSchema = new mongoose.Schema<DBCredentials>(
  {
    passwordHash: {
      type: String,
      required: true,
    },
    passwordMetadata: {
      type: PasswordMetadataSchema,
      required: true,
    },
  },
  { _id: false },
);

interface DBAuth {
  accessTokenVersion: number;
}

const AuthSchema = new mongoose.Schema<DBAuth>(
  {
    accessTokenVersion: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false },
);

interface DBAccount {
  username: string;
  email: string;
  lastLogin?: Date;
}

const AccountSchema = new mongoose.Schema<DBAccount>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

interface DBProfile {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  heightCm?: number;
  weightKg?: number;
}

const ProfileSchema = new mongoose.Schema<DBProfile>(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    heightCm: {
      type: Number,
      min: 0,
    },
    weightKg: {
      type: Number,
      min: 0,
    },
  },
  { _id: false },
);

/* ================================================================================================= */
/*  MAIN USER SCHEMA                                                                                 */
/* ================================================================================================= */

interface DBUser {
  userId: string;
  role: "user" | "admin";
  credentials: DBCredentials;
  auth: DBAuth;
  account: DBAccount;
  profile: DBProfile;
  _id: string;
  __v: number;
}

const UserSchema = new mongoose.Schema<DBUser>(
  {
    userId: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },

    credentials: {
      type: CredentialsSchema,
      required: true,
    },

    auth: {
      type: AuthSchema,
      required: true,
    },

    account: {
      type: AccountSchema,
      required: true,
    },

    profile: {
      type: ProfileSchema,
      default: {},
    },
  },
  { timestamps: true },
);

/* ================================================================================================= */
/*  Not leaking sensitive data to JSON                                                               */
/* ================================================================================================= */

// const transformUser = (_: unknown, ret: Record<string, unknown>) => {
//   const result = ret as {
//     _id?: unknown;
//     __v?: unknown;
//     credentials?: unknown;
//     auth?: unknown;
//     profile?: unknown;
//   };
//   delete result._id;
//   delete result.__v;
//   delete result.credentials;
//   delete result.auth;

//   if (!result.profile) {
//     result.profile = {};
//   }

//   return result;
// };

import type { UserResponse } from "../../../../packages/shared/types/users/users.responses.js";

const transformUser = (_: unknown, ret: DBUser) => {
  delete ret._id;
  delete ret.__v;
  delete ret.credentials;
  delete ret.auth;

  if (!ret.profile) {
    ret.profile = {};
  }

  return ret;
};

UserSchema.set("toJSON", {
  transform: transformUser,
});

/* ================================================================================================= */
/*  INDEXES                                                                                          */
/* ================================================================================================= */

UserSchema.index({ userId: 1 }, { unique: true });

UserSchema.index({ "account.username": 1 }, { unique: true });

UserSchema.index({ "account.email": 1 }, { unique: true });

/* ================================================================================================= */
/*  EXPORTS                                                                                         */
/* ================================================================================================= */

export default mongoose.model("User", UserSchema);

export type {
  DBUser,
  DBProfile,
  DBAccount,
  DBAuth,
  DBCredentials,
  DBPasswordMetadata,
};
