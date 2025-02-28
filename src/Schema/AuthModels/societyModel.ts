import mongoose, { Schema, model, InferSchemaType } from "mongoose";

const societySchema = new Schema(
  {
    society_name: { type: String, required: true },
    society_add: { type: String, required: true },
    society_city: { type: String, required: true },
    society_state: { type: String, required: true },
    society_pincode: { type: String, required: true },
    society_code: { type: String, required: true, unique: true },
    admin_ids: { type: [String], required: true },
    total_flats: { type: Number, required: true, default: 10 },
    remaining_flats: { type: Number, required: true, default: 10 },
  },
  { timestamps: true }
);

type SocietyInterface = InferSchemaType<typeof societySchema>;

const Society = model<SocietyInterface>("Society", societySchema);

export { Society, SocietyInterface };
