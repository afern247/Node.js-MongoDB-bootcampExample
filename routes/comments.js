var express = require("express");
/* when using express router we can pass an option inside of an object
{mergeParams: true} and this will merge the params from the campground
and the comments together so that inside the comments route we are able to
access :id that we defined (this is only necessary if the route on another
page will be define like: app.use('/campgrounds/:id/comments', commentRoutes);
if you put the app.use(commentRoutes); in app.js normally and define here the normal route: router.get("/campgrounds/:id/comments/new", ... then you don't need it)
*/
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// NEW ROUTE
// isLoggedIn is the function described below, it will check if the use is
// currently logged in before letting him add a comment
router.get("/new", middleware.isLoggedIn, function (req, res) {
    // find campground by id
    Campground.findById(req.params.id, function (err, campground_id) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground_id});
        }
    });
});


// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function (req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function (err, campgroundID) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // all the comment data will be stored in the object comment, so we can retrieve it can push it without having to do:
            // var text = req.body.text;
            // var author = req.body.author;
            Comment.create(req.body.comment, function (err, newComment) {
                if (err) {
                    console.log(err);
                } else {
                    // Association between campgrounds and comments
                    //add username and id to comment
                    newComment.author.id = req.user._id; // because of the way the schema is setup, we have a comment, inside an author, and inside an id. Go to models and see.
                    newComment.author.username = req.user.username; // gets username
                    newComment.save(); // saves the comment
                    campgroundID.comments.push(newComment); // push it into the comments of the campgrounds
                    campgroundID.save(); // save campgrounds
                    res.redirect('/campgrounds/' + campgroundID._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
});

//  EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err || !foundCampground) {
            req.flash('error', 'ERROR: The campground does not exists!');
            res.redirect('back');
        } else {
            Comment.findById(req.params.comment_id, function (err, foundComment) {
                if (err) {
                    res.redirect('back');
                } else {
                    res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
                }
            });
        }
    });
});


// UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
    //lookup campground using ID
    // findById takes 3 diff things: the id to find by, the data to updated with, and the callback to run afterwards
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});


// DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    // findById takes 3 diff things: the id to find by, the data to updated with, and the callback to run afterwards
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});



module.exports = router;