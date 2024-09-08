import mongoose from "mongoose";

const flatSchema = new mongoose.Schema({
  flat_no: {
    type: String,
    required: true,
    // unique: true,
  },
  flat_type: {
    type: String,
    // required: true,
  },
  floor_no: {
    type: String,
  },
  society_code: {
    type: String,
    required: true,
  },
  residents: {
    type: [String],
    required: true,
    validate: {
      validator: function (v: string[]) {
        return v.length > 0 && v.length <= 2;
      },
      message: "A flat must have at least one resident and no more than two."
    }
  }
});

const Flat = mongoose.model("Flat", flatSchema);
export default Flat;
