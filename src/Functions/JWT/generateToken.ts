import jwt from 'jsonwebtoken';
import { Document, Types } from 'mongoose';

// Define the Admin interface extending from Mongoose's Document
interface User extends Document {
  email: string;
  _id: Types.ObjectId;
}

const generateToken = (user:User): string => {
  return jwt.sign(
    { id: user._id, email: user.email},
    process.env.JWT_SECRET
  );
};

export default generateToken;