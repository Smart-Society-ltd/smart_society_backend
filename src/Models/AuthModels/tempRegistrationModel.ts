import mongoose, { Schema, Document } from "mongoose";

interface TempRegistration extends Document {
  name: string;
  mb_no: string;
  email: string;
  society_name: string;
  society_add: string;
  society_city: string;
  society_state: string;
  society_pincode: string;
}

const TempRegistrationSchema: Schema = new Schema({
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
  society_name: {
    type: String,
    required: true,
  },
  society_add: {
    type: String,
    required: true,
  },
  society_city: {
    type: String,
    required: true,
  },
  society_state: {
    type: String,
    required: true,
  },
  society_pincode: {
    type: String,
    required: true,
  },
});

export default mongoose.model<TempRegistration>(
  "TempRegistration",
  TempRegistrationSchema
);
