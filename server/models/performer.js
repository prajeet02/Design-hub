import mongoose from "mongoose";

// Domain entity used by the UI as a "model/performer" card.
const performerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },

    // Store an absolute URL or a relative path (frontend currently uses local assets).
    imageUrl: { type: String, default: "" },

    availability: {
      type: String,
      enum: ["Available", "Booked"],
      default: "Available",
    },
    gender: {
      type: String,
      enum: ["Female", "Male", "Other"],
      default: "Female",
    },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    tagline: { type: String, default: "" },
    sizes: { type: [String], default: [] },
    features: { type: [String], default: [] },

    // Soft delete flag so admin can remove from listings without losing data.
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Performer = mongoose.model("Performer", performerSchema);

export default Performer;
