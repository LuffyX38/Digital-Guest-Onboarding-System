const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const cors = require("cors");
const morgan = require("morgan");

// app.use(morgan("combined"));


app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from frontend URL
    credentials: true, // Allow cookies and credentials
  })
);

const cookieParser = require("cookie-parser");

app.use(express.static("public"));
app.use(express.json());

app.use(cookieParser());

// Admin routes
const adminRoutes = require("./src/routes/admin.route");
app.use("/api/v1/admin", adminRoutes);

//User routes
const guestRoute = require("./src/routes/guest.route");
app.use("/api/v1/guest", guestRoute);

//hotel routes
const hotelRoute = require("./src/routes/hotel.route");
app.use("/api/v1/hotel", hotelRoute);

module.exports = app;
