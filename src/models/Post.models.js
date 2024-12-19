import mongoose from "mongoose";

// Reaction schema (like heart, sad, etc.)
const reactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Assuming you have a User model for authentication
    },
    type: {
        type: String,
        enum: ['heart', 'sad', 'angry', 'wow', 'like'],  // Possible reactions
        required: true
    }
}, { timestamps: true });

// Comment schema (each comment will have text and a user)
const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the user who commented
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Facebook post schema
const facebookPostSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,  // User's name who created the post
    },
    title: {
        type: String,
        required: true,  // Title of the post
    },
    description: {
        type: String,
        required: true,  // Text content of the post
    },
    image: {
        type: String,
        required: true,  // Image URL (from Cloudinary, or local storage)
    },
    tags: [{
        type: String,  // Tags associated with the post
    }],
    likes: [reactionSchema],  // Reactions to the post
    comments: [commentSchema],  // Comments on the post
    shares: {
        type: Number,
        default: 0  // Number of shares
    },
    views: {
        type: Number,
        default: 0  // Number of views
    },
    postTime: {
        type: Date,
        default: Date.now  // Time when the post was created
    }
}, { timestamps: true });

export default mongoose.model('Post', facebookPostSchema);
