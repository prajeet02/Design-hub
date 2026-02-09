import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // password is optional until the user completes registration
    password: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    verificationCode: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetCode: {
      type: String,
    },
    resetCodeExpiry: {
      type: Date,
    },
    resetCodeVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Convenience flag derived from role.
userSchema.virtual("isAdmin").get(function () {
  return this.role === "admin";
});

const User = mongoose.model("User", userSchema);

export default User;
