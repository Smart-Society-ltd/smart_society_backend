// src/types/express.d.ts (recommended location)
import { IUser } from '../models/AuthModels/userModel.js';


declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
