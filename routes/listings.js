const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
//models
const Listing = require("../models/listing");
//middleware
const { validateListing, isLoggedIn, isOwner } = require("../middleware.js");
//controller
const listingController = require("../controllers/listing.js");


router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));


    
//get new listing form
router.get("/new", isLoggedIn, listingController.newListing);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));



module.exports = router;