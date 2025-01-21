const router = require("express").Router();

const auth = require("../middleware/auth");
const hotelController = require("../controllers/hotel.controller");
const upload = require("../middleware/multer");

router.route("/show-all-hotels").get(hotelController.showHotels);
router.route("/show-this-hotel/:hotel_name").get(hotelController.singleHotel);

router
  .route("/add-hotel")
  .post(auth.verifyJWT, upload.single("logo"), hotelController.addHotel);

router
  .route("/config-hotel/:hotel_name")
  .patch(auth.verifyJWT, hotelController.changeHotelStatus);

router
  .route("/update-hotel-info/:hotel_name")
  .patch(
    auth.verifyJWT,
    upload.single("logo"),
    hotelController.updateHotelInfo
  );

router
  .route("/show-hotel-guests/:hotel_name")
  .get(auth.verifyJWT, hotelController.showHotelGuests);

module.exports = router;
