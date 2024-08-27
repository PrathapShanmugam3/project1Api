
const crypto = require('crypto');
const Otp=require('../model/otp');

const Transpoter=require('../mailConfig/mailConnection').transporter;
const mailConfig=require('../mailConfig/mailConfig');






const sendOtp=async (req, res) => {
    const { to } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();
  
    try {
      // Check for existing OTPs within the last 5 minutes
      const existingOtp = await Otp.findOne({ email: to });
      if (existingOtp) {
        return res.status(429).json({ message: 'OTP already sent within the last 5 minutes. Please try again later.' });
      }
  
      // Save the new OTP to the database
      const newOtp = new Otp({ email: to, otp });
      await newOtp.save();
  
      // Send the OTP via email
      await Transpoter.sendMail({
        from: `"Prathap" <${mailConfig.AUTH.USERNAME}>`,
        to,
        subject: 'OTP Verification',
        text: `Your OTP is ${otp}. This OTP is valid for 5 minutes only`,
      });
  
      res.status(200).json({ message: 'OTP generated and sent successfully!', otpId: newOtp._id });
    } catch (error) {
      console.error('Error generating OTP:', error);
      res.status(500).json({ message: 'Failed to generate OTP', error: error.message });
    }
}
  
  // Verify OTP endpoint
const verifyOtp=async (req, res) => {
    const { email, otp } = req.body;

    console.log(req.body);
    
  
    try {
      const result = await Otp.findOne({ email, otp });
      if (result) {
        res.status(200).json({ message: 'OTP verified successfully!' });
      } else {
        res.status(401).json({ message: 'Invalid OTP' });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
    }
  }



  module.exports = { sendOtp ,verifyOtp};
  