const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const Admin = require("../models/admin.model");

exports.verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token)
        throw new ApiError(401, "Unauthorized request");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await Admin.findById(decodedToken._id).select("-password -refreshToken");
    if (!user)
        throw new ApiError(400, "Token is invalid or expired, please login again");
    req.user = user;
    return next();
})