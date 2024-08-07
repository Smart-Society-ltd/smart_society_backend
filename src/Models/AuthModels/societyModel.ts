import mongoose from "mongoose";

const societySchema = new mongoose.Schema(
  {
    society_name: {
      type: String,
      required: true
    },
    society_add: {
      type: String,
      required: true
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
        type:String,
        required: true
      },
    society_code: {
      type:String,
      required: true
    },
    admin_id: {
      type: String,
      required: true,
    },
    no_of_flats: {
      type: String,
    },
    no_of_flats_sold:{
      type: String,
      // required: true,
    }
  },
  { timestamps: true }
);

const Society = mongoose.model('Society', societySchema);
export default Society;