// routes/userRoutes.js

const express = require('express');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadImages');
const userController = require('../controllers/userControllers');
const router = express.Router();

// GET profil user
router.get('/', auth, userController.getProfile);

// PATCH profil user + optional profile_picture
router.patch('/', auth, upload.single('profile_picture'), userController.updateProfile);

module.exports = router;