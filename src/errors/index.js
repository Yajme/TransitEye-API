import HttpStatus from "#src/utils/http-status-codes";
class AppError extends Error {
  constructor(message, status = 500, code = "INTERNAL_ERROR", details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;   // HTTP status code
    this.code = code;       // App-specific error code
    this.details = details; // Extra context
    Error.captureStackTrace?.(this, this.constructor);
  }
}


export class ValidationError extends AppError {
  constructor(message = "Validation failed", details = {}) {
    super(message, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", details);
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized", details = {}) {
    super(message, 401, "AUTH_ERROR", details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details = {}) {
    super(message, 403, "FORBIDDEN_ERROR", details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details = {}) {
    super(message, 404, "NOT_FOUND_ERROR", details);
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database error", details = {}) {
    super(message, 500, "DATABASE_ERROR", details);
  }
}
