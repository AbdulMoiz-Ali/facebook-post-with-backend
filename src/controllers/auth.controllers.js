import auth from './../models/user.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


// Generate Access Token
const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.SECRET_KEY, { expiresIn: '15m' });  // expires in 15 minutes
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.REFRESH_SECRET_KEY, { expiresIn: '7d' });  // expires in 7 days
};

// Register User
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const userExists = await auth.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email already exists" });

        // Create new user (password will be hashed by the middleware)
        const newUser = new auth({ name, email, password });
        await newUser.save();

        // Respond with success
        res.status(201).json({ message: "User created successfully", data: { name, email } });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await auth.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email or password is incorrect" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email or password is incorrect" });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Store refreshToken in cookies
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,       // Secure HTTP cookie
            sameSite: "strict",   // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000,  // Cookie expires in 7 days
        });

        // Send accessToken to client
        res.status(200).json({
            message: "Login successful",
            accessToken,
            user: {
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Logout Route - Clear Refresh Token Cookie
const logout = (req, res) => {
    res.clearCookie("refreshToken");  // Clear the refreshToken cookie
    res.status(200).json({ message: "Logged out successfully" });
};

export { register, login, generateAccessToken, generateRefreshToken, logout };