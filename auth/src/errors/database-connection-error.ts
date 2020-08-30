import { CustomeError } from "./custom-error";

export class DatabaseConnectionError extends CustomeError {
  reason = "Error connecting Database";
  statusCode = 500;

  constructor() {
    super("Error connecting DB");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializedErrors() {
    return [{ message: this.reason }];
  }
}
