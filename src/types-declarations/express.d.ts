// Import the necessary modules from Express and your User model
import { IUser } from '../models/AuthModels/userModel.ts';

declare module 'express' {
    export interface Request {
        user?: IUser;
    }
}
