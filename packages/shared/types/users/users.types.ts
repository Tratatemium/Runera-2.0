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

export type { UserState };
