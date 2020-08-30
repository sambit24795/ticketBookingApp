export abstract class CustomeError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomeError.prototype);
  }

  abstract serializedErrors(): { message: string; field?: string }[];
}
