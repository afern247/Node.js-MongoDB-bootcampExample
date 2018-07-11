var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");



//root route
router.get('/', function (req, res) {
    res.render('landing');
});


//show register form
router.get('/register', function (req, res) {
    res.render('register');
});

// handle sign up logic
router.post('/register', function (req, res) {
    var newUser = new User({ username: req.body.username  });
    if (req.body.adminCode === 'secret') {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function (err, user) {
                if (err) {
                    return res.render("register", {error: 'ERROR! ' + err.message});
                }
        passport.authenticate('local')(req, res, function () {
        req.flash('success', 'Account created. Welcome to YelpCamp ' + user.username);
        res.redirect('/campgrounds');
        });
    });
});

//show login form
router.get('/login', function (req, res) {
    res.render('login');
});

// handle login logic
// router.post ('/login', middleware, callback)
router.post('/login', passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {});


// log out route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash('success', 'Logged out succesfully');
    res.redirect("/campgrounds");
});



// middleware to check if user is logged in before he can add/see something
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


/*
//The 404 Route (ALWAYS Keep this as the last route)
router.get('*', function (req, res) {
    res.render('404');
});

*/

module.exports = router;