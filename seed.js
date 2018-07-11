// ERROR DRIVEN DEVELOPMENT
// When we add comments in, we can see it inmidiatly, otherwise we have to create the routes, etc in order for us to see it

var mongoose        = require("mongoose");
var Campground      = require("./models/campground");
var Comment         = require("./models/comment");

var data = [{
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-0.3.5&s=7fe3ce3d0c1333c5e2463f73d9652bac&auto=format&fit=crop&w=750&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tempus hendrerit molestie. Nam maximus fringilla sem, quis egestas tortor eleifend iaculis. Donec vulputate turpis at dui vestibulum, eget porta diam semper. Vivamus maximus massa vulputate orci pulvinar, id gravida mi eleifend. Nam eu massa sed diam fringilla lacinia a in dolor. Morbi pharetra leo imperdiet, dictum velit ac, ultrices odio. Donec velit sapien, placerat ut urna eu, porta viverra ligula. Quisque molestie nisl velit, in laoreet ipsum posuere at. Duis luctus nulla vel consequat vulputate. Nunc dapibus nunc libero, non molestie leo pretium a. Nulla laoreet purus eu enim euismod, eget efficitur lectus ultricies. Mauris sodales dolor vel nunc bibendum, vel accumsan urna bibendum. Nulla vulputate, urna a congue vehicula, massa odio pellentesque risus, vitae elementum nunc neque vel lectus. Ut quis facilisis tellus. Pellentesque condimentum ipsum a justo hendrerit, vitae viverra est rutrum. Proin auctor orci quis lacus venenatis venenatis vel in metus."
    },
    {
        name: "Desert Mesa",
        image: "https://images.unsplash.com/photo-1465695954255-a262b0f57b40?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=06d92f647a2937af54f658e199c3d990&auto=format&fit=crop&w=750&q=80",
        description: "Nunc dictum vehicula sagittis. Cras eget risus id ante hendrerit condimentum. Cras lacinia ipsum ac odio convallis, vitae viverra justo hendrerit. Duis placerat massa ex."
    },
    {
        name: "Canyon Floor",
        image: "https://images.unsplash.com/photo-1465188162913-8fb5709d6d57?ixlib=rb-0.3.5&s=fcb7596fc0a5a3d279b03bbb0d7bd253&auto=format&fit=crop&w=750&q=80",
        description: "Sed vitae lacus congue, porta libero et, iaculis odio. Proin euismod elit sem, vel gravida sem commodo eu. Vestibulum sed dolor nec risus maximus tincidunt eu eu nisl. Nam in facilisis erat. Fusce vel urna purus. Praesent tincidunt mi ac vulputate porttitor. Nunc ultrices, risus quis placerat tincidunt, urna magna pulvinar ex, eu dictum nisl nulla vel ligula. Integer a venenatis diam."
    },
    {
        name: "Around the fire",
        image: "https://images.unsplash.com/photo-1475483768296-6163e08872a1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=14704e761ba133f2fb71ec6a8e6e8e07&auto=format&fit=crop&w=750&q=80",
        description: "Sed vitae lacus congue, porta libero et, iaculis odio. Proin euismod elit sem, vel gravida sem commodo eu. Vestibulum sed dolor nec risus maximus tincidunt eu eu nisl. Nam in facilisis erat. Fusce vel urna purus. Praesent tincidunt mi ac vulputate porttitor. Nunc ultrices, risus quis placerat tincidunt, urna magna pulvinar ex, eu dictum nisl nulla vel ligula. Integer a venenatis diam."
    }
]


function seedDB() {
    //Remove all campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        //console.log("removed campgrounds!");
        //add a few campgrounds
        data.forEach(function (loop) {
            Campground.create(loop, function (err, campground) {
                if (err) {
                    console.log(err)
                } else {
                    //console.log("added a campground");
                    //create a comment
                    Comment.create({
                        text: "This place is great, but I wish there was internet",
                        author: "Homer"
                    }, function (err, comment) {
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            //console.log("Created new comment");
                        }
                    });
                }
            });
        });
    });
    
}

module.exports = seedDB;
