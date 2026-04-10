const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { signJwt, createRawToken, hashToken } = require("../utils/token");
const { sendVerificationEmail } = require("../services/emailService");

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const issueAuthPayload = (user) => ({
  token: signJwt(user._id),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    college: user.college,
    role: user.role,
    isVerified: user.isVerified
  }
});

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, college } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409);
  }

  const rawToken = createRawToken();
  const adminEmails = getAdminEmails();

  const user = await User.create({
    name,
    email,
    password,
    college,
    role: adminEmails.includes(email.toLowerCase()) ? "admin" : "attendee",
    verificationToken: hashToken(rawToken),
    verificationTokenExpires: Date.now() + 1000 * 60 * 60 * 24
  });

  await sendVerificationEmail({
    email: user.email,
    name: user.name,
    token: rawToken
  });

  res.status(201).json({
    status: "success",
    message: "Signup complete. Check your email to verify your account before logging in."
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new AppError("Verification token is missing.", 400);
  }

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError("Verification link is invalid or has expired.", 400);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.json({
    status: "success",
    message: "Email verified successfully. You can now log in.",
    ...issueAuthPayload(user)
  });
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError("No account found for this email.", 404);
  }

  if (user.isVerified) {
    throw new AppError("This email is already verified.", 400);
  }

  const rawToken = createRawToken();
  user.verificationToken = hashToken(rawToken);
  user.verificationTokenExpires = Date.now() + 1000 * 60 * 60 * 24;
  await user.save();

  await sendVerificationEmail({
    email: user.email,
    name: user.name,
    token: rawToken
  });

  res.json({
    status: "success",
    message: "A fresh verification link has been sent."
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (!user.isVerified) {
    throw new AppError("Verify your email before logging in.", 403);
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  res.json({
    status: "success",
    message: "Login successful.",
    ...issueAuthPayload(user)
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({
    status: "success",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      college: req.user.college,
      role: req.user.role,
      isVerified: req.user.isVerified,
      createdAt: req.user.createdAt
    }
  });
});

module.exports = {
  signup,
  verifyEmail,
  resendVerificationEmail,
  login,
  getMe
};
