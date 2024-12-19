// hashPasswordMiddleware.js

import bcrypt from 'bcryptjs';

export const hashPassword = async (req, res, next) => {
    if (req.body && req.body.password) {  // Ensure req.body exists and password is provided
        try {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt); // Hash the password
            next(); // Continue to the next middleware
        } catch (error) {
            console.error("Error hashing password:", error);
            res.status(500).json({ message: "Error hashing password" });
        }
    }
};
