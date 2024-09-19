import mongoose, { Document } from "mongoose";

interface FlatInterface extends Document {
  flat_no: string;
  flat_type: string;
  floor_no: string;
  society_code: string;
  residents: string[];
}

const flatSchema = new mongoose.Schema({
  flat_no: {
    type: String,
    required: true,
  },
  flat_type: {
    type: String,
    required: true,
  },
  floor_no: {
    type: String,
    required: true,
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

const Flat = mongoose.model<FlatInterface>("Flat", flatSchema);
export default Flat;
