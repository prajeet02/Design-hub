import express from "express";
import User from "../models/user.js";
import Performer from "../models/performer.js";
import Booking from "../models/booking.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// All admin routes require an authenticated admin
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/me", async (req, res) => {
  return res.status(200).json({
    success: true,
    admin: req.user,
  });
});

router.get("/users", async (_req, res) => {
  try {
    const users = await User.find().select(
      "_id email firstName lastName role isVerified createdAt updatedAt"
    );

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "failed to fetch users",
      error: error.message,
    });
  }
});

router.patch("/users/:id/role", async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  if (!role || !["user", "admin"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "invalid role",
    });
  }

  try {
    // Prevent an admin from accidentally demoting themselves
    if (req.user.id === id && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "cannot change your own role",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("_id email firstName lastName role isVerified createdAt updatedAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "role updated",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "failed to update role",
      error: error.message,
    });
  }
});

// =====================
// Models / Performers
// =====================

// GET /api/v1/admin/models
router.get("/models", async (_req, res) => {
  try {
    const models = await Performer.find().sort({ createdAt: -1 });
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

// POST /api/v1/admin/models
router.post("/models", async (req, res) => {
  const {
    title,
    price,
    originalPrice,
    imageUrl,
	    location,
	    tagline,
    availability,
    gender,
    description,
    sizes,
    features,
    isActive,
  } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({
      success: false,
      message: "title is required",
    });
  }
  if (price === undefined || price === null || Number.isNaN(Number(price))) {
    return res.status(400).json({
      success: false,
      message: "price is required",
    });
  }

  try {
    const model = await Performer.create({
      title,
      price: Number(price),
      originalPrice: originalPrice === undefined ? undefined : Number(originalPrice),
      imageUrl: imageUrl || "",
	      location: location || "",
	      tagline: tagline || "",
      availability,
      gender,
      description,
      sizes: Array.isArray(sizes) ? sizes : undefined,
      features: Array.isArray(features) ? features : undefined,
      isActive: typeof isActive === "boolean" ? isActive : undefined,
    });

    return res.status(201).json({
      success: true,
      message: "model created",
      model,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "failed to create model",
      error: error.message,
    });
  }
});

// PATCH /api/v1/admin/models/:id
router.patch("/models/:id", async (req, res) => {
  try {
    const updated = await Performer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "model not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "model updated",
      model: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "failed to update model",
      error: error.message,
    });
  }
});

// DELETE /api/v1/admin/models/:id
// Soft delete: marks isActive=false
router.delete("/models/:id", async (req, res) => {
  try {
    const deleted = await Performer.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "model not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "model deleted",
      model: deleted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "failed to delete model",
      error: error.message,
    });
  }
});

// =====================
// Bookings (admin)
// =====================

// GET /api/v1/admin/bookings
router.get("/bookings", async (_req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate("userId", "email firstName lastName")
      .populate("items.modelId", "title imageUrl");

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

// PATCH /api/v1/admin/bookings/:id
// Body can include: { status, details, scheduledAt }
router.patch("/bookings/:id", async (req, res) => {
  const { status, details, scheduledAt } = req.body;

  if (status && !["pending", "confirmed", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "invalid status",
    });
  }

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "booking not found",
      });
    }

    const previousStatus = booking.status;

    if (typeof details === "string") booking.details = details;

    // scheduledAt update rules:
    // - if scheduledAt is NOT provided in the body, keep existing value
    // - if scheduledAt is "" or null, clear it
    // - otherwise, parse and validate
    const hasScheduledAt = Object.prototype.hasOwnProperty.call(req.body, "scheduledAt");
    if (hasScheduledAt) {
      if (scheduledAt === "" || scheduledAt === null) {
        booking.scheduledAt = undefined;
      } else {
        const nextDate = new Date(scheduledAt);
        if (Number.isNaN(nextDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "invalid scheduledAt",
          });
        }
        booking.scheduledAt = nextDate;
      }
    }
    if (status) booking.status = status;

    await booking.save();

    // Keep performer availability roughly in sync (simple rule):
    // - confirmed => Booked
    // - cancelled/completed => Available
    if (status && status !== previousStatus) {
      const performerIds = (booking.items || []).map((it) => it.modelId).filter(Boolean);
      if (performerIds.length > 0) {
        if (status === "confirmed") {
          await Performer.updateMany(
            { _id: { $in: performerIds } },
            { availability: "Booked" }
          );
        }
        if (status === "cancelled" || status === "completed") {
          await Performer.updateMany(
            { _id: { $in: performerIds } },
            { availability: "Available" }
          );
        }
      }
    }

    const populated = await Booking.findById(booking._id)
      .populate("userId", "email firstName lastName")
      .populate("items.modelId", "title imageUrl");

    return res.status(200).json({
      success: true,
      message: "booking updated",
      booking: populated,
    });
  } catch (error) {
    if (error?.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "invalid booking id",
      });
    }
    return res.status(500).json({
      success: false,
      message: "failed to update booking",
      error: error.message,
    });
  }
});

// DELETE /api/v1/admin/bookings/:id
router.delete("/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "booking not found",
      });
    }

    const performerIds = (booking.items || []).map((it) => it.modelId).filter(Boolean);
    await Booking.deleteOne({ _id: booking._id });

    if (performerIds.length > 0) {
      await Performer.updateMany(
        { _id: { $in: performerIds } },
        { availability: "Available" }
      );
    }

    return res.status(200).json({
      success: true,
      message: "booking deleted",
    });
  } catch (error) {
    if (error?.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "invalid booking id",
      });
    }
    return res.status(500).json({
      success: false,
      message: "failed to delete booking",
      error: error.message,
    });
  }
});

export default router;

