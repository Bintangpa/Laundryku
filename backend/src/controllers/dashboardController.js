const { Order, Partner, Customer, User } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../database/connection');

// Admin dashboard stats
const getAdminStats = async (req, res) => {
  try {
    // Total orders
    const totalOrders = await Order.count();

    // Total revenue
    const revenueResult = await Order.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_harga')), 'total_revenue']
      ],
      where: {
        status_pembayaran: 'Lunas'
      }
    });
    const totalRevenue = revenueResult.dataValues.total_revenue || 0;

    // Total partners
    const totalPartners = await Partner.count({
      where: { status: 'active' }
    });

    // Total customers
    const totalCustomers = await Customer.count();

    // Orders by status
    const ordersByStatus = await Order.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const statusCounts = {};
    ordersByStatus.forEach(item => {
      statusCounts[item.status] = parseInt(item.dataValues.count);
    });

    // Recent orders (last 10)
    const recentOrders = await Order.findAll({
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['nama', 'no_wa']
        },
        {
          model: Partner,
          as: 'partner',
          attributes: ['nama_toko']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 10
    });

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueByMonth = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('tanggal_masuk'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('total_harga')), 'revenue']
      ],
      where: {
        tanggal_masuk: {
          [Op.gte]: sixMonthsAgo
        },
        status_pembayaran: 'Lunas'
      },
      group: ['month'],
      order: [[sequelize.literal('month'), 'ASC']]
    });

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          total_orders: totalOrders,
          total_revenue: parseFloat(totalRevenue),
          total_partners: totalPartners,
          total_customers: totalCustomers
        },
        orders_by_status: statusCounts,
        recent_orders: recentOrders,
        revenue_by_month: revenueByMonth.map(item => ({
          month: item.dataValues.month,
          revenue: parseFloat(item.dataValues.revenue || 0)
        }))
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil statistik admin.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Mitra dashboard stats
const getMitraStats = async (req, res) => {
  try {
    // Get partner_id from authenticated user
    const partner = await Partner.findOne({
      where: { user_id: req.user.id }
    });

    if (!partner) {
      return res.status(400).json({
        success: false,
        message: 'User tidak memiliki data partner.'
      });
    }

    // Total orders for this partner
    const totalOrders = await Order.count({
      where: { partner_id: partner.id }
    });

    // Total revenue for this partner
    const revenueResult = await Order.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_harga')), 'total_revenue']
      ],
      where: {
        partner_id: partner.id,
        status_pembayaran: 'Lunas'
      }
    });
    const totalRevenue = revenueResult.dataValues.total_revenue || 0;

    // Pending revenue (Belum Lunas)
    const pendingRevenueResult = await Order.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_harga')), 'pending_revenue']
      ],
      where: {
        partner_id: partner.id,
        status_pembayaran: 'Belum Lunas'
      }
    });
    const pendingRevenue = pendingRevenueResult.dataValues.pending_revenue || 0;

    // Orders by status for this partner
    const ordersByStatus = await Order.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { partner_id: partner.id },
      group: ['status']
    });

    const statusCounts = {};
    ordersByStatus.forEach(item => {
      statusCounts[item.status] = parseInt(item.dataValues.count);
    });

    // Recent orders (last 10)
    const recentOrders = await Order.findAll({
      where: { partner_id: partner.id },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['nama', 'no_wa']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 10
    });

    // Orders today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const ordersToday = await Order.count({
      where: {
        partner_id: partner.id,
        tanggal_masuk: {
          [Op.gte]: today
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          total_orders: totalOrders,
          total_revenue: parseFloat(totalRevenue),
          pending_revenue: parseFloat(pendingRevenue),
          orders_today: ordersToday
        },
        orders_by_status: statusCounts,
        recent_orders: recentOrders
      }
    });
  } catch (error) {
    console.error('Get mitra stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil statistik mitra.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAdminStats,
  getMitraStats
};