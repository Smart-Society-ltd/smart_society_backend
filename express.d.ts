// Import the necessary modules from Express and your User model
import { IUser } from './src/models/AuthModels/userModel.ts';

declare module 'express' {
    export interface Request {
        user?: IUser;
    }
}
