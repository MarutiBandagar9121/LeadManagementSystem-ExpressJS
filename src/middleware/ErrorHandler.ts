import { Request, Response, NextFunction } from 'express';
import ApiErrorResponse from '../models/ApiErrorResponse';
import ResourceNotFoundError from '../errors/ResourceNotFoundError';
import ErrorCodesEnum from '../constants/ErrorCodesEnum';
import InvalidDataFormat from '../errors/InvalidDataFormat';
import DuplicateRecordError from '../errors/DuplicateRecordError';


export const ErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error occurred:', error);

  let statusCode = 500;
  let errorCode = ErrorCodesEnum.SERVER_ERROR;
  let message = 'Internal server error';
  let details = ""

  if (error instanceof ResourceNotFoundError || error instanceof InvalidDataFormat || error instanceof DuplicateRecordError) {
    statusCode = error.statusCode;
    errorCode = error.code;
    message = error.message;
    details = error.details;
  }

  const errorResponse: ApiErrorResponse = {
    success: false,
    error: {
      code: errorCode,
      message: message,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      details: details
    }
  };

  res.status(statusCode).json(errorResponse);
};