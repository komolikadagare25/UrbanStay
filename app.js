const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

const mongo_url = "mongodb://127.0.0.1:27017/urbanstay";

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");


main().then(() => {
    console.log("Database Connected");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(mongo_url);
};


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = { 
    secret: "mysupersecretcode", 
    resave: false, 
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000, //1 week
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    } };




app.get("/", (req, res) => {
    res.send("Hi, i am root");
});


//flash and session
app.use(session(sessionOptions));
app.use(flash());


//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//register demo user route
// app.get("/demouser", async(req, res) =>{
//     let fakeUser = new User({
//         email : "komal@gmail.com",
//         username : "komal"
//     });
//     const registerUser = await User.register(fakeUser, "abcdef");
//     console.log(registerUser);
//     res.send(registerUser);
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.use((req, res, next)=>{
    next(new expressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    console.log(err);
    console.log(err.stack);
    let {statusCode= 500, message="something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});