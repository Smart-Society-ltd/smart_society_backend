import jwt from 'jsonwebtoken';
import { Document, Types } from 'mongoose';

// interface User extends Document {
//   username: String;
// }

const generateToken = (user: any) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET
  );
};

export default generateToken;