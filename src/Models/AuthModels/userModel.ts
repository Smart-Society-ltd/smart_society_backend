import mongoose, { Schema, model, InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    mb_no: { type: String, required: true, unique: true },
    email: { type: String, required: [true, "Email is Required"], unique: true },
    society_code: { type: String },
    role: { type: String, default: "undefined" },
    flat_no: { type: String },
    flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat" },
    isVerified: { type: Boolean, default: false },
    // tempUserId: { type: mongoose.Schema.Types.ObjectId, ref: "TempUser" },
    verifyToken: { type: String },
    verifyTokenExpiry: { type: Date },
    forgetPasswordToken: { type: String },
    forgetPasswordTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

// Infer the type automatically
type UserInterface = InferSchemaType<typeof userSchema>;

const User = model<UserInterface>("User", userSchema);

export { User, UserInterface };
