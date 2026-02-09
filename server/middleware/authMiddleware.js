import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select(
      "_id email firstName lastName role isVerified"
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "unauthorized",
      });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      isAdmin: user.role === "admin",
      isVerified: user.isVerified,
    };
    req.userDoc = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "unauthorized",
    });
  }
};

export default authMiddleware;
