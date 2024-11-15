// import supabase from "../../supabaseClient.js";

// const verifyOTP = async (mb_no, token) => {
//   try {
//     const { data, error } = await supabase.auth.verifyOtp({
//       phone: `+91${mb_no}`,
//       token: token,
//       type: 'sms'
//     });

//     if (error) {
//       console.error('Error verifying OTP:', error.message);
//       throw new Error('Failed to verify OTP');
//     }

//     return { msg: "OTP verified successfully", status: true };

//   } catch (error) {
//     console.error('Error in verifyOTP function:', error.message);
//     return { msg: "Failed to verify OTP", status: false, error: error.message };
//   }
// };

// export default verifyOTP;
