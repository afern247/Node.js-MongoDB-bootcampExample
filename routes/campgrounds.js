var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


// INDEX - Show all campgrounds
router.get('/', function (req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(error('Error!\n'));
            console.log(err);
        } else {
            //req.user gets the current user logged in, if no one, then null
            res.render('campgrounds/index', { campgrounds: allCampgrounds });
        }
    });
});

// CREATE - Add new campground to db
router.post('/', middleware.isLoggedIn, function (req, res) {
    // get data from form and add to campgrounds array
    var newName = req.body.name;
    var newImage = req.body.image;
    var newDescription = req.body.description;
    var newAuthor = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {   // Store all the new campground info in that var so we can submit it later to DB
        name: newName,
        image: newImage,
        description: newDescription,
        author: newAuthor
    };
    // console.log(req.user); // Check which user is logged in, test
    // Create a new campground and save to db
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            // redirect back to campground page
            res.redirect('/campgrounds');
        }
    })
});

// NEW - Show form to create new campground
router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('campgrounds/new');
});


// SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
    //find the campground with provided ID, remeber  the comments are ID references, look at the comment model
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err || !foundCampground) { // if foundCampground is null, throw an error
            req.flash('error', 'Campground not found.');
            res.redirect('back');
        } else {
            //console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {
            campground: foundCampground
            });
        }
    });
});

// EDIT CAMPGROUND
router.get('/:id/edit', middleware.checkCampgroundOwnership, function (req, res) {
    // Is user logged in?
    Campground.findById(req.params.id, function(err, foundCampground){
            res.render('campgrounds/edit', {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND
router.put('/:id', middleware.checkCampgroundOwnership, function (req, res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//DESTROY Campground
router.delete('/:id', middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err){
       if (err) {
           res.redirect('/campgrounds');
       } else {
        req.flash('success', 'Campground deleted!');
        res.redirect('/campgrounds');
       }
    });
});



// export router to use it later on app.js:
// var campgroundRoutes = require('./routes/campgrounds');
module.exports = router;