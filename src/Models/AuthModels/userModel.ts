import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  mb_no: string;
  email: string;
  society_code: string;
  role: string;
  flat_no: string;
  flat?: mongoose.Types.ObjectId;
  isVerified: boolean;
  tempUserId?: mongoose.Types.ObjectId;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  forgetPasswordToken?: string;
  forgetPasswordTokenExpiry?: Date;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mb_no: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
    },
    society_code: {
      type: String,
    },
    role: {
      type: String,
      default: "undefined",
    },
    flat_no: {
      type: String,
    },
    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    tempUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TempUser",
    },
    verifyToken: {
      type: String,
    },
    verifyTokenExpiry: {
      type: Date,
    },
    forgetPasswordToken: {
      type: String,
    },
    forgetPasswordTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
