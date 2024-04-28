import {Router} from 'express';

const authRouter = Router();

authRouter
  .post('/signup', (req, res) => {
    res.status(200).json({message: 'OK'});
  })
  .post('/login', (req, res) => {
    res.status(200).json({message: 'OK'});
  });

export default authRouter;
