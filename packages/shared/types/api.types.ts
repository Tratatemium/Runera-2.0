interface ApiResponse {
  data?: unknown;
  error?: {
    message: string;
    name: string;
    field?: string;
  };
}

export type { ApiResponse };
