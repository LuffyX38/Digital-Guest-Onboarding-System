const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    hotelStatus: {
      type: String,
      enum: {
        values: ["Open", "Under maintainance", "Closed", "Full"],
        message: "not a valid status",
      },
      default: "Open",
    },
    guests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guest",
      },
    ],
  },
  { timestamps: true }
);

const Hotel = new mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
