import mongoose from "mongoose";

const societySchema = new mongoose.Schema(
  {
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
    society_code: {
      type: String,
      required: true,
      unique: true,
    },
    admin_id: {
      type: String,
      required: true,
      unique: true,
    },
    total_flats: {
      default: 10,
      type: Number,
      required: true,
    },
    remaining_flats: {
      type: Number,
      required: true,
      default: 10,
    },
  },
  { timestamps: true }
);

const Society = mongoose.model("Society", societySchema);
export default Society;
