const { Partner, User } = require('../models');
const { Op } = require('sequelize');

// Get all partners (with city filter) - PUBLIC
const getAllPartners = async (req, res) => {
  try {
    const { kota, status, search } = req.query;

    const whereClause = {};

    if (kota) {
      whereClause.kota = kota;
    }

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.nama_toko = {
        [Op.like]: `%${search}%`
      };
    }

    const partners = await Partner.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'is_active']
      }],
      order: [['nama_toko', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      data: partners
    });
  } catch (error) {
    console.error('Get all partners error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data partners.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get partner by ID
const getPartnerById = async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'is_active']
      }]
    });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner tidak ditemukan.'
      });
    }

    return res.status(200).json({
      success: true,
      data: partner
    });
  } catch (error) {
    console.error('Get partner by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data partner.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get partners by city - PUBLIC
const getPartnersByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'Nama kota harus diisi.'
      });
    }

    // Normalize city name (case-insensitive search)
    const partners = await Partner.findAll({
      where: {
        kota: {
          [Op.like]: `%${city}%`
        },
        status: 'active' // Only show active partners
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'is_active']
      }],
      order: [['nama_toko', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      data: partners
    });
  } catch (error) {
    console.error('Get partners by city error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data partners.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get available cities (cities that have active partners) - PUBLIC
const getAvailableCities = async (req, res) => {
  try {
    // Get distinct cities from partners table where status is active
    const cities = await Partner.findAll({
      attributes: [
        [Partner.sequelize.fn('DISTINCT', Partner.sequelize.col('kota')), 'kota']
      ],
      where: {
        status: 'active',
        kota: {
          [Op.ne]: null, // Not null
          [Op.ne]: ''    // Not empty string
        }
      },
      raw: true
    });

    // Extract city names and format them
    const cityList = cities
      .map(c => c.kota)
      .filter(city => city && city.trim()) // Remove null/empty
      .sort(); // Sort alphabetically

    return res.status(200).json({
      success: true,
      data: cityList
    });
  } catch (error) {
    console.error('Get available cities error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data kota.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🆕 NEW: Get mitra's own profile - PROTECTED (for dashboard)
const getMyProfile = async (req, res) => {
  try {
    // req.user comes from authenticate middleware
    const partner = await Partner.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'is_active']
      }]
    });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Data mitra tidak ditemukan.'
      });
    }

    return res.status(200).json({
      success: true,
      data: partner
    });
  } catch (error) {
    console.error('Get my profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data profil.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create partner (admin only)
const createPartner = async (req, res) => {
  try {
    const {
      email,
      password,
      nama_toko,
      alamat,
      no_telepon,
      kota,
      maps_url // 🆕 Accept maps_url
    } = req.body;

    // Validation
    if (!email || !password || !nama_toko || !alamat || !no_telepon) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib: email, password, nama_toko, alamat, no_telepon'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar.'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role: 'mitra',
      is_active: true
    });

    // Create partner
    const partner = await Partner.create({
      user_id: user.id,
      nama_toko,
      alamat,
      no_telepon,
      kota: kota || null,
      maps_url: maps_url || null, // 🆕 Save maps_url
      status: 'active'
    });

    // Get full partner data
    const fullPartner = await Partner.findByPk(partner.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'is_active']
      }]
    });

    return res.status(201).json({
      success: true,
      message: 'Partner berhasil dibuat!',
      data: fullPartner
    });
  } catch (error) {
    console.error('Create partner error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat partner.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update partner
const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama_toko,
      alamat,
      no_telepon,
      kota,
      maps_url, // 🆕 Accept maps_url
      status
    } = req.body;

    const partner = await Partner.findByPk(id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner tidak ditemukan.'
      });
    }

    // Check if user has access (mitra can only update their own data)
    if (req.user.role === 'mitra') {
      const userPartner = await Partner.findOne({
        where: { user_id: req.user.id }
      });
      
      if (!userPartner || userPartner.id !== partner.id) {
        return res.status(403).json({
          success: false,
          message: 'Anda tidak memiliki akses untuk mengupdate partner ini.'
        });
      }
    }

    // Update partner
    await partner.update({
      nama_toko: nama_toko || partner.nama_toko,
      alamat: alamat || partner.alamat,
      no_telepon: no_telepon || partner.no_telepon,
      kota: kota !== undefined ? kota : partner.kota,
      maps_url: maps_url !== undefined ? maps_url : partner.maps_url, // 🆕 Update maps_url
      status: status || partner.status
    });

    // Get updated partner
    const updatedPartner = await Partner.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'is_active']
      }]
    });

    return res.status(200).json({
      success: true,
      message: 'Partner berhasil diupdate!',
      data: updatedPartner
    });
  } catch (error) {
    console.error('Update partner error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate partner.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🆕 NEW: Update own profile (for mitra dashboard) - PROTECTED
const updateMyProfile = async (req, res) => {
  try {
    const {
      nama_toko,
      alamat,
      no_telepon,
      kota,
      maps_url
    } = req.body;

    // Find partner by user_id
    const partner = await Partner.findOne({
      where: { user_id: req.user.id }
    });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Data mitra tidak ditemukan.'
      });
    }

    // Update only provided fields
    const updates = {};
    if (nama_toko !== undefined) updates.nama_toko = nama_toko;
    if (alamat !== undefined) updates.alamat = alamat;
    if (no_telepon !== undefined) updates.no_telepon = no_telepon;
    if (kota !== undefined) updates.kota = kota;
    if (maps_url !== undefined) updates.maps_url = maps_url;

    await partner.update(updates);

    // Get updated partner with user data
    const updatedPartner = await Partner.findByPk(partner.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'is_active']
      }]
    });

    return res.status(200).json({
      success: true,
      message: 'Profil berhasil diupdate!',
      data: updatedPartner
    });
  } catch (error) {
    console.error('Update my profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate profil.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete partner (admin only)
const deletePartner = async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findByPk(id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner tidak ditemukan.'
      });
    }

    // Delete associated user as well (cascade will handle partner deletion)
    await User.destroy({
      where: { id: partner.user_id }
    });

    return res.status(200).json({
      success: true,
      message: 'Partner berhasil dihapus!'
    });
  } catch (error) {
    console.error('Delete partner error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus partner.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllPartners,
  getPartnerById,
  getPartnersByCity,
  getAvailableCities,
  getMyProfile,        // 🆕 Export new function
  updateMyProfile,     // 🆕 Export new function
  createPartner,
  updatePartner,
  deletePartner
};