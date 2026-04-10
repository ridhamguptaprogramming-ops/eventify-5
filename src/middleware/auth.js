const jwt = require("jsonwebtoken");

const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("Authentication required.", 401);
  }

  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError("User no longer exists.", 401);
  }

  req.user = user;
  next();
});

const requireVerified = (req, _res, next) => {
  if (!req.user?.isVerified) {
    return next(new AppError("Verify your email before accessing this route.", 403));
  }

  next();
};

const requireAdmin = (req, _res, next) => {
  if (req.user?.role !== "admin") {
    return next(new AppError("Admin access required.", 403));
  }

  next();
};

module.exports = {
  protect,
  requireVerified,
  requireAdmin
};
