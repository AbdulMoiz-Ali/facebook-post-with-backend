import express from "express";
import { upload } from "../middleware/multer.middleware.js";  // Assuming you're using multer for image uploads
import authenticate from "../middleware/authenticate.middleware.js";  // Assuming you have authentication middleware
import { createPost, reactToPost, viewPost } from "../controllers/Post.controllers.js";

const router = express.Router();

// Route to create a new post (requires image upload)
router.post('/create', upload.single('image'), createPost);

// Route to view a post (increments the view count)
router.get('/view/:id', viewPost);  // :id is the post's ID in the URL

// Route to react to a post (e.g., like, heart, etc.)
router.put('/react/:id', reactToPost);  // :id is the post's ID and the reaction type is in the body

export default router;
