// lib/mailer.js (for SMTP mailer configuration)

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure:false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

async function sendVerificationEmail(toEmail, verificationUrl) {
    const mailOptions = {
        from:process.env.SMTP_SENDER || '"CHILL App" <administrator@chill.app>',
        to: toEmail,
        subject: "Verifikasi Email Anda - CHILL",
        html:  `
        <h3>Halo,</h3>
        <p>Terima kasih sudah mendaftar di CHILL!</p>
        <p>Silakan klik link berikut untuk verifikasi email:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
        `,
    };
    return transporter.sendMail(mailOptions);
}
module.exports = { sendVerificationEmail };