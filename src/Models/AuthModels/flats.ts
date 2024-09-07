import mongoose from "mongoose";

const flatSchema = new mongoose.Schema({
  flat_name: {
    type: String,
    required: true,
    unique: true,
  },
  flat_no: {
    type: String,
    required: true,
    unique: true,
  },
  floor_no: {
    type: String,
  },
  society_code: {
    type: String,
    required: true,
  },
  owner_id: {
    type: String,
    required: true,
  },
});

const Flat = mongoose.model("Flat", flatSchema);
export default Flat;
