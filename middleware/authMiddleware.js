// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    //get header authorization "Bearer token"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'Token tidak ditemukan. Silakan login terlebih dahulu.',
        });
    }

    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //get user to request   
        req.user = decoded;

        next();
         
    } catch (error) {
        return res.status(403).json({
            status: 'fail',
            message: 'Token tidak valid atau sudah kadaluarsa. Silakan login kembali.',
        });
    }
}

module.exports = authMiddleware;
