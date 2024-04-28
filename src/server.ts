import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {logEvents, logger} from './middleware/logger';
import errorHandler from './middleware/errorHandler';
import connectDB from './config/dbConfig';
import mongoose from 'mongoose';

const app = express();

const PORT: string | number = process.env.PORT as string | 4000;

connectDB();

app.use(logger);

app.use(cors());
app.use(bodyParser.json());

app.use(errorHandler);

mongoose.connection.once('open', () => {
  app.listen(PORT, () => console.log(`listening on Port localhost:${PORT}`));
});

mongoose.connection.on('error', err => {
  console.log(err);

  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log'
  );
});
