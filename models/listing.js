const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const review = require("./review");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,

    image: {
        type: String,
        default: "https://www.istockphoto.com/photo/beautiful-green-valley-village-surrounded-by-majestic-mountains-gm2279708040-691751487?utm_source=unsplash&utm_medium=affiliate&utm_campaign=srp_photos_bottom&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fstaycation&utm_term=staycation%3A%3A%3A%3A46f09345-33b3-42d2-a4ac-eb1636adf788",
        set: (v) => v === "" ? "https://www.istockphoto.com/photo/beautiful-green-valley-village-surrounded-by-majestic-mountains-gm2279708040-691751487?utm_source=unsplash&utm_medium=affiliate&utm_campaign=srp_photos_bottom&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fstaycation&utm_term=staycation%3A%3A%3A%3A46f09345-33b3-42d2-a4ac-eb1636adf788" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        },
    ],
    owner : {
        type: Schema.Types.ObjectId,
        ref: "User",
    }

});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }

});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;