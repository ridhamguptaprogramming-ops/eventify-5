const express = require("express");
const { body } = require("express-validator");

const {
  signup,
  verifyEmail,
  resendVerificationEmail,
  login,
  getMe
} = require("../controllers/authController");
const handleValidation = require("../middleware/validate");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("name").trim().notEmpty().withMessage("Full name is required."),
    body("email").isEmail().withMessage("Enter a valid email."),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long."),
    body("college").trim().notEmpty().withMessage("College name is required."),
    handleValidation
  ],
  signup
);

router.get("/verify-email", verifyEmail);

router.post(
  "/resend-verification",
  [body("email").isEmail().withMessage("Enter a valid email."), handleValidation],
  resendVerificationEmail
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email."),
    body("password").notEmpty().withMessage("Password is required."),
    handleValidation
  ],
  login
);

router.get("/me", protect, getMe);

module.exports = router;
