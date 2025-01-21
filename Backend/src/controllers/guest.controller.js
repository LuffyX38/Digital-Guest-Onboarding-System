const Guest = require("../models/guest.model");
const Hotel = require("../models/hotel.model");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

exports.bookingHotel = asyncHandler(async (req, res) => {
  // fullName, mobileNumber,Address,purposeOfVisit,stayDates,email,idProofNumber
  let { hotel_name } = req.params;
  hotel_name = decodeURI(hotel_name);
  if (!hotel_name) throw new ApiError(400, "Hotel not found");

  const findHotel = await Hotel.findOne({ name: hotel_name });
  if (!findHotel) throw new ApiError(400, "Invalid hotel id or name");

  const stayingAt = findHotel._id;
  if (!stayingAt && stayingAt.length !== 24) throw new ApiError(400, "Hotel not found");
  // console.log(req.body);
  // console.log("object")
  const {
    fullName,
    mobileNumber,
    Address,
    purposeOfVisit,
    stayDates: { from, to },
    email,
    idProofNumber,
  } = req.body;
  // console.log(from, " ", fullName);



  if (
    !fullName?.trim() ||
    !mobileNumber?.trim() ||
    !Address?.trim() ||
    !purposeOfVisit?.trim() ||
    !from ||
    !to ||
    !email?.trim() ||
    !idProofNumber?.trim()
  )
    throw new ApiError(400, "All fields are required");

  const hotel = await Hotel.findById(stayingAt);
  // console.log(hotel);
  if (!hotel) throw new ApiError(400, "Hotel does not exist");

  const existingGuest = await Guest.findOne({
    $and: [{ email }, { stayingAt }],
  });

  // console.log(existingGuest);

  if (existingGuest)
    throw new ApiError(400, `You have already booked this hotel`);

  // for testing
  // return res.status(200).json(new ApiResponse(200, [], "testing"));

  const guest = await Guest.create({
    fullName,
    mobileNumber,
    Address,
    purposeOfVisit,
    stayDates: { from, to },
    email,
    idProofNumber,
    stayingAt,
  });

  hotel.guests.push(guest._id);
  await hotel.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, guest, "thank you"));
});

exports.getGuestInfo = asyncHandler(async (req, res) => {
  if (req.user.role !== "guest-admin") {
    throw new ApiError(401, "Unauthorized request");
  }
  const { hotel_name, guest_id } = req.params;
  const hotel = await Hotel.findOne({ name: hotel_name });
  if (!hotel) throw new ApiError(400, "no hotel found");
  if (!guest_id || guest_id.length != 24)
    throw new ApiError(400, "Please provide a valid guest id");

  const guest = await Guest.find({
    _id: guest_id,
    status: { $ne: "removed" },
  });

  if (!guest) throw new ApiError(400, "No user found");

  res.status(200).json(new ApiResponse(200, guest, "success"));
});
