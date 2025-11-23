// routes/authRoutes.js (authentication routes)

const express = require('express');
const { register, login, verifyEmail } = require('../controllers/authControllers');

const router = express.Router();
// Register
router.post('/register', register);
// Verify Email
router.get('/verify-email', verifyEmail);

module.exports = router;