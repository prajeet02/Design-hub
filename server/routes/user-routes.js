import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, sendResetCodeEmail } from "../config/mailer.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Booking from "../models/booking.js";
import Performer from "../models/performer.js";

const router = express.Router();

const toPublicUser = (user) => {
  if (!user) return null;
  return {
    id: user._id?.toString?.() ?? user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isAdmin: user.role === "admin",
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

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
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "password must be at least 8 characters long",
    });
  }
  try {
    const requireEmailVerification =
      process.env.REQUIRE_EMAIL_VERIFICATION === "true";

    let user = await User.findOne({ email });

    // If the user doesn't exist, create it directly (simple auth flow)
    if (!user) {
      user = new User({
        email,
        firstName: firstName || "",
        lastName: lastName || "",
        isVerified: !requireEmailVerification,
      });
    }

    // If email verification is enforced, registration can only complete after verification
    if (requireEmailVerification && !user.isVerified) {
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

    // bootstrap: if no admin exists yet, promote this first registered user
    const anyAdmin = await User.exists({ role: "admin" });
    if (!anyAdmin) {
      user.role = "admin";
    }

    // optional: allow setting admin(s) by env
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (adminEmails.includes(user.email.toLowerCase())) {
      user.role = "admin";
    }

    await user.save();
    // generate token
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({
      success: true,
      message: "user registered successfully",
      user: toPublicUser(user),
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

    const requireEmailVerification =
      process.env.REQUIRE_EMAIL_VERIFICATION === "true";
    if (requireEmailVerification && !user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "email not verified",
      });
    }

    if (!user.password || user.password.length === 0) {
      return res.status(400).json({
        success: false,
        message: "user not registered",
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
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      success: true,
      message: "user logged in successfully",
      user: toPublicUser(user),
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

// get current user
router.get("/me", authMiddleware, async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

// =====================
// Bookings (user)
// =====================

// POST /api/v1/user/bookings
// Body: { items: [{ modelId, quantity }], details?, scheduledAt? }
router.post("/bookings", authMiddleware, async (req, res) => {
  const { items, details, scheduledAt } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "items are required",
    });
  }

  const normalizedItems = items
    .map((it) => ({
      modelId: it?.modelId,
      quantity: Number(it?.quantity ?? 1),
    }))
    .filter((it) => it.modelId);

  if (normalizedItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: "invalid items",
    });
  }

  try {
    const modelIds = normalizedItems.map((it) => String(it.modelId));
    const uniqueModelIds = [...new Set(modelIds)];
    const models = await Performer.find({
      _id: { $in: uniqueModelIds },
      isActive: true,
    });

    if (models.length !== uniqueModelIds.length) {
      return res.status(400).json({
        success: false,
        message: "one or more models are invalid",
      });
    }

    // Build snapshot items from current model docs
    const modelById = new Map(models.map((m) => [m._id.toString(), m]));
    const bookingItems = normalizedItems.map((it) => {
      const m = modelById.get(String(it.modelId));
      return {
        modelId: m._id,
        title: m.title,
        price: m.price,
        quantity: it.quantity && it.quantity > 0 ? it.quantity : 1,
      };
    });

    const booking = await Booking.create({
      userId: req.user.id,
      items: bookingItems,
      details: details || "",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "booking created",
      booking,
    });
  } catch (error) {
    if (error?.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "invalid model id",
      });
    }
    return res.status(500).json({
      success: false,
      message: "failed to create booking",
      error: error.message,
    });
  }
});

// GET /api/v1/user/bookings
router.get("/bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.modelId", "title imageUrl availability");

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "failed to fetch bookings",
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
  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "password must be at least 8 characters long",
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
