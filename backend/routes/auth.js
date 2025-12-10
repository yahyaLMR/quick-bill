const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", authMiddleware, async (req, res) => {
  const { name, email, phone, avatar } = req.body;
  try {
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.avatar = avatar || user.avatar;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password, phone, avatar } = req.body; // Add other fields as necessary
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      avatar,
      verificationToken,
    });
    await newUser.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Send email in background to avoid blocking the response
    transporter.sendMail({
      from: '"Quick-Bill" <no-reply@quickbill.com>',
      to: newUser.email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #f0f0f0;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to Quick-Bill! 🚀</h1>
          </div>
          <div style="padding: 30px; color: #333333;">
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">Thanks for getting started with Quick-Bill. We're excited to have you on board! To complete your registration and access your dashboard, please verify your email address.</p>
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${verifyLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 16px;">Verify My Account</a>
            </div>
            <p style="font-size: 14px; color: #666666; margin-bottom: 0;">If the button above doesn't work, copy and paste the following link into your browser:</p>
            <p style="font-size: 14px; color: #2563eb; word-break: break-all;"><a href="${verifyLink}" style="color: #2563eb;">${verifyLink}</a></p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #f0f0f0;">
            <p style="font-size: 12px; color: #999999; margin: 0;">If you didn't create an account with Quick-Bill, please ignore this email.</p>
            <p style="font-size: 12px; color: #999999; margin-top: 10px;">&copy; ${new Date().getFullYear()} Quick-Bill. All rights reserved.</p>
          </div>
        </div>
      `,
    }).catch(err => console.error("Failed to send verification email:", err));

    res.status(201).json({ message: "A verification email has been sent to your email address." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  try {
    if (!user) {
      return res.status(400).json({ message: "invalid email" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "20m",
    });
    res.status(200).json({
      message: "Login successful",
      token,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/users/forgot-password
// @desc    Send password reset email
// @access  Public
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return res.json({
        message: "If the email exists, a reset link was sent",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Quick-Bill" <no-reply@quickbill.com>',
      to: user.email,
      subject: "Reset your password",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #f0f0f0;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Password Reset Request 🔒</h1>
          </div>
          <div style="padding: 30px; color: #333333;">
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Hi <strong>${user.name}</strong>,</p>
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">You requested a password reset for your Quick-Bill account. Click the button below to set a new password. This link expires in 15 minutes.</p>
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${resetLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 16px;">Reset Password</a>
            </div>
            <p style="font-size: 14px; color: #666666; margin-bottom: 0;">If the button above doesn't work, copy and paste the following link into your browser:</p>
            <p style="font-size: 14px; color: #2563eb; word-break: break-all;"><a href="${resetLink}" style="color: #2563eb;">${resetLink}</a></p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #f0f0f0;">
            <p style="font-size: 12px; color: #999999; margin: 0;">If you didn't request a password reset, please ignore this email.</p>
            <p style="font-size: 12px; color: #999999; margin-top: 10px;">&copy; ${new Date().getFullYear()} Quick-Bill. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    res.json({ message: "Reset link sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/users/reset-password/:token
// @desc    Reset password
// @access  Public
router.post("/reset-password/:token", async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
