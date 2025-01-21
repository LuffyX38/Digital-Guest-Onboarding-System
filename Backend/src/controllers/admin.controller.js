const Admin = require("../models/admin.model");
const Guest = require("../models/guest.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const Hotel = require("../models/hotel.model");
const mongoose = require("mongoose");

exports.myProfile = asyncHandler(async (req, res) => {
  const user = await Admin.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!user) throw new ApiError(400, "No user found");
  res.status(200).json(new ApiResponse(200, user, `You're logged in`));
});

exports.testRoute = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, [], "it is working"));
});

const generateRefreshToken = async (userId) => {
  try {
    const admin = await Admin.findById(userId);
    const refreshToken = admin.generateRefreshToken();
    const accessToken = admin.generateAccessToken();
    admin.refreshToken = refreshToken;
    admin.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(404, "Error while creating the token");
  }
};

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, confirmPassword } = req.body;
  if (!name?.trim() || !email?.trim() || !password || !role || !confirmPassword)
    throw new ApiError(400, "All fields are reqired");

  if (password !== confirmPassword)
    throw new ApiError(400, "Passwords are not matching");

  const existingUser = await Admin.findOne({ email });

  if (existingUser)
    throw new ApiError(400, "User with same email already exists!!");

  const admin = await Admin.create({
    name,
    email,
    password,
    role,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, [], "User registered successfully"));
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new ApiError(400, "All fields are required");

  const admin = await Admin.findOne({ email });

  if (!admin || !(await admin.isPasswordCorrect(password)))
    throw new ApiError(401, "User credentials are Invalid");

  const { refreshToken, accessToken } = await generateRefreshToken(admin._id);
  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, option)
    .cookie("accessToken", accessToken, option)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        `You've logged in successfully`
      )
    );
});

exports.logout = asyncHandler(async (req, res) => {
  const admin = await Admin.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("refreshToken", option)
    .clearCookie("accessToken", option)
    .json(new ApiResponse(200, [], "Logged out successfully"));
});

exports.updateGuest = asyncHandler(async (req, res) => {
  if (req.user.role !== "guest-admin")
    throw new ApiError(401, "Unauthorized request");

  const { hotel_name, guest_id } = req.params;
  const hotelId = await Hotel.findOne({ name: decodeURI(hotel_name) });
  const guestId = await Guest.findById(decodeURI(guest_id));

  if (!hotelId || !guestId)
    throw new ApiError(400, "invalid guest or hotel name");

  // const guest_id = guestId.id;
  const hotel_id = hotelId.id;


  console.log("from controller");
  if (!guest_id || guest_id.length != 24)
  throw new ApiError(400, "Please provide a valid guest id");

  if (!hotel_id || hotel_id.length != 24)
    throw new ApiError(400, "Please provide a valid hotel id");

  const { status } = req.body;

  if (!status) throw new ApiError(400, "Please provide status");

  const query = {
    $set: { status },
  };

  if (status === "removed") {
    query.$unset = { stayingAt: 1 };
  }

  const guest = await Guest.findByIdAndUpdate(
    { _id: guest_id, stayingAt: hotel_id },
    query,
    {
      new: true,
      runValidators: false,
    }
  );
  console.log("updated guest: ", guest);

  if (!guest) throw new ApiError(400, "No User found");

  if (status === "removed") {
    const hotel = await Hotel.findById({ _id: hotel_id });

    if (hotel) {
      hotel.guests.pull(guest_id);
      await hotel.save({ validateBeforeSave: false });
    } else {
      throw new ApiError(400, "No hotel found");
    }
  }
  // console.log("updated hotel: ", hotel);
  res.status(200).json(new ApiResponse(200, [], "success"));
});
