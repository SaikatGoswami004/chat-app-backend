const bcrypt=require("bcryptjs")

exports.hashPassword = async (plaintTextPassword) => {
    const saltRounds = 10;
    return await new Promise((resolve, reject) => {
      bcrypt.hash(plaintTextPassword, saltRounds, function (err, hash) {
        if (err) reject(err);
        resolve(hash);
      });
    });
  };

  // exports.generatePhoneOTP = async (userId) => {
  //   // Generate OTP Code
  //   let otp = 123456;
  //   if (_isLiveOTP) {
  //     otp = Math.floor(100000 + Math.random() * 900000);
  //   }
  
  
  
  //   // Return The OTP
  //   return otp;
  // };