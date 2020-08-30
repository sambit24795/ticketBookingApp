import { CustomeError } from "../errors/custom-error";

export class NotFoundError extends CustomeError {
  statusCode = 404;

  constructor() {
    super("Route not found");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializedErrors() {
    return [{ message: "Not Found" }];
  }
}
