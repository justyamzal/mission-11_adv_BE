// routes/userRoutes.js

const express = require('express');
const auth = require('../middleware/authMiddleware');
const { User } = require('../models');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.user_id;
        
        const user = await User.findOne({
            where: { user_id: userId },
            attributes: { exclude: ['user_password'] }, // jangan kirim password
        });
        
        if (!user) {
                  return res.status(404).json({
            status: 'fail',
            message: 'User tidak ditemukan',
            });
        }
        return res.status(200).json({
        status: 'success',
        message: 'Profil user saat ini',
        data: user,
        })
       
    } catch (err) {
        console.error('[GET ME ERROR]',err);
        return res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan pada server',
        })
    }
});

module.exports = router;