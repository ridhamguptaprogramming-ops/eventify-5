const crypto = require("crypto");

const EventRegistration = require("../models/EventRegistration");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const eventMeta = require("../utils/eventMeta");
const { buildAttendanceQr } = require("../services/qrService");

const buildAttendeeId = () => `EVT-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

const getEventMeta = asyncHandler(async (_req, res) => {
  res.json({
    status: "success",
    event: eventMeta
  });
});

const registerForEvent = asyncHandler(async (req, res) => {
  const existingRegistration = await EventRegistration.findOne({ user: req.user._id });

  if (existingRegistration) {
    throw new AppError("You have already registered for this event.", 409);
  }

  const attendeeId = buildAttendeeId();
  const qrToken = crypto.randomBytes(12).toString("hex");
  const qrCodeDataUrl = await buildAttendanceQr({
    attendeeId,
    eventName: eventMeta.name,
    email: req.user.email,
    qrToken
  });

  const registration = await EventRegistration.create({
    user: req.user._id,
    eventName: eventMeta.name,
    attendeeName: req.user.name,
    college: req.user.college,
    department: req.body.department,
    year: req.body.year,
    phone: req.body.phone,
    ticketType: req.body.ticketType,
    notes: req.body.notes,
    attendeeId,
    qrToken,
    qrCodeDataUrl
  });

  res.status(201).json({
    status: "success",
    message: "Registration confirmed. Your QR pass is ready in the dashboard.",
    registration
  });
});

const getMyRegistration = asyncHandler(async (req, res) => {
  const registration = await EventRegistration.findOne({ user: req.user._id });

  res.json({
    status: "success",
    registered: Boolean(registration),
    registration
  });
});

module.exports = {
  getEventMeta,
  registerForEvent,
  getMyRegistration
};
