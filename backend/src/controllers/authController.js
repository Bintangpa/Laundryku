const jwt = require('jsonwebtoken');
const { User, Partner } = require('../models');

/**
 * Generate JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Register Mitra Baru
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      nama_toko,
      alamat,
      no_telepon,
      kota
    } = req.body;

    // Validasi input
    if (!email || !password || !nama_toko || !alamat || !no_telepon) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, nama_toko, alamat, dan no_telepon wajib diisi'
      });
    }

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter'
      });
    }

    // ✅ Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // ✅ BARU: Cek apakah nomor telepon sudah terdaftar
    const existingPhone = await Partner.findOne({ where: { no_telepon } });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'Nomor telepon sudah terdaftar'
      });
    }

    // Buat user baru (role: mitra)
    const user = await User.create({
      email,
      password,
      role: 'mitra'
    });

    // Buat data partner
    const partner = await Partner.create({
      user_id: user.id,
      nama_toko,
      alamat,
      no_telepon,
      kota,
      status: 'active'
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registrasi mitra berhasil',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        partner: {
          id: partner.id,
          nama_toko: partner.nama_toko,
          alamat: partner.alamat,
          no_telepon: partner.no_telepon,
          kota: partner.kota
        },
        token
      }
    });

  } catch (error) {
    console.error('Error registering mitra:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mendaftar',
      error: error.message
    });
  }
};

/**
 * Login (Admin & Mitra)
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ 
      where: { email },
      include: [
        {
          model: Partner,
          as: 'partner',
          required: false
        }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Check apakah akun aktif
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda tidak aktif. Hubungi admin.'
      });
    }

    // ✅ TAMBAH: Cek status partner jika role mitra
    if (user.role === 'mitra') {
      if (!user.partner) {
        return res.status(403).json({
          success: false,
          message: 'Data mitra tidak ditemukan. Hubungi admin.'
        });
      }

      if (user.partner.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Akun mitra Anda telah dinonaktifkan oleh admin. Hubungi admin untuk informasi lebih lanjut.'
        });
      }
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Response data
    const responseData = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      },
      token
    };

    // Tambah data partner jika role mitra
    if (user.role === 'mitra' && user.partner) {
      responseData.partner = {
        id: user.partner.id,
        nama_toko: user.partner.nama_toko,
        alamat: user.partner.alamat,
        no_telepon: user.partner.no_telepon,
        kota: user.partner.kota,
        status: user.partner.status
      };
    }

    res.json({
      success: true,
      message: 'Login berhasil',
      data: responseData
    });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal login',
      error: error.message
    });
  }
};

/**
 * Get User Profile
 * GET /api/auth/profile
 * Requires authentication
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'role', 'is_active', 'created_at'],
      include: [
        {
          model: Partner,
          as: 'partner',
          required: false
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data profile',
      error: error.message
    });
  }
};

/**
 * Update Profile (untuk mitra)
 * PUT /api/auth/profile
 * Requires authentication
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nama_toko, alamat, no_telepon, kota } = req.body;

    // Cari partner berdasarkan user_id
    const partner = await Partner.findOne({ where: { user_id: userId } });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Data partner tidak ditemukan'
      });
    }

    // ✅ BARU: Validasi nomor telepon jika diubah
    if (no_telepon && no_telepon !== partner.no_telepon) {
      const existingPhone = await Partner.findOne({ 
        where: { no_telepon },
        // Exclude partner saat ini
        // Note: Sequelize syntax bisa berbeda tergantung versi
      });
      
      if (existingPhone && existingPhone.id !== partner.id) {
        return res.status(400).json({
          success: false,
          message: 'Nomor telepon sudah digunakan oleh mitra lain'
        });
      }
    }

    // Update data partner
    await partner.update({
      nama_toko: nama_toko || partner.nama_toko,
      alamat: alamat || partner.alamat,
      no_telepon: no_telepon || partner.no_telepon,
      kota: kota || partner.kota
    });

    res.json({
      success: true,
      message: 'Profile berhasil diupdate',
      data: partner
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal update profile',
      error: error.message
    });
  }
};

/**
 * Change Password
 * PUT /api/auth/change-password
 * Requires authentication
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { old_password, new_password } = req.body;

    // Validasi input
    if (!old_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Password lama dan baru wajib diisi'
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password baru minimal 6 karakter'
      });
    }

    // Cari user
    const user = await User.findByPk(userId);

    // Verify password lama
    const isPasswordValid = await user.comparePassword(old_password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Password lama salah'
      });
    }

    // Update password
    await user.update({ password: new_password });

    res.json({
      success: true,
      message: 'Password berhasil diubah'
    });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengubah password',
      error: error.message
    });
  }
};