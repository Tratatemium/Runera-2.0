interface ErrorData {
  error: {
    message: string;
    name: string;
    field?: string;
  };
}

export type { ErrorData };
