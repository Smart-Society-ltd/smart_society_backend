import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/AuthModels/userModel.js';

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(403).json({ errorMsg: 'Invalid user' });
    }
    req.user = user;

    next();
  } catch (error) {
    res.status(403).json({ errorMsg: 'Invalid token' });
  }
};

export default authenticateToken;