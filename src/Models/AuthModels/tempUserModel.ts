import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
    password: {
      type: String,
      required: true,
    },
    society_code: {
      type:String,
      required: true
    },
    role: {
      type: String,
      required: true,
    },
    flat_no:{
      type: String,
      required: true,
    },
    flat_type:{
      type: String,
    },
    floor_no:{
      type: String,
    },
  },
  { timestamps: true }
);

const TempUser = mongoose.model('TempUser', tempUserSchema);
export default TempUser;