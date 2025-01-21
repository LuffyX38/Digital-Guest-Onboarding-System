const Hotel = require("../models/hotel.model");
const Admin = require("../models/admin.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const uploadOnCloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");
const convertLinkToQr = require("../utils/qr");

exports.singleHotel = asyncHandler(async (req, res) => {
  const { hotel_name } = req.params;
  if (!hotel_name) throw new ApiError(400, "please provide a valid id");

  // const hotel = await Hotel.findOne({ name: hotel_name }).select("-guests");

  const hotel = await Hotel.aggregate([
    {
      $match: {
        name: hotel_name,
      },
    },
    {
      $project: {
        name: 1,
        _id: 1,
        logo: 1,
        address: 1,
        hotelStatus: 1,
        createdAt: 1,
        guestCount: { $size: { $ifNull: ["$guests", []] } },
      },
    },
  ]);

  if (!hotel.length) throw new ApiError(400, "No hotel found");

  const frontEndLocalHost = `localhost:${process.env.FRONTEND_PORT}`;

  const encodedLink = `${
    req.protocol
  }://${frontEndLocalHost}/hotel-book/${encodeURI(hotel[0]?.name)}`;
  // const encodedLink = (;
  let qrcode = await convertLinkToQr(encodedLink);

  if (!qrcode) qrcode = "no address found";

  if (!hotel) throw new ApiError(400, "no hotel found");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { hotel: hotel[0] ? hotel[0] : [], qrcode },
        "one hotel found"
      )
    );
});

exports.showHotels = asyncHandler(async (req, res) => {
  //   baseUrl: '/api/v1/hotel',
  //   originalUrl: '/api/v1/hotel/67881cfc6e375724ff0e2b22'
  //   host: 3000
  //   pathname: '/67881cfc6e375724ff0e2b22'

  let { count, limit } = req.query;
  // console.log(count, limit);
  count = parseInt(count) || 1;
  limit = parseInt(limit) || 10;

  let offset = (count - 1) * limit;
  const hotel = await Hotel.aggregate([
    {
      $project: {
        name: 1,
        logo: 1,
        address: 1,
        hotelStatus: 1,
        createdAt: 1,
        guestCount: {
          $size: {
            $ifNull: ["$guests", []],
          },
        },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: offset },
    { $limit: limit },
  ]);

  //  { $skip: 10 },
  // { $limit: 5 },

  //          (1  * 1) * 2 = 2
  //           (2 * 1) * 2 = 4
  if (!hotel) throw new ApiError(400, "No hotel found");

  res.status(200).json(new ApiResponse(200, hotel, `total: ${hotel.length}`));
});

exports.addHotel = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user._id).select("-password");

  if (admin.role !== "main-admin")
    throw new ApiError(
      401,
      "Unauthorized access, not authorized to perform this action"
    );

  const { name, address } = req.body;
  if (!req.file.path) throw new ApiError(400, "Please upload hotel picture");

  if (!name || !address) throw new ApiError(400, "All fields are required");

  const uploadedImage = await uploadOnCloudinary(req.file.path);

  if (!uploadedImage) throw new ApiError(400, "Error uploading image");

  const hotel = await Hotel.create({
    name,
    logo: uploadedImage.secure_url,
    address,
  });

  res.status(200).json(new ApiResponse(200, [], `Hotel added successfully`));
});

exports.changeHotelStatus = asyncHandler(async (req, res) => {
  if (!req.user || req.user?.role !== "main-admin")
    throw new ApiError(
      401,
      "Unauthorized access, not authorized to perform this action"
    );
  const { hotel_name } = req.params;
  console.log(hotel_name);
  if (!hotel_name) throw new ApiError(400, "no hotel name provied");
  // const admin = await Admin.findById(req.user._id).select("-password");

  const hotelId = await Hotel.findOne({ name: hotel_name });

  const hotel_id = hotelId._id;
  // console.log(hotel_id.length);
  if (!hotel_id) throw new ApiError(400, "hotel id is invalid");

  const { status } = req.body;

  if (!status) throw new ApiError(400, "Please provide a status!!");

  const hotel = await Hotel.findByIdAndUpdate(
    hotel_id,
    {
      $set: {
        hotelStatus: status,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!hotel) throw new ApiError(400, "No hotel found");

  res
    .status(200)
    .json(new ApiResponse(200, hotel, `status is changed to ${status}`));
});

exports.updateHotelInfo = asyncHandler(async (req, res) => {
  if (req.user.role !== "main-admin")
    throw new ApiError(401, "Unauthorized access");

  const { hotel_name } = req.params;
  if (!hotel_name) throw new ApiError(400, "Hotel name is required");

  const hotelId = await Hotel.findOne({ name: hotel_name });

  if (!hotelId) throw new ApiError(400, "no hotel found");

  const hotel_id = hotelId.id;

  if (!hotel_id || hotel_id.length !== 24)
    throw new ApiError(400, "Hotel id is invalid");

  const filePath = req.file?.path;

  let obj = {};

  Object.entries(req.body).map((e) => {
    if (e[1].trim()) {
      obj[e[0]] = e[1];
    }
  });

  const uploadedImage = await uploadOnCloudinary(filePath);
  // if (!uploadedImage)
  //   throw new ApiError(400, "Error uploading image, try again!!");

  if (filePath) {
    obj.logo = uploadedImage.secure_url;
  }
  console.log(obj);

  const hotel = await Hotel.findByIdAndUpdate(hotel_id, obj, {
    new: true,
    runValidators: true,
  });

  if (!hotel) throw new ApiError(400, "hotel not found");

  res.status(200).json(new ApiResponse(200, hotel, "success"));
});

//Show all guest details for their respective hotel in a table.

exports.showHotelGuests = asyncHandler(async (req, res) => {
  const { hotel_name } = req.params;
  // console.log(req.params)

  if (!hotel_name) throw new ApiError(400, "Provide hotel name");

  const hotelId = await Hotel.findOne({ name: decodeURI(hotel_name) });

  const hotel_id = hotelId.id;

  if (!hotel_id || hotel_id.length !== 24)
    throw new ApiError(400, "please provide a valid id");
  if (req.user.role !== "guest-admin")
    throw new ApiError(401, "Unauthorized request");

  const hotel = await Hotel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(hotel_id),
      },
    },
    {
      $lookup: {
        from: "guests",
        // localField: "guests",
        // foreignField: "_id",
        // as: "guests_info",
        let: { guest_id: "$guests" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ["$_id", "$$guest_id"] },
                  { $ne: ["$status", "removed"] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
              fullName: 1,
              purposeOfVisit: 1,
              email: 1,
              status:1
            },
          },
        ],
        as: "guest_info",
      },
    },
  ]);
  if (!hotel.length) throw new ApiError(400, "No hotel found");

  res.status(200).json(new ApiResponse(200, hotel, `total: ${hotel.length}`));
});
