import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../Models/AuthModels/userModel.js';

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(403).json({ error: 'Invalid user' });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export default authenticateToken;