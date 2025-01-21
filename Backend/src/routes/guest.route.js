const router = require("express").Router();
const guestController = require("../controllers/guest.controller");
const auth = require("../middleware/auth");

router.route("/book-hotel/:hotel_name").post(guestController.bookingHotel);
router.route("/get-guest/:hotel_name/:guest_id").get(auth.verifyJWT,guestController.getGuestInfo);

module.exports = router;