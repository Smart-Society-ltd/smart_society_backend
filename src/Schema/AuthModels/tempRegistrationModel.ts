import mongoose, { Schema, Document } from "mongoose";

interface TempRegistration extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  society_name: string;
  society_add: string;
  society_city: string;
  society_state: string;
  society_pincode: string;
}

const TempRegistrationSchema: Schema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
