interface UserState {
  account: {
    email: string;
    username: string;
  };
  profile: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    heightCm?: number;
    weightKg?: number;
  };
  role: "user" | "admin";
}

interface UserResponse {
  userData: {
    userId: string;
    account: {
      email: string;
      lastLogin: string;
      username: string;
    };
    profile: {
      firstName?: string;
      lastName?: string;
      dateOfBirth?: string;
      heightCm?: number;
      weightKg?: number;
    };
    role: "user" | "admin";
    createdAt: string;
    updatedAt: string;
  };
}

interface UpdateUserPayload {
  profile: UserState["profile"];
}

interface UserUpdateResponse {
  savedProfile: UserResponse["userData"]["profile"];
}

export type { UserState, UserResponse, UpdateUserPayload, UserUpdateResponse };
