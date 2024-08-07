import bcryptjs from 'bcryptjs';
import TempUser from '../../Models/AuthModels/tempUserModel.js';
import User from '../../Models/AuthModels/userModel.js';
const userRegister = async (req, res) => {
    try {
        const { name, mb_no, email, password, society_code, flat_no } = req.body;
        const existingUser = await User.findOne({ email });
        const existingTempUser = await TempUser.findOne({ email });
        if (existingUser || existingTempUser) {
            return res.status(400).json({ msg: "User with this email already registered", status: false });
        }
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new TempUser({
            name,
            mb_no,
            email,
            password: hashedPassword,
            society_code,
            role: "user",
            flat_no,
        });
        await newUser.save();
        return res.status(200).json({ msg: "Request sent to admin successfully", status: true });
    }
    catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ msg: "Failed to register user", error: error.message });
    }
};
export default userRegister;
