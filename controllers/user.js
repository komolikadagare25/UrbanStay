const User = require("../models/user");

//get signup form
module.exports.signUp = (req, res) => {
    res.render("users/signup.ejs");
};

//register user
module.exports.registerUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                next(err);
            }
            req.flash("success", "Welcome to UrbanStay!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

//get login page
module.exports.login = (req, res) => {
    res.render("users/login.ejs");
};

//login user
module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome to urbanStay!! You are logged in.");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

//logout
module.exports.logout = (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged you out");
        res.redirect("/listings");
    });
};