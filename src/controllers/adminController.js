const EventRegistration = require("../models/EventRegistration");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const getOverview = asyncHandler(async (_req, res) => {
  const [totalUsers, verifiedUsers, registrations, attendeesCheckedIn] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isVerified: true }),
    EventRegistration.countDocuments(),
    EventRegistration.countDocuments({ attendanceMarked: true })
  ]);

  res.json({
    status: "success",
    metrics: {
      totalUsers,
      verifiedUsers,
      registrations,
      attendeesCheckedIn
    }
  });
});

const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find()
    .select("name email college role isVerified createdAt")
    .sort({ createdAt: -1 });

  res.json({
    status: "success",
    users
  });
});

const listRegistrations = asyncHandler(async (_req, res) => {
  const registrations = await EventRegistration.find()
    .populate("user", "email name college")
    .populate("checkedInBy", "name email")
    .sort({ createdAt: -1 });

  res.json({
    status: "success",
    registrations
  });
});

const markAttendance = asyncHandler(async (req, res) => {
  const { attendeeId, qrToken } = req.body;

  if (!attendeeId && !qrToken) {
    throw new AppError("Provide either attendeeId or qrToken to check in an attendee.", 400);
  }

  const registration = await EventRegistration.findOne({
    $or: [{ attendeeId }, { qrToken }]
  });

  if (!registration) {
    throw new AppError("No registration found for the provided code.", 404);
  }

  registration.attendanceMarked = true;
  registration.checkedInAt = new Date();
  registration.checkedInBy = req.user._id;
  await registration.save();

  res.json({
    status: "success",
    message: "Attendance marked successfully.",
    registration
  });
});

module.exports = {
  getOverview,
  listUsers,
  listRegistrations,
  markAttendance
};
