import {Request, Response} from 'express';
import {format} from 'date-fns';
import {v4 as uuid} from 'uuid';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

export const logEvents = async (message: string, logFileName: string) => {
  const dateTime = format(new Date(), 'yyyyMMdd/tHH:mm:ss');
  const logItem = `${dateTime}\t ${uuid()} \t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }
    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', logFileName),
      logItem
    );
  } catch (e) {
    throw e;
  }
};

export const logger = (req: Request, res: Response, next: () => void) => {
  logEvents(`${req.method}\t ${req.url}\t ${req.headers.origin}`, 'reqLog.log');
  console.log(
    `${req.method}\t ${req.path} \t ${JSON.stringify(req.headers.origin)}`
  );
  next();
};
