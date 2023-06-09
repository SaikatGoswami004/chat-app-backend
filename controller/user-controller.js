const asyncHandler = require("express-async-handler");
const User = require("../model/user-model");
const getGenerateToken = require("../config/generate-token");
const Validator = require("fastest-validator");
const mongoose = require("mongoose");
const { hashPassword } = require("../helper/auth-helper");

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, image } = req.body;
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      image: req.body.image,
    };

    // Preparing Validation Schema
    const schema = {
      name: {
        type: "string",
        optional: false,
        min: 3,
        max: 25,
      },
      email: {
        type: "email",
        optional: false,
      },
      password: {
        type: "string",
        optional: false,
        min: 8,
        max: 32,
      },
    };
    // Creating Validator Object And Validating
    const validation = new Validator();
    const validationResponse = validation.validate(data, schema);
    // Send Response On Validation Failed
    if (validationResponse !== true) {
      return res.status(400).json({
        message: "Validation Failed",
        errors: validationResponse,
      });
    } else {
      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(400).json({ message: "User Already Exist" });
      }
      const user = await User.create({
        name,
        email,
        password,
        image,
      });
      if (user) {
        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          token: getGenerateToken(user._id),
        });
      } else {
        res.status(400).json({ message: "Failed To Create User" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: error.message,
    });
  }
});

//Login
exports.loginUser = asyncHandler(async (req, res) => {
  // const {email,password}=req.body;
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };

    // Preparing Validation Schema
    const schema = {
      email: {
        type: "email",
        optional: false,
      },
      password: {
        type: "string",
        optional: false,
        min: 8,
        max: 32,
      },
    };
    // Creating Validator Object And Validating
    const validation = new Validator();
    const validationResponse = validation.validate(data, schema);
    // Send Response On Validation Failed
    if (validationResponse !== true) {
      return res.status(400).json({
        message: "Validation Failed",
        errors: validationResponse,
      });
    } else {
      const user = await User.findOne({ email: data.email });

      if (user && (await user.matchPass(data.password))) {
        return res.status(201).json({
          message: "Login Successfull",
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          token: getGenerateToken(user._id),
        });
      } else {
        res.status(400).json({ message: "Invalid UserName And Password" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: error.message,
    });
  }
});

exports.allUser = asyncHandler(async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    return res.json(users);
  } catch (error) {
    console.log(error);
  }
});

exports.frogotPassword = async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      otp: req.body.otp,
    };

    // Preparing Validation Schema
    const schema = {
      email: {
        type: "email",
        optional: false,
      },
      otp: {
        type: "string",
        optional: false,
      },
    };
    // Creating Validator Object And Validating
    const validation = new Validator();
    const validationResponse = validation.validate(data, schema);
    // Send Response On Validation Failed
    if (validationResponse !== true) {
      return res.status(400).json({
        message: "Validation Failed",
        errors: validationResponse,
      });
    } else {
      // Check If The Given OTP Is Correct
      if (data.otp !== process.env.EMAIL_OTP) {
        return res.status(400).json({
          message: "Incorrect OTP",
        });
      }

      const user = await User.findOne({ email: data.email });
      //check user exists
      if (!user) {
        return res.status(400).json({
          message: "Please Enter Your Registerd Email",
          success: false,
        });
      }

      return res.status(200).json({
        user,
        message: "Please enter your new password",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: error.message,
    });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      newPassword: req.body.newPassword,
      confirmPassword: req.body.confirmPassword,
    };

    // Preparing Validation Schema
    const schema = {
      newPassword: {
        type: "string",
        optional: false,
        min: 8,
        max: 32,
      },
      confirmPassword: {
        type: "equal",
        field: "newPassword",
        optional: false,
      },
    };
    // Creating Validator Object And Validating
    const validation = new Validator();
    const validationResponse = validation.validate(data, schema);
    // Send Response On Validation Failed
    if (validationResponse !== true) {
      return res.status(400).json({
        message: "Validation Failed",
        errors: validationResponse,
      });
    } else {
      const user = await User.findOne({ email: data.email });

      await User.updateOne(
        {
          _id: user._id,
        },
        {
          $set: {
            password: await hashPassword(data.newPassword),
          },
        }
      );

      return res
        .status(200)
        .json({ message: "Succesfully Reset Your Password", success: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: error.message,
    });
  }
};
