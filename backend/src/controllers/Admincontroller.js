const { User } = require('../models');

/**
 * Update Email Admin
 * PUT /api/admin/update-email
 * Requires authentication & admin role
 */
exports.updateEmail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_email } = req.body;

    // Validasi input
    if (!current_password || !new_email) {
      return res.status(400).json({
        success: false,
        message: 'Password saat ini dan email baru wajib diisi'
      });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(new_email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid'
      });
    }

    // Cari user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Verify role admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya admin yang dapat mengubah email.'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(current_password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Password saat ini salah'
      });
    }

    // Cek apakah email sudah digunakan
    const existingUser = await User.findOne({ 
      where: { email: new_email } 
    });

    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah digunakan oleh user lain'
      });
    }

    // Cek apakah email baru sama dengan email lama
    if (user.email === new_email) {
      return res.status(400).json({
        success: false,
        message: 'Email baru tidak boleh sama dengan email saat ini'
      });
    }

    // Update email
    await user.update({ email: new_email });

    res.json({
      success: true,
      message: 'Email berhasil diubah',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengubah email',
      error: error.message
    });
  }
};

/**
 * Update Password Admin
 * PUT /api/admin/update-password
 * Requires authentication & admin role
 */
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password, confirm_password } = req.body;

    // Validasi input
    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }

    // Validasi panjang password
    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password baru minimal 6 karakter'
      });
    }

    // Validasi konfirmasi password
    if (new_password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'Konfirmasi password tidak cocok'
      });
    }

    // Cari user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Verify role admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya admin yang dapat mengubah password.'
      });
    }

    // Verify password lama
    const isPasswordValid = await user.comparePassword(current_password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Password saat ini salah'
      });
    }

    // Cek apakah password baru sama dengan password lama
    const isSamePassword = await user.comparePassword(new_password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'Password baru tidak boleh sama dengan password saat ini'
      });
    }

    // Update password
    await user.update({ password: new_password });

    res.json({
      success: true,
      message: 'Password berhasil diubah'
    });

  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengubah password',
      error: error.message
    });
  }
};