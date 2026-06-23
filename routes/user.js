const express = require("express");
const router = express.Router();
const passport = require("passport");

//model
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");

//middleware
const { saveRedirectUrl } = require('../middleware');

const userController = require("../controllers/user");


router
    .route("/signup")
    .get(userController.signUp)
    .post(wrapAsync(userController.registerUser));



router
    .route("/login")
    .get(userController.login)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true, }), userController.loginUser);

router.get("/logout", userController.logout);

module.exports = router;