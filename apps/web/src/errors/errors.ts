class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class ApiError extends AppError {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public field?: string,
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class ResponseError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = "ResponseError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export { AppError, ApiError, ResponseError };
