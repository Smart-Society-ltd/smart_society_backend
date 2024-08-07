import sendOTP from '../../Functions/OTP/sendOtp.js';
const sendOtp = async (req, res) => {
    try {
        const { mb_no } = req.body;
        const msg = await sendOTP(mb_no);
        return res.status(200).json({ msg: msg });
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ msg: "Failed to send OTP", error: error.message });
    }
};
export default sendOtp;
