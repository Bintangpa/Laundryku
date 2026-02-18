const { Order, Customer, Partner, OrderStatusHistory } = require('../models');
const { generateTrackingCode } = require('../utils/generateTrackingCode');
const { Op } = require('sequelize');

/**
 * Create Order Baru
 * Mitra input data customer + order
 */
exports.createOrder = async (req, res) => {
  try {
    const {
      // Data Customer
      nama,
      no_wa,
      alamat,
      // Data Order
      jenis_layanan,
      berat,
      jumlah_item,
      catatan,
      total_harga,
      estimasi_selesai,
      metode_pembayaran,
      status_pembayaran
    } = req.body;

    // Validasi input
    if (!nama || !no_wa || !jenis_layanan || !total_harga) {
      return res.status(400).json({
        success: false,
        message: 'Data wajib: nama, no_wa, jenis_layanan, total_harga'
      });
    }

    // Get partner_id dari user yang login
    const partner = await Partner.findOne({ where: { user_id: req.user.id } });
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Data mitra tidak ditemukan'
      });
    }

    // Cek atau buat customer baru
    let customer = await Customer.findOne({ where: { no_wa } });
    
    if (!customer) {
      customer = await Customer.create({
        nama,
        no_wa,
        alamat: alamat || null
      });
    } else {
      // Update data customer jika ada perubahan
      await customer.update({ 
        nama, 
        alamat: alamat || customer.alamat 
      });
    }

    // Generate kode tracking otomatis
    const kode_laundry = await generateTrackingCode();

    // Buat order baru
    const order = await Order.create({
      kode_laundry,
      partner_id: partner.id,
      customer_id: customer.id,
      jenis_layanan,
      berat: berat || null,
      jumlah_item: jumlah_item || null,
      catatan: catatan || null,
      total_harga,
      estimasi_selesai: estimasi_selesai || null,
      metode_pembayaran: metode_pembayaran || null,
      status_pembayaran: status_pembayaran || 'Belum Lunas',
      status: 'Diterima',
      tanggal_masuk: new Date()
    });

    // Catat history status pertama
    await OrderStatusHistory.create({
      order_id: order.id,
      status: 'Diterima',
      keterangan: 'Order diterima oleh mitra',
      updated_by: req.user.id
    });

    // Fetch order lengkap dengan relasi
    const orderDetail = await Order.findByPk(order.id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: Partner, as: 'partner' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order berhasil dibuat',
      data: orderDetail
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get All Orders (untuk mitra yang login)
 */
exports.getAllOrders = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    // Get partner_id dari user yang login
    const partner = await Partner.findOne({ where: { user_id: req.user.id } });
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Data mitra tidak ditemukan'
      });
    }

    const whereClause = { partner_id: partner.id };
    if (status) {
      whereClause.status = status;
    }

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [
        { model: Customer, as: 'customer' }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: orders.rows,
      total: orders.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get ALL Orders - Admin Only
 * Bisa lihat semua order dari semua mitra
 */
exports.getAllOrdersAdmin = async (req, res) => {
  try {
    const { status, status_pembayaran, search, limit = 200, offset = 0 } = req.query;

    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (status_pembayaran) {
      whereClause.status_pembayaran = status_pembayaran;
    }

    if (search) {
      whereClause[Op.or] = [
        { kode_laundry: { [Op.like]: `%${search}%` } }
      ];
    }

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['nama', 'no_wa', 'alamat']
        },
        {
          model: Partner,
          as: 'partner',
          attributes: ['nama_toko', 'no_telepon', 'kota', 'alamat']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: orders.rows,
      total: orders.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Error fetching all orders (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get Order By ID
 */
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: Partner, as: 'partner' },
        { 
          model: OrderStatusHistory, 
          as: 'status_history',
          order: [['created_at', 'ASC']]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    // Verify ownership (mitra hanya bisa lihat order mereka sendiri)
    const partner = await Partner.findOne({ where: { user_id: req.user.id } });
    if (partner && order.partner_id !== partner.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke order ini'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update Order Status
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, keterangan } = req.body;

    const validStatus = [
      'Diterima',
      'Sedang Dicuci',
      'Sedang Dikeringkan',
      'Sedang Disetrika',
      'Siap Diambil',
      'Telah Diambil'
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    // Verify ownership
    const partner = await Partner.findOne({ where: { user_id: req.user.id } });
    if (partner && order.partner_id !== partner.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke order ini'
      });
    }

    await order.update({ 
      status,
      tanggal_selesai: status === 'Telah Diambil' ? new Date() : order.tanggal_selesai
    });

    const existingHistory = await OrderStatusHistory.findOne({
      where: { order_id: id }
    });

    if (existingHistory) {
      await existingHistory.update({
        status,
        keterangan: keterangan || `Status diubah menjadi ${status}`,
        updated_by: req.user.id,
        updated_at: new Date()
      });
    } else {
      await OrderStatusHistory.create({
        order_id: id,
        status,
        keterangan: keterangan || `Status diubah menjadi ${status}`,
        updated_by: req.user.id
      });
    }

    const updatedOrder = await Order.findByPk(id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: Partner, as: 'partner' },
        { model: OrderStatusHistory, as: 'status_history' }
      ]
    });

    res.json({
      success: true,
      message: 'Status order berhasil diupdate',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal update status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update Order (edit data order)
 */
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    // Verify ownership
    const partner = await Partner.findOne({ where: { user_id: req.user.id } });
    if (partner && order.partner_id !== partner.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke order ini'
      });
    }

    await order.update(updateData);

    const updatedOrder = await Order.findByPk(id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: Partner, as: 'partner' }
      ]
    });

    res.json({
      success: true,
      message: 'Order berhasil diupdate',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal update order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete Order
 */
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    // Verify ownership
    const partner = await Partner.findOne({ where: { user_id: req.user.id } });
    if (partner && order.partner_id !== partner.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke order ini'
      });
    }

    await OrderStatusHistory.destroy({ where: { order_id: id } });
    await order.destroy();

    res.json({
      success: true,
      message: 'Order berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Track Order (Public - untuk customer)
 */
exports.trackOrder = async (req, res) => {
  try {
    const { kode } = req.params;

    const order = await Order.findOne({
      where: { kode_laundry: kode },
      include: [
        { 
          model: Customer, 
          as: 'customer',
          attributes: ['nama', 'no_wa']
        },
        { 
          model: Partner, 
          as: 'partner',
          attributes: ['nama_toko', 'no_telepon', 'alamat']
        },
        {
          model: OrderStatusHistory,
          as: 'status_history',
          order: [['created_at', 'ASC']]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Kode laundry tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal melacak order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get Dashboard Stats (untuk mitra yang login)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const partner = await Partner.findOne({ where: { user_id: req.user.id } });
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Data mitra tidak ditemukan'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.count({
      where: {
        partner_id: partner.id,
        tanggal_masuk: { [Op.gte]: today }
      }
    });

    const activeOrders = await Order.count({
      where: {
        partner_id: partner.id,
        status: { [Op.ne]: 'Telah Diambil' }
      }
    });

    const readyOrders = await Order.count({
      where: {
        partner_id: partner.id,
        status: 'Siap Diambil'
      }
    });

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyRevenue = await Order.sum('total_harga', {
      where: {
        partner_id: partner.id,
        status_pembayaran: 'Lunas',
        tanggal_masuk: { [Op.gte]: startOfMonth }
      }
    });

    const recentOrders = await Order.findAll({
      where: { partner_id: partner.id },
      include: [{ model: Customer, as: 'customer' }],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      data: {
        today_orders: todayOrders,
        active_orders: activeOrders,
        ready_orders: readyOrders,
        monthly_revenue: monthlyRevenue || 0,
        recent_orders: recentOrders
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data statistik',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Legacy compatibility exports
exports.getOrdersByPartner = exports.getAllOrders;
exports.getOrderDetails = exports.getOrderById;