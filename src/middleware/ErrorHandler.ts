import { Request, Response, NextFunction } from 'express';
import ApiErrorResponse from '../models/ApiErrorResponse';
import InvalidIdError from '../errors/InvalidIdError';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error occurred:', error);

  let statusCode = 500;
  let errorCode = "INTERNAL_SERVER_ERROR";
  let message = 'Internal server error';

  if (error instanceof InvalidIdError) {
    statusCode = error.statusCode;
    errorCode = error.code;
    message = error.message;
  }

  const errorResponse: ApiErrorResponse = {
    success: false,
    error: {
      code: errorCode,
      message: message,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      requestId: req.headers['x-request-id'] as string
    }
  };

  res.status(statusCode).json(errorResponse);
};