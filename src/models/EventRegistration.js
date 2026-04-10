const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    eventName: {
      type: String,
      required: true
    },
    attendeeName: {
      type: String,
      required: true
    },
    college: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    year: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    ticketType: {
      type: String,
      enum: ["general", "vip", "speaker", "volunteer"],
      default: "general"
    },
    notes: {
      type: String,
      trim: true
    },
    attendeeId: {
      type: String,
      unique: true,
      required: true
    },
    qrToken: {
      type: String,
      unique: true,
      required: true
    },
    qrCodeDataUrl: {
      type: String,
      required: true
    },
    attendanceMarked: {
      type: Boolean,
      default: false
    },
    checkedInAt: Date,
    checkedInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("EventRegistration", eventRegistrationSchema);
