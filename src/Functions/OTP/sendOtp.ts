import Twilio from 'twilio';
import otp from './generateOtp.js';

const accountSid = 'ACfa89837a3aeac425b75a35e880f2c737';
const authToken = '7ff569ca3359ae8873b56048dd2accc6';
const client = Twilio(accountSid, authToken);

const sendOTP = async (mb_no) => {
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
