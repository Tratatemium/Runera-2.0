const API = {
  auth: {
    signup: "auth/signup",
    login: "auth/login",
    logout: "auth/logout",
  },
  users: {
    me: "users/me",
    account: "users/me/account",
    profile: "users/me/profile",
  },
  runs: {
    myRuns: "users/me/runs",
    runs: "runs",
  },
};

export { API };
