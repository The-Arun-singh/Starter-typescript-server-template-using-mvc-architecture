import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../models/user';
import {IUser} from '../types/types';

interface JwtPayload {
  id: string;
}

interface IRequest extends Request {
  user?: IUser;
}

export const authorization = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers['authorization'];

    if (!authorization) {
      return res.status(401).json({error: 'Invalid authorization'});
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({error: 'Invalid token'});
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    if (payload && typeof payload === 'object') {
      const id = (payload as JwtPayload).id;
      if (!id) {
        return res.status(401).json({error: 'Invalid token'});
      }

      const user = await User.findOne({_id: id});

      if (!user) {
        return res.status(404).json({error: 'User not found'});
      }

      req.user = user;
      return next();
    } else {
      throw new Error('Invalid token payload');
    }
  } catch (error: any) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({error: 'Invalid token'});
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({error: 'Token expired'});
    } else {
      return res.status(500).json({error: 'Internal Server Error'});
    }
  }
};

export const checkAdminAuth = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({error: 'Invalid authorization'});
    }

    const userRole = req.user.role;

    if (!userRole) {
      return res.status(401).json({error: 'Invalid user role'});
    }

    if (userRole !== 'admin') {
      return res.status(401).json({error: 'Invalid authorization'});
    }

    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: 'Internal Server Error'});
  }
};
