import { ValidationError } from "express-validator";

import { CustomeError } from "./custom-error";

export class RequestValidationError extends CustomeError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request Parameters');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializedErrors() {
    return this.errors.map((error) => ({
      message: error.msg,
      field: error.param,
    }));
  }
}
