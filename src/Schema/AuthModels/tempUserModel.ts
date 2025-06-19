import mongoose from "mongoose";

interface tempUserInterface extends Document {
  user_id: string;
  society_code: string;
  flat_no: string;
  floor_no: string;
  flat_type: string;
}

const tempUserSchema = new mongoose.Schema(
  {
    user_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User", // link to User model
  required: true,
},
    society_code: {
      type: String,
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

const TempUser = mongoose.model<tempUserInterface>("TempUser", tempUserSchema);
export default TempUser;
