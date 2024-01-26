class AppError extends Error {
  statusCode: number;
  description: string;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.description = message;
  }
}

export default AppError;
