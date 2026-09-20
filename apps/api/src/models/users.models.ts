import type { HealthConsiderations, UserProfile } from "@runera/shared";

import mongoose from "mongoose";

/* ================================================================================================= */
/*  SUB-SCHEMAS                                                                                      */
/* ================================================================================================= */

interface DBPasswordMetadata {
  algorithm: string;
  updatedAt: Date | string;
  failedLoginAttempts?: number;
  lockUntil: Date | null;
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

/* ================================================================================================= */
/*  PROFILE SCHEMA                                                                                 */
/* ================================================================================================= */

type DBProfile = Prettify<
  UserProfile & {
    _id: string;
  }
>;
// interface DBProfile  {

//   firstName?: string;
//   lastName?: string;
//   dateOfBirth?: Date;
//   heightCm?: number;
//   weightKg?: number;
//   gender?: "female" | "male" | "non_binary" | "prefer_not_to_say";
//   runningExperience?: "beginner" | "some" | "experienced" | "competitive";
// }

// interface DBProfile extends UserProfile

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
    gender: {
      type: String,
      enum: ["female", "male", "non_binary", "prefer_not_to_say"],
    },
    runningExperience: {
      type: String,
      enum: ["beginner", "some", "experienced", "competitive"],
    },
  },
  { _id: false },
);

const HealthConsiderationsSchema = new mongoose.Schema<HealthConsiderations>(
  {
    items: [
      {
        type: String,
        enum: [
          "previous_injury",
          "current_injury",
          "breathing",
          "joint_mobility",
          "other",
        ],
      },
    ],
    notes: {
      type: String,
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

function transformUser(_: unknown, ret: DBUser) {
  const { _id, __v, credentials, auth, ...user } = ret;
  // Mongoose 9 omits empty subdocuments; ensure profile is always present
  return { ...user, profile: user.profile ?? {} };
}

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
