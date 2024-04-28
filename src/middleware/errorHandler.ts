import {logEvents} from './logger';
import {Request, Response} from 'express';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: () => void
) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'errLog.log'
  );

  const status = res.statusCode ? res.statusCode : 500; //server error

  res.status(status);

  res.json({message: err.message});
};

export default errorHandler;
