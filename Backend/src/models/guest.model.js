const mongoose = require("mongoose");
const validator = require("validator");
/*
Full Name
§ Mobile Number
§ Address
§ Purpose of Visit (Dropdown: Business, Personal, Tourist)
§ Stay Dates (From and To)
§ Email ID
§ ID Proof Number
*/

const guestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    mobileNumber: {
      type: String,
      validate: {
        validator: (value) =>
          validator.isMobilePhone(value, "any", { strictMode: true }),
        message: "Invalid mobile number",
      },
      required: true,
    },
    Address: {
      type: String,
      required: true,
      trim: true,
    },
    purposeOfVisit: {
      type: String,
      enum: {
        values: ["Business", "Personal", "Tourist"],
        message: `choose a valid option`,
      },
      default: "Tourist",
      required: true,
    },
    stayDates: {
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
        required: true,
      },
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email format",
      },
    },
    idProofNumber: {
      type: String,
      required: true,
      trim: true,
    },
    stayingAt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    status: {
      type: String,
      enum: ["removed", "booked", "waiting"],
      default: "waiting",
    },
  },
  { timestamps: true }
);

const guestModel = new mongoose.model("Guest", guestSchema);

module.exports = guestModel;
