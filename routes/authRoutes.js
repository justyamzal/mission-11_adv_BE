// routes/authRoutes.js (authentication routes)

const express = require('express');
const { register, login, verifyEmail } = require('../controllers/authControllers');

const router = express.Router();
router.post('/register', register);
// nanti bisa tambah: router.get('/verify-email', verifyEmail);

module.exports = router;