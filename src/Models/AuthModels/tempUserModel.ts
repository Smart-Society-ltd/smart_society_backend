import mongoose from "mongoose";

interface tempUserInterface extends Document {
  user_id: string;
  floor_no: string;
  flat_type: string;
}

const tempUserSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
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

const TempUser = mongoose.model<tempUserInterface>("TempUser", tempUserSchema);
export default TempUser;