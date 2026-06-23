const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
// const {listingSchema} = require("../schema");
// const expressError = require("../utils/expressError");
const Listing = require("../models/listing");
const {validateListing, isLoggedIn, isOwner} = require("../middleware.js");
// const {isOwner} = require("../middleware.js");



//Index Route
router.get("", wrapAsync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//get new listing form
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate : ({path: "createdBy"})}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist.");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}));

//create new listing
router.post("", isLoggedIn, validateListing, wrapAsync(async(req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist.");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    // let listing = await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error", "You don't have permission to edit");
    //     return res.redirect(`/listings/${id}`);
    // }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;