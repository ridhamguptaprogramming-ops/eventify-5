const express = require("express");
const { body } = require("express-validator");

const {
  getEventMeta,
  registerForEvent,
  getMyRegistration
} = require("../controllers/eventController");
const { protect, requireVerified } = require("../middleware/auth");
const handleValidation = require("../middleware/validate");

const router = express.Router();

router.get("/meta", getEventMeta);

router.post(
  "/register",
  protect,
  requireVerified,
  [
    body("department").trim().notEmpty().withMessage("Department is required."),
    body("year").trim().notEmpty().withMessage("Year is required."),
    body("phone").trim().notEmpty().withMessage("Phone number is required."),
    body("ticketType")
      .isIn(["general", "vip", "speaker", "volunteer"])
      .withMessage("Choose a valid ticket type."),
    handleValidation
  ],
  registerForEvent
);

router.get("/registration", protect, requireVerified, getMyRegistration);

module.exports = router;
