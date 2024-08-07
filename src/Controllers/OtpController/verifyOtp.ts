// import { Request, Response } from 'express';
// import verifyOTP from '../../Functions/OTP/verifyOtp.js';

// interface VerifyOtpRequestBody {
//     mb_no: string;
//     otp: string;
//   }

// const verifyOtp = async(req: Request<{}, {}, VerifyOtpRequestBody>, res: Response) => {
//     try{
//       const {mb_no, otp} = req.body;
//       const msg = await verifyOTP(mb_no, otp);

//       return res.status(200).json({ msg });
//     } catch{
  
//     };
//   }

//   export default verifyOtp;