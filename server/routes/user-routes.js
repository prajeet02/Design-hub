import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, sendResetCodeEmail } from "../config/mailer.js";

const router = express.Router();

// send verification code to email
router.post("/send-verification-email", async (req, res) => {
  const { email, firstName, lastName } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "email is required",
    });
  }
  try {
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "user already exists and is verified",
      });
    }
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    if (!user) {
      user = new User({
        email,
        firstName: firstName || "",
        lastName: lastName || "",
        isVerified: false,
        verificationCode,
        password: "", // will be set on registration
      });
    } else {
      user.verificationCode = verificationCode;
      user.isVerified = false;
    }
    await user.save();
    await sendVerificationEmail(email, verificationCode);
    res.status(200).json({
      success: true,
      message: "verification email sent successfully",
    });
  } catch (error) {
    console.log("failed to send verification email");
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "failed to send verification email",
      error: error.message,
    });
  }
});

// verify email with code
router.post("/verify-email", async (req, res) => {
  const { email, verificationCode } = req.body;
  if (!email || !verificationCode) {
    return res.status(400).json({
      success: false,
      message: "email and verification code are required",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "user already verified",
      });
    }
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: "invalid verification code",
      });
    }
    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: "email verified successfully",
    });
  } catch (error) {
    console.log("failed to verify email");
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "failed to verify email",
      error: error.message,
    });
  }
});

// register a user (set password after verification)
router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "email and password are required",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found, please verify your email first",
      });
    }
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "email not verified",
      });
    }
    if (user.password && user.password.length > 0) {
      return res.status(400).json({
        success: false,
        message: "user already registered",
      });
    }
    const saltRounds = 7;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    await user.save();
    // generate token
    const payload = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({
      success: true,
      message: "user registered successfully",
      user: user,
      token,
    });
  } catch (error) {
    console.log("failed to register user");
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "failed to register user",
      error: error.message,
    });
  }
});

// route 2 - login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "all fields are required",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "invalid password",
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      success: true,
      message: "user logged in successfully",
      user: user,
      token,
    });
  } catch (error) {
    console.log("failed to login user");
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "failed to login user",
      error: error.message,
    });
  }
});

// route 3 - logout a user
router.post("/logout", (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "user logged out successfully",
    });
  } catch (error) {
    console.log("failed to logout user");
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "failed to logout user",
      error: error.message,
    });
  }
});

// send reset code for forgot password
router.post("/send-reset-code", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "email is required",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "email not verified, please verify your email first",
      });
    }
    if (!user.password || user.password.length === 0) {
      return res.status(400).json({
        success: false,
        message: "user not registered, please register first",
      });
    }
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();
    await sendResetCodeEmail(email, resetCode);
    res.status(200).json({
      success: true,
      message: "reset code sent successfully",
    });
  } catch (error) {
    console.log("failed to send reset code");
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "failed to send reset code",
      error: error.message,
    });
  }
});

// verify reset code
router.post("/verify-reset-code", async (req, res) => {
  const { email, resetCode } = req.body;
  if (!email || !resetCode) {
    return res.status(400).json({
      success: false,
      message: "email and reset code are required",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    if (!user.resetCode || user.resetCode !== resetCode) {
      return res.status(400).json({
        success: false,
        message: "invalid reset code",
      });
    }
    if (user.resetCodeExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "reset code has expired",
      });
    }
    user.resetCodeVerified = true;
    await user.save();
    res.status(200).json({
      success: true,
      message: "reset code verified successfully",
    });
  } catch (error) {
    console.log("failed to verify reset code");
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "failed to verify reset code",
      error: error.message,
    });
  }
});

// reset password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "email and new password are required",
    });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "password must be at least 6 characters long",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    if (!user.resetCodeVerified) {
      return res.status(400).json({
        success: false,
        message: "reset code not verified",
      });
    }
    const saltRounds = 7;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    user.resetCodeVerified = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: "password reset successfully",
    });
  } catch (error) {
    console.log("failed to reset password");
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "failed to reset password",
      error: error.message,
    });
  }
});

export default router;
