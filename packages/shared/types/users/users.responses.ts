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

interface UserUpdateResponse {
  savedProfile: UserResponse["userData"]["profile"];
}

export type { UserResponse, UserUpdateResponse };
