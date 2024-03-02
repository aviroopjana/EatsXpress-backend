import { Response } from 'express';

export const errorHandler = (res: Response, statusCode: number, message: string): void => {
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message
  });
};
