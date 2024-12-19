import mongoose from "mongoose";

import Post from "../models/Post.models.js";  // Assuming you've named the model file like this
import user from "../models/user.models.js";  
import cloudinary from "../middleware/cloudinary.js"

// Function to upload image to Cloudinary and return the URL
const uploadImageToCloudinary = async (localPath) => {
    try {
        // Upload the image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(localPath, {
            resource_type: "image", // Ensure we upload only images
        });

        // Uncomment to delete the local file after upload
        // fs.unlinkSync(localPath);

        return uploadResult.url;  // Return the URL of the uploaded image
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        // Uncomment to delete the local file on error
        // fs.unlinkSync(localPath);
        return null;
    }
};

// Create a new post
const createPost = async (req, res) => {
    const { username, title, description, tags } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: "Post should have an image" });
    }

    try {
        const imageUrl = await uploadImageToCloudinary(req.file.path);  // Assuming this function is defined

        const newPost = await Post.create({
            username,
            title,
            description,
            image: imageUrl,
            tags,
        });

        res.status(200).json({
            success: true,
            message: "Post created successfully",
            post: newPost,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating post" });
    }
};

// Increment view count when the post is viewed
const viewPost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Not a valid post ID" });
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: `No post with ID: ${id}` });
        }

        // Increment the view count
        post.views += 1;
        await post.save();

        res.status(200).json({ message: "Post viewed", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error viewing post" });
    }
};

// Like or react to a post
const reactToPost = async (req, res) => {
    const { id } = req.params;
    const { reactionType } = req.body;  // Reaction type like 'heart', 'sad', etc.

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Not a valid post ID" });
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: `No post with ID: ${id}` });
        }

        // Add or remove reaction
        const existingReaction = post.likes.find(like => like.user.toString() === req.user.id);
        if (existingReaction) {
            post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);  // Remove existing reaction
        }

        post.likes.push({ type: reactionType });  // Add new reaction
        await post.save();

        res.status(200).json({ message: "Post reacted to", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error reacting to post" });
    }
};

export { createPost, viewPost, reactToPost };
