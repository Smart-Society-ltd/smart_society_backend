import mongoose, { Schema } from 'mongoose';
const TempRegistrationSchema = new Schema({
    name: { type: String, required: true },
    mb_no: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    society_name: { type: String, required: true },
    society_add: { type: String, required: true },
    society_city: { type: String, required: true },
    society_state: { type: String, required: true },
    society_pincode: { type: String, required: true },
});
export default mongoose.model('TempRegistration', TempRegistrationSchema);
