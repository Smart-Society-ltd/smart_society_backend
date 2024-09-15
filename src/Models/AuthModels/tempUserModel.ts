import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema(
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
      required: true,
      unique: true,
    },
    society_code: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    flat_no: {
      type: String,
    },
    floor_no: {
      type: String,
    },
    flat_type: {
      type: String,
    },
  },
  { timestamps: true }
);

const TempUser = mongoose.model("TempUser", tempUserSchema);
export default TempUser;