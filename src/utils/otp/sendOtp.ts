import Twilio from 'twilio';
import otp from './generateOtp.js';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = Twilio(accountSid, authToken);

const sendOTP = async (mb_no: string) => {
    try {
        const message = await client.messages.create({
            body: `Your SmartSociety OTP is ${otp}`,
            from: '+16814848642',
            to: `+91${mb_no}`
        });
        console.log("OTP sent successfully");
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
};

export default sendOTP;
