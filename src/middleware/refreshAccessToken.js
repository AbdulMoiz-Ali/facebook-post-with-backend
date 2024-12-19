import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../utils/tokenUtils.js';  // Import token generation function

// Middleware to handle refresh token and generate a new Access Token
const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;  // Get refresh token from cookies

    if (!refreshToken) {
        return res.status(403).json({ message: "Refresh Token is missing" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);  // Verify Refresh Token
        const newAccessToken = generateAccessToken(decoded.id);  // Generate new Access Token

        res.status(200).json({
            accessToken: newAccessToken,  // Send new Access Token to client
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired Refresh Token" });
    }
};

export default refreshAccessToken;
