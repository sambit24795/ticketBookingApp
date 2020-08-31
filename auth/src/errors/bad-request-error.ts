import { CustomeError } from "./custom-error";

export class BadRequestError extends CustomeError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializedErrors() {
    return [{ message: this.message }];
  }
}
