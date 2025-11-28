const { User } = require('../models');
const fs = require('fs');
const path = require('path');

// helper: hapus file lama jika ada
function deleteFileIfExists(filePath) {
  if (!filePath) return;

  const relativePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const fullPath = path.join(process.cwd(), relativePath);

  fs.unlink(fullPath, (err) => {
    if (err) console.warn('Gagal hapus file profil:', fullPath, err.message);
    else console.log('File profil dihapus:', fullPath);
  });
}

module.exports = {

  // GET current user (me)
  getProfile: async (req, res) => {
    try {
      const userId = req.user.user_id;

      const user = await User.findOne({
        where: { user_id: userId },
        attributes: { exclude: ['user_password'] },
      });

      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "User tidak ditemukan",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Profil user saat ini",
        data: user,
      });

    } catch (err) {
      console.error('[GET PROFILE ERROR]', err);
      return res.status(500).json({ status: "error", message: "Terjadi kesalahan server" });
    }
  },

  // UPDATE profile + optional photo upload
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.user_id;

      const user = await User.findOne({ where: { user_id: userId } });
      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "User tidak ditemukan",
        });
      }

      const { fullname, user_name, device_type } = req.body;
      const updateData = {};

      if (fullname) updateData.fullname = fullname;
      if (user_name) updateData.user_name = user_name;
      if (device_type) updateData.device_type = device_type;

      const oldProfilePic = user.profile_picture;

      // jika upload file (opsional)
      if (req.file) {
        updateData.profile_picture = `/uploads/${req.file.filename}`;
      }

      await user.update(updateData);

      // hapus file lama jika ada file baru
      if (req.file && oldProfilePic && oldProfilePic !== user.profile_picture) {
        deleteFileIfExists(oldProfilePic);
      }

      const safeUser = user.toJSON();
      delete safeUser.user_password;

      return res.status(200).json({
        status: "success",
        message: "Profil user berhasil diupdate",
        data: safeUser,
      });

    } catch (err) {
      console.error('[UPDATE PROFILE ERROR]', err);
      return res.status(500).json({ status: "error", message: "Terjadi kesalahan server" });
    }
  }

};
