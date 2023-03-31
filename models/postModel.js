const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: [true, "Please Write the message"],
        trim: true,// for avoid leading and trailing whitespace
        maxLength: [300, "Message cannot exceed 300 characters"]
    },
    comments: [{
        sentBy: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        sentAt: {
            type: Date,
            default: Date.now,
        },
        comment: {
            type: String,
            required: [true, "Please Write the Comment"],
            maxLength: [50, "comment cannot exceed 50 characters"]
        },
        likedby: [
            {
                user: {
                    type: mongoose.Schema.ObjectId,
                    ref: "User",
                    required: true,
                }
            }
        ]
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("Post", postSchema);
// export as a Post module