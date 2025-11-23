// Controllers/authControllers.js, (logic for register/login);

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');
const { sendVerificationEmail } = require('../lib/mailer');

const SALT_ROUNDS = 10;

//----- Helpers for validasi input register
function validateRegisterInput({fullname, username, email, password}) {
    const errors = [];
    
    if(!fullname || !fullname.trim()){
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

//----- (REGISTER) POST /api/auth/register
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
      return res.status(400).json({ status: 'fail', message: 'Validasi gagal', errors,});
    }

    // 2. check if email already exists or no
     const existingEmail = await User.findOne({
      where: { user_email: email },
    });

    if (existingEmail) {
      return res
        .status(409)
        .json({ status: "fail", message: "Email sudah terdaftar" });
    }

    // 3. check if username already exists or no
    const existingUsername = await User.findOne({
      where: { user_name: username },
    });

    if (existingUsername) {
      return res
        .status(409)
        .json({ status: "fail", message: "Username sudah digunakan" });
    }
    // 4. Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    // 5. Generate token verification (UUID)
    const token = uuidv4();
    
    // 6. Save user into db (verified = 'pending' by default dari ENUM)
    const newUser = await User.create({
      fullname,
      user_name: username,
      user_email: email,
      user_password: hashedPassword,
      token,

    });

    // 7. Make verification URL
    const baseUrl =
      process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;

    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;

    // 8. Sending email for veriication into Mailer
    await sendVerificationEmail(email, verificationUrl);

    // 9. Response Success
    return res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil, cek email untuk verifikasi',
      data: {
        user_id: newUser.user_id,
        fullname,
        username,
        email,
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

//----- (VERIFY EMAIL FIXED) GET /api/auth/verify-email
async function verifyEmail(req, res) {
    try {
        const { token } = req.query;
        // 1. check token 
        if (!token) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Token verifikasi diperlukan',
            });
        }
        // 2. find user by token
        const user = await User.findOne({ 
            where: { token } 
        });

        if (!user) {
            return res.status(400).json({
                status: 'fail',
                message: 'Token verifikasi tidak valid atau sudah digunakan', 
            });
        }
        // 3.check if user already verified or not
        if (user.verified === 'yes') {
            return res.status(400).json({
                status: 'success',
                message: 'Email sudah terverifikasi sebelumnya',
            });
        }
        //4. update status verified to 'yes' and remove token
        user.verified = 'yes';
        user.token = null;
        await user.save();

        //5. send response success
        return res.status(200).json({
            status: 'success',
            message: 'Email berhasil diverifikasi, Anda dapat login sekarang',
        });

    } catch (err) {
        console.error('[VERIFY EMAIL ERROR]', err);
        return res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan pada server',
        });
        
    }
}


module.exports = {register,verifyEmail};

