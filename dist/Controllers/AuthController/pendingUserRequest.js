import generateToken from '../../Functions/JWT/generateToken.js';
import User from '../../Models/AuthModels/userModel.js';
import TempUser from '../../Models/AuthModels/tempUserModel.js';
const pendingUsers = async (req, res) => {
    try {
        const { society_code } = req.body;
        const pendingUsers = await TempUser.find({ society_code });
        return res.status(200).json({ data: pendingUsers });
    }
    catch (error) {
        console.error('Error listing pending registrations:', error);
        return res.status(500).json({ msg: "Failed to list pending registrations", error: error.message });
    }
};
const processUsers = async (req, res) => {
    try {
        const { id } = req.body;
        const tempUsers = await TempUser.findOne({ _id: id });
        if (!tempUsers) {
            return res.status(404).json({ msg: "Registration request not found", status: false });
        }
        const { name, mb_no, email, password, society_code, floor_no, flat_no, flat_type } = tempUsers;
        const newUser = new User({
            username: `user_${Math.random().toString(36).substr(2, 8)}`,
            name,
            mb_no,
            email,
            password,
            society_code,
            role: "user",
            floor_no,
            flat_no,
            flat_type
        });
        const savedUser = await newUser.save();
        const token = generateToken(savedUser);
        await TempUser.findByIdAndDelete(id);
        return res.status(200).json({ msg: "User registered successfully", newUser: savedUser, status1: true, token });
    }
    catch (error) {
        console.error('Error processing registration:', error);
        return res.status(500).json({ msg: "Failed to process registration", error: error.message });
    }
};
export { pendingUsers, processUsers };
