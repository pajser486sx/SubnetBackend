import express from "express";
import SavedExplanation from "../models/SavedExplanation.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      ipAddress,
      cidr,
      results,
      explanation
    } = req.body;

    if (!ipAddress || cidr === undefined || !results || !explanation) {
      return res.status(400).json({
        message: "Missing required data"
      });
    }

    const existingExplanation = await SavedExplanation.findOne({
      user: req.user.id,
      ipAddress,
      cidr,
      explanation
    });

    if (existingExplanation) {
      return res.status(409).json({
      message: "This explanation is already saved"
    });
}
    const savedExplanation = await SavedExplanation.create({
      user: req.user.id,
      ipAddress,
      cidr,
      results,
      explanation
    });

    res.status(201).json(savedExplanation);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not save explanation"
    });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const explanations = await SavedExplanation.find({
      user: req.user.id
    }).sort({
      createdAt: -1
    });

    res.json(explanations);

  } catch (error) {
    res.status(500).json({
      message: "Could not retrieve explanations"
    });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const explanation = await SavedExplanation.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!explanation) {
      return res.status(404).json({
        message: "Saved explanation not found"
      });
    }

    res.json({
      message: "Explanation deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: "Could not delete explanation"
    });
  }
});

export default router;