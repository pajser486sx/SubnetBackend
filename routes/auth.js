import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required!"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters!"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists!"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword
    });

    const token = createToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required!"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password!"
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found!"
      });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});

export default router;