const express = require("express");
const { userRegister, userLogin, vendorRegistration } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/vendor/register", vendorRegistration);

module.exports = router;