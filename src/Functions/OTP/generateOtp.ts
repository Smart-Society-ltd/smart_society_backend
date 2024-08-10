import otpGenerator from 'otp-generator';

const otp = otpGenerator.generate(6, { 
    digits: true,
    upperCaseAlphabets: false, 
    specialChars: false,
    lowerCaseAlphabets: false
  });

export default otp;