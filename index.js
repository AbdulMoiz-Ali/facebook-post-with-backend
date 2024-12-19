import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./src/db/index.js";
import PostRoutes from "./src/routes/Post.routes.js";
import UserRoutes from "./src/routes/user.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route for the root endpoint
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Routes
app.use("/post", PostRoutes);
app.use("/user", UserRoutes);

// Database Connection and Server Start
connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`⚙️  Server is running at port: ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("MONGO DB connection failed !!!", err);
    });
