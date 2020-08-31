import { CustomeError } from "./custom-error";

export class NotAuthorizedError extends CustomeError {
  statusCode = 401;

  constructor() {
    super("Not Authorized");
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializedErrors() {
    return [{ message: "Not Authorized" }];
  }
}
