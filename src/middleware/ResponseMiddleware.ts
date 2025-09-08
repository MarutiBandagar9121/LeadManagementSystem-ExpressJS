import { Request, Response, NextFunction } from 'express';
import ApiSuccessResponse from '../models/APiSuccessResponse';

export const ResponseMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  
  (res as any).sendSuccessResponse = function<T>(
    data: T, 
    message?: string, 
    statusCode: number = 200
  ): Response {
        const response: ApiSuccessResponse<T> = {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString()
        };
        
        return this.status(statusCode).json(response);
    }
    console.log('Calling next()');
    next();
}