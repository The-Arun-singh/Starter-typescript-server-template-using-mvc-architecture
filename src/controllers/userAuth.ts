import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {IUser} from '../types/types';
import User from '../models/user';

const secretKey: string = process.env.SECRET_KEY as string;

export const userSignup = async (req: Request, res: Response): Promise<any> => {
  try {
    const body = req.body;
    const {username, password, role} = body as Pick<
      IUser,
      'username' | 'password' | 'role'
    >;
    if (username === '' || password === '')
      return res
        .status(400)
        .json({message: 'username or password or role not provided'});

    const hashPassword = await bcrypt.hash(password, 10);
    const user: IUser = await User.create({
      username,
      password: hashPassword,
      role: role,
    });

    return res.send(200).json({message: 'User signed', user: user});
  } catch (error) {
    return res.status(500).json({message: 'Error', error: error});
  }
};
export const userLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const {username, password} = req.body as Pick<
      IUser,
      'username' | 'password'
    >;
    if (username === '' || password === '')
      return res
        .status(400)
        .json({message: 'please provide a username and password'});

    const user = await User.findOne({username: username});
    if (!user) res.status(404).json({message: 'user not found'});

    const comparePassword = await bcrypt.compare(password, user!.password);

    if (!comparePassword)
      res.status(400).json({message: 'password is incorrect'});

    const token = jwt.sign(user!, secretKey, {expiresIn: '1hr'});

    const authUser = await User.findById(user!.id).select('-password').exec();

    return res.send(200).json({
      message: 'User Logged in successfully',
      token: token,
      authUser: authUser,
    });
  } catch (error) {
    return res.status(500).json({message: 'Error', error: error});
  }
};
