const { Order, Customer, Partner, OrderStatusHistory } = require('../models');

// Track order by tracking code (public, no auth required)
const trackOrder = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Kode tracking wajib diisi.'
      });
    }

    // Find order by tracking code
    const order = await Order.findOne({
      where: { kode_laundry: code.toUpperCase() },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['nama', 'no_wa']
        },
        {
          model: Partner,
          as: 'partner',
          attributes: ['nama_toko', 'alamat', 'no_telepon', 'kota']
        },
        {
          model: OrderStatusHistory,
          as: 'status_history',
          attributes: ['status', 'keterangan', 'created_at'],
          order: [['created_at', 'ASC']]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order dengan kode tracking ini tidak ditemukan.'
      });
    }

    // Format response
    const response = {
      kode_laundry: order.kode_laundry,
      status: order.status,
      jenis_layanan: order.jenis_layanan,
      berat: order.berat,
      jumlah_item: order.jumlah_item,
      total_harga: order.total_harga,
      status_pembayaran: order.status_pembayaran,
      tanggal_masuk: order.tanggal_masuk,
      estimasi_selesai: order.estimasi_selesai,
      tanggal_selesai: order.tanggal_selesai,
      customer: {
        nama: order.customer.nama,
        no_wa: order.customer.no_wa
      },
      partner: {
        nama_toko: order.partner.nama_toko,
        alamat: order.partner.alamat,
        no_telepon: order.partner.no_telepon,
        kota: order.partner.kota
      },
      riwayat_status: order.status_history.map(history => ({
        status: history.status,
        keterangan: history.keterangan,
        waktu: history.created_at
      }))
    };

    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Track order error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat melacak order.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  trackOrder
};