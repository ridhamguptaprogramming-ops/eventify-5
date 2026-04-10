const express = require("express");
const { body } = require("express-validator");

const {
  getOverview,
  listUsers,
  listRegistrations,
  markAttendance
} = require("../controllers/adminController");
const { protect, requireVerified, requireAdmin } = require("../middleware/auth");
const handleValidation = require("../middleware/validate");

const router = express.Router();

router.use(protect, requireVerified, requireAdmin);

router.get("/overview", getOverview);
router.get("/users", listUsers);
router.get("/registrations", listRegistrations);
router.post(
  "/attendance/check-in",
  [
    body("attendeeId")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Attendee ID cannot be empty."),
    body("qrToken")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("QR token cannot be empty."),
    handleValidation
  ],
  markAttendance
);

module.exports = router;
