const { sequelize } = require('../database/connection');
const { QueryTypes } = require('sequelize');

/**
 * GET semua harga layanan
 * GET /api/pricing
 * Public
 */
exports.getAllPricing = async (req, res) => {
  try {
    const rows = await sequelize.query(
      'SELECT * FROM service_pricing ORDER BY id ASC',
      { type: QueryTypes.SELECT }
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data harga', error: error.message });
  }
};

/**
 * UPDATE harga layanan by ID
 * PUT /api/pricing/:id
 * Admin only
 */
exports.updatePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { price_per_unit } = req.body;

    if (price_per_unit === undefined || price_per_unit === null) {
      return res.status(400).json({ success: false, message: 'Harga wajib diisi' });
    }

    const price = parseFloat(price_per_unit);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({ success: false, message: 'Harga tidak valid' });
    }

    const [affectedRows] = await sequelize.query(
      'UPDATE service_pricing SET price_per_unit = :price, updated_at = NOW() WHERE id = :id',
      { replacements: { price, id }, type: QueryTypes.UPDATE }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan' });
    }

    const [updated] = await sequelize.query(
      'SELECT * FROM service_pricing WHERE id = :id',
      { replacements: { id }, type: QueryTypes.SELECT }
    );

    res.json({ success: true, message: 'Harga berhasil diperbarui', data: updated });
  } catch (error) {
    console.error('Error updating pricing:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui harga', error: error.message });
  }
};

/**
 * GET harga by service_key
 * GET /api/pricing/key/:service_key
 * Public
 */
exports.getPricingByKey = async (req, res) => {
  try {
    const { service_key } = req.params;

    const rows = await sequelize.query(
      'SELECT * FROM service_pricing WHERE service_key = :service_key',
      { replacements: { service_key }, type: QueryTypes.SELECT }
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching pricing by key:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data harga', error: error.message });
  }
};

module.exports = {
  getAllPricing: exports.getAllPricing,
  updatePricing: exports.updatePricing,
  getPricingByKey: exports.getPricingByKey
};