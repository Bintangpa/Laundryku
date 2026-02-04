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

// Create partner (admin only)
const createPartner = async (req, res) => {
  try {
    const {
      email,
      password,
      nama_toko,
      alamat,
      no_telepon,
      kota
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
  createPartner,
  updatePartner,
  deletePartner
};