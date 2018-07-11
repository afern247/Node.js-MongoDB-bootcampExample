var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleare goes here, we are defining the middleware and saying it's an object
var middlewareObj = {};


middlewareObj.checkCampgroundOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               req.flash('error', 'Campground not found!');
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash('error', 'You don\'t have access to do that!');
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
        req.flash('error', 'You don\'t have access to do that!');
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // this doesn't show anything, this is a way to access the message, we can show it in //show login form in index.js inside routes
    req.flash('error', 'Please log in to do that!'); // error is the id that we'll reference to, and once we call it, it'll say: Please log in first!
    res.redirect("/login");
}

module.exports = middlewareObj;