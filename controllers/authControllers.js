// controllers/authControllers.js (logic for register/login);

const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');
const {user} = require('../models');
const { sendVerificationEmail } = require('../lib/mailer');

const SALT_ROUNDS = 10;

//Helpers for validasi input register
function validateRegisterInput(username, email, password) {
    const error = [];
    
    if(!fullname || fullname.trim()){
        error.push("Fullname wajib diisi");
    }

    if (!username || !username.trim()) {
        errors.push('Username wajib diisi');
    }

     if (!email || !email.trim()) {
        errors.push('Email wajib diisi');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        errors.push('Format email tidak valid');
        }
    }

    if (!password || password.length < 6) {
        errors.push('Password minimal 6 karakter');
    }

    return { valid: errors.length === 0, errors};

}

// POST /api/auth/register
async function register(req, res) {
  try {
    const { fullname, username, email, password } = req.body;

    // 1. Validation for the input
    const { valid, errors } = validateRegisterInput({
      fullname,
      username,
      email,
      password,
    });

    if (!valid) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validasi gagal',
        errors,
      });
    }

    // 2. check if email already exists or no
    const existingByEmail = await User.findOne({
      where: { user_email: email },
    });

    if (existingByEmail) {
      return res.status(409).json({
        status: 'fail',
        message: 'Email sudah terdaftar',
      });
    }

    // 3. check if username already exists or no
    const existingByUsername = await User.findOne({
      where: { user_name: username },
    });

    if (existingByUsername) {
      return res.status(409).json({
        status: 'fail',
        message: 'Username sudah digunakan',
      });
    }

    // 4. Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 5. Generate token verification (UUID)
    const verificationToken = uuidv4();

    // 6. Save user into db (verified = 'pending' by default dari ENUM)
    const newUser = await User.create({
      fullname,
      user_name: username,
      user_email: email,
      user_password: hashedPassword,
      token: verificationToken,
      // status_subs: 'inactive', device_type: 'desktop', verified: 'pending'
      //follows default on DB / model
    });

    // 7. Make verification URL
    const baseUrl =
      process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
    // contoh: http://localhost:5000/api/auth/verify-email?token=xxxx
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

    // 8. Sending email for veriication into Mailer
    await sendVerificationEmail(email, verificationUrl);

    // 9. Response Success
    return res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil, cek email untuk verifikasi',
      data: {
        user_id: newUser.user_id,
        fullname: newUser.fullname,
        username: newUser.user_name,
        email: newUser.user_email,
      },
    });
  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
  }
}

module.exports = {
  register,
};