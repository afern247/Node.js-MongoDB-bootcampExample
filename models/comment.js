var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    author: {
 // We are embedding the ids, not the data of the comments
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);