const express = require("express");
const router = express.Router();
const User = require("../models/user");

// @route   GET /api/auth/verify-email/:token
router.get("/verify-email/:token", async (req, res) => {
  const user = await User.findOne({
    verificationToken: req.params.token,
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json({ message: "Email verified successfully ✅" });
});
module.exports = router;
