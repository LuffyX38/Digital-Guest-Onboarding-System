const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const auth = require("../middleware/auth");

router.route("/test-auth").get(auth.verifyJWT, adminController.testRoute);

router.route("/register").post(adminController.register);
router.route("/login").post(adminController.login);
router.route("/logout").get(auth.verifyJWT, adminController.logout);

router.route("/my-profile").get(auth.verifyJWT, adminController.myProfile);



router.route("/update-guest/:hotel_name/:guest_id").patch(auth.verifyJWT, adminController.updateGuest);


module.exports = router;