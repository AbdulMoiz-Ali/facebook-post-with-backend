import express from 'express';
import { register, login, logout } from '../controllers/auth.controllers.js';
import { validateUserInput, validateLoginInput } from '../middleware/validateUserMiddleware.js';
import { hashPassword } from '../middleware/hashPasswordMiddleware.js';

const router = express.Router();

router.post('/register', validateUserInput, hashPassword, register);
router.post('/login', login)
router.post('/logout', logout)

export default router;
