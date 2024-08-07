import bcryptjs from 'bcryptjs';
import User from '../../Models/AuthModels/userModel.js';
import Society from '../../Models/AuthModels/societyModel.js';
import generateToken from '../../Functions/JWT/generateToken.js';
const adminLogin = async (req, res) => {
    try {
        const { mb_no, password } = req.body;
        const admin = await User.findOne({ mb_no });
        if (!admin || admin.role != "admin") {
            return res.status(400).json({ msg: "Admin with this number not exist", status: false });
        }
        const isPasswordValid = await bcryptjs.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: "Invalid password", status: false });
        }
        const society = await Society.findOne({ admin_id: admin._id });
        if (!society) {
            return res.status(404).json({ msg: "Society not found for the admin", status: false });
        }
        // Generate a token for the admin
        const token = generateToken(admin);
        return res.status(200).json({ msg: "Login successful", status: true, admin, token });
    }
    catch (error) {
        console.error('Error logging in admin:', error);
        return res.status(500).json({ msg: "Failed to login admin", error: error.message });
    }
};
export default adminLogin;
