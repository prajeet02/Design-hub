import express from "express";
import Performer from "../models/performer.js";

const router = express.Router();

// Public: list models/performers
// GET /api/v1/models
router.get("/", async (req, res) => {
  try {
    const { availability, gender } = req.query;

    const filter = { isActive: true };
    if (availability && availability !== "All") filter.availability = availability;
    if (gender) filter.gender = gender;

    const models = await Performer.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      models,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "failed to fetch models",
      error: error.message,
    });
  }
});

// Public: create a performer (Creator Studio)
// POST /api/v1/models
router.post("/", async (req, res) => {
  try {
    const {
      title,
      price,
      originalPrice,
      imageUrl,
      availability,
      gender,
      description,
      sizes,
      features,
      location,
      tagline,
    } = req.body || {};

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, message: "title is required" });
    }

    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      return res.status(400).json({ success: false, message: "price is required" });
    }

    const originalNum = originalPrice === undefined || originalPrice === null || originalPrice === ""
      ? undefined
      : Number(originalPrice);

    const model = await Performer.create({
      title: title.trim(),
      price: priceNum,
      originalPrice: originalNum,
      imageUrl: imageUrl || "",
      availability,
      gender,
      description: description || "",
      location: location || "",
      tagline: tagline || "",
      sizes: Array.isArray(sizes) ? sizes : [],
      features: Array.isArray(features) ? features : [],
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "performer created",
      model,
    });
  } catch (error) {
    const status = error?.name === "ValidationError" ? 400 : 500;
    return res.status(status).json({
      success: false,
      message: status === 400 ? "invalid performer data" : "failed to create performer",
      error: error.message,
    });
  }
});

// Public: get single model/performer
// GET /api/v1/models/:id
router.get("/:id", async (req, res) => {
  try {
    const model = await Performer.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "model not found",
      });
    }

    return res.status(200).json({
      success: true,
      model,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "failed to fetch model",
      error: error.message,
    });
  }
});

export default router;
