import bcryptjs from 'bcryptjs';
// import User from '@models/AuthModels/userModel.js';
// import Admin from '@models/AuthModels/adminModel.js';
// import Society from '@models/AuthModels/societyModel.js';
// import generateToken from '@functions/JWT/generateToken.js';
// import generateOTP from '@functions/OTP/generateOtp.js';
// import sendOTP from '@functions/OTP/sendOtp.js';
// import verifyOTP from '@functions/OTP/verifyOtp.js'; 
import User from "../../Models/AuthModels/userModel.js";
import Admin from '../../Models/AuthModels/adminModel.js';
import Society from '../../Models/AuthModels/societyModel.js';
import TempRegistration from '../../Models/AuthModels/tempRegistrationModel.js';
import generateToken from '../../Functions/JWT/generateToken.js';
import generateOTP from '../../Functions/OTP/generateOtp.js';
import sendOTP from '../../Functions/OTP/sendOtp.js';
import verifyOTP from '../../Functions/OTP/verifyOtp.js';
const sendOtp = async (req, res) => {
    try {
        const { mb_no } = req.body;
        const mb_noCheck = await User.findOne({ mb_no: mb_no });
        if (mb_noCheck) {
            return res.status(400).json({ msg: "Mobile number already exists", status: false });
        }
        const OTP = generateOTP();
        await sendOTP(mb_no, OTP);
        return res.status(200).json({ msg: "OTP sent successfully", status: true });
    }
    catch (error) {
        console.error('Error verifying OTP and registering user:', error);
        return res.status(500).json({ msg: "Failed to verify OTP and register user", error: error.message });
    }
};
const verifyOtp = async (req, res) => {
    try {
        const { mb_no, otp } = req.body;
        await verifyOTP(mb_no, otp);
        return res.status(200).json({ msg: "OTP verified successfully" });
    }
    catch {
    }
    ;
};
const tempRegisterSociety = async (req, res) => {
    try {
        const { name, mb_no, email, password, society_name, society_add, society_city, society_state, society_pincode, no_of_flats, no_of_flats_sold } = req.body;
        const emailCheck = await TempRegistration.findOne({ email: email });
        if (emailCheck) {
            return res.status(400).json({ msg: "Email already exists", status: false });
        }
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newTempRegistration = new TempRegistration({
            name,
            mb_no,
            email,
            password: hashedPassword,
            society_name,
            society_add,
            society_city,
            society_state,
            society_pincode,
            no_of_flats,
            no_of_flats_sold,
        });
        const savedTempRegistration = await newTempRegistration.save();
        return res.status(200).json({ msg: "Registration request submitted successfully", status: true, data: savedTempRegistration });
    }
    catch (error) {
        console.error('Error submitting registration request:', error);
        return res.status(500).json({ msg: "Failed to submit registration request", error: error.message });
    }
};
const listPendingRegistrations = async (req, res) => {
    try {
        const pendingRegistrations = await TempRegistration.find({});
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
        console.log(id);
        const tempRegistration = await TempRegistration.findOne({ _id: id });
        if (!tempRegistration) {
            return res.status(404).json({ msg: "Registration request not found", status: false });
        }
        const society_code = `SS${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
        const { name, mb_no, email, password, society_name, society_add, society_city, society_state, society_pincode, no_of_flats, no_of_flats_sold } = tempRegistration;
        const newAdmin = new Admin({
            username: `user_${Math.random().toString(36).substr(2, 8)}`,
            name,
            mb_no,
            email,
            password,
            society_code,
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
            no_of_flats,
            no_of_flats_sold
        });
        const savedSociety = await newSociety.save();
        const token = generateToken(savedAdmin);
        await TempRegistration.findByIdAndDelete(id);
        return res.status(200).json({ msg1: "Admin registered successfully", newAdmin: savedAdmin, status1: true, msg2: "Society registered successfully", savedSociety: savedSociety, status2: true, token });
    }
    catch (error) {
        console.error('Error processing registration:', error);
        return res.status(500).json({ msg: "Failed to process registration", error: error.message });
    }
};
export { sendOtp, verifyOtp, tempRegisterSociety, listPendingRegistrations, processRegistration };
