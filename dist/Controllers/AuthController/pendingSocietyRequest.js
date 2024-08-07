import generateToken from '../../Functions/JWT/generateToken.js';
import tempSociety from '../../Models/AuthModels/tempRegistrationModel.js';
import Society from '../../Models/AuthModels/societyModel.js';
// import User from '../../Models/AuthModels/userModel.js';
import User from '@models/AuthModels/userModel.js';
const listPendingRegistrations = async (req, res) => {
    try {
        // Fetch all pending registrations from the 'tempRegistrations' collection
        const pendingRegistrations = await tempSociety.find();
        return res.status(200).json({ data: pendingRegistrations });
    }
    catch (error) {
        console.error('Error listing pending registrations:', error);
        return res.status(500).json({ msg: "Failed to list pending registrations", error: error.message });
    }
};
const processRegistration = async (req, res) => {
    try {
        const { id } = req.body;
        const tempRegistration = await tempSociety.findOne({ _id: id });
        if (!tempRegistration) {
            return res.status(404).json({ msg: "Registration request not found", status: false });
        }
        const society_code = `SS${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
        const { name, mb_no, email, password, society_name, society_add, society_city, society_state, society_pincode } = tempRegistration;
        const newAdmin = new User({
            username: `user_${Math.random().toString(36).substr(2, 8)}`,
            name,
            mb_no,
            email,
            password,
            society_code,
            role: "admin",
        });
        const savedAdmin = await newAdmin.save();
        const admin_id = savedAdmin._id;
        const newSociety = new Society({
            society_name,
            society_add,
            society_city,
            society_state,
            society_pincode,
            society_code,
            admin_id,
        });
        const savedSociety = await newSociety.save();
        const token = generateToken(savedAdmin);
        await tempSociety.findByIdAndDelete(id);
        return res.status(200).json({ msg1: "Admin registered successfully", newAdmin: savedAdmin, status1: true, msg2: "Society registered successfully", savedSociety: savedSociety, status2: true, token });
    }
    catch (error) {
        console.error('Error processing registration:', error);
        return res.status(500).json({ msg: "Failed to process registration", error: error.message });
    }
};
export { listPendingRegistrations, processRegistration };
