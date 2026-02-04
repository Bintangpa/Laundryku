const { Order, Customer, Partner, OrderStatusHistory } = require('../models');
const { generateTrackingCode } = require('../utils/generateTrackingCode');

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
      partner_id,
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
    if (!nama || !no_wa || !partner_id || !jenis_layanan || !total_harga) {
      return res.status(400).json({
        success: false,
        message: 'Data wajib: nama, no_wa, partner_id, jenis_layanan, total_harga'
      });
    }

    // Cek atau buat customer baru
    let customer = await Customer.findOne({ where: { no_wa } });
    
    if (!customer) {
      customer = await Customer.create({
        nama,
        no_wa,
        alamat
      });
    } else {
      // Update data customer jika ada perubahan
      await customer.update({ nama, alamat });
    }

    // Generate kode tracking otomatis
    const kode_laundry = await generateTrackingCode();

    // Buat order baru
    const order = await Order.create({
      kode_laundry,
      partner_id,
      customer_id: customer.id,
      jenis_layanan,
      berat,
      jumlah_item,
      catatan,
      total_harga,
      estimasi_selesai,
      metode_pembayaran,
      status_pembayaran,
      status: 'Diterima'
    });

    // Catat history status pertama
    await OrderStatusHistory.create({
      order_id: order.id,
      status: 'Diterima',
      keterangan: 'Order diterima oleh mitra',
      updated_by: req.user?.id || partner_id // Nanti dari auth
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
      data: {
        order: orderDetail,
        kode_laundry: kode_laundry
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat order',
      error: error.message
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
      error: error.message
    });
  }
};

/**
 * Update Status Order
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, keterangan, updated_by } = req.body;

    // Validasi
    const validStatus = [
      'Diterima',
      'Sedang Dicuci',
      'Sedang Dikeringkan',
      'Sedang Disetrika',
      'Siap Diambil',
      'Selesai'
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    // Update status order
    await order.update({ 
      status,
      tanggal_selesai: status === 'Selesai' ? new Date() : null
    });

    // Catat di history
    await OrderStatusHistory.create({
      order_id: orderId,
      status,
      keterangan,
      updated_by: updated_by || req.user?.id
    });

    // Fetch updated order
    const updatedOrder = await Order.findByPk(orderId, {
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
      error: error.message
    });
  }
};

/**
 * Get Orders by Partner
 */
exports.getOrdersByPartner = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { status, limit = 50, offset = 0 } = req.query;

    const whereClause = { partner_id: partnerId };
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
      error: error.message
    });
  }
};

/**
 * Get Order Details
 */
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
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

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail order',
      error: error.message
    });
  }
};