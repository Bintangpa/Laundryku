const HeroSection = require('../models/HeroSection');
const { ServicesSection, ServicesItem } = require('../models/ServicesSection');
const FooterSection = require('../models/FooterSection');

// ============================================
// HERO SECTION
// ============================================

exports.getHero = async (req, res) => {
  try {
    const hero = await HeroSection.findOne({ where: { id: 1 } });
    if (!hero) {
      return res.status(404).json({ success: false, message: 'Data hero tidak ditemukan.' });
    }
    return res.status(200).json({ success: true, data: hero });
  } catch (error) {
    console.error('Get hero error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data hero.', error: error.message });
  }
};

exports.updateHero = async (req, res) => {
  try {
    const hero = await HeroSection.findOne({ where: { id: 1 } });
    if (!hero) {
      return res.status(404).json({ success: false, message: 'Data hero tidak ditemukan.' });
    }
    const { badge_text, title, title_highlight, subtitle, placeholder_text, button_text, hint_text, tips_text } = req.body;
    await hero.update({ badge_text, title, title_highlight, subtitle, placeholder_text, button_text, hint_text, tips_text });
    return res.status(200).json({ success: true, message: 'Hero berhasil diupdate!', data: hero });
  } catch (error) {
    console.error('Update hero error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengupdate hero.', error: error.message });
  }
};

// ============================================
// SERVICES SECTION
// ============================================

exports.getServices = async (req, res) => {
  try {
    const section = await ServicesSection.findOne({
      where: { id: 1 },
      include: [{ model: ServicesItem, as: 'items', where: { is_active: 1 }, required: false, order: [['sort_order', 'ASC']] }]
    });
    if (!section) {
      return res.status(404).json({ success: false, message: 'Data services tidak ditemukan.' });
    }
    return res.status(200).json({ success: true, data: section });
  } catch (error) {
    console.error('Get services error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data services.', error: error.message });
  }
};

exports.updateServicesSection = async (req, res) => {
  try {
    const section = await ServicesSection.findOne({ where: { id: 1 } });
    if (!section) {
      return res.status(404).json({ success: false, message: 'Data services tidak ditemukan.' });
    }
    const { section_title, section_title_highlight, section_subtitle } = req.body;
    await section.update({ section_title, section_title_highlight, section_subtitle });
    return res.status(200).json({ success: true, message: 'Header services berhasil diupdate!', data: section });
  } catch (error) {
    console.error('Update services section error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengupdate services.', error: error.message });
  }
};

exports.addServiceItem = async (req, res) => {
  try {
    const { icon_name, title, duration, description, sort_order } = req.body;
    if (!icon_name || !title || !duration) {
      return res.status(400).json({ success: false, message: 'icon_name, title, dan duration wajib diisi.' });
    }
    const item = await ServicesItem.create({ section_id: 1, icon_name, title, duration, description, sort_order: sort_order || 0, is_active: 1 });
    return res.status(201).json({ success: true, message: 'Item berhasil ditambahkan!', data: item });
  } catch (error) {
    console.error('Add service item error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan item.', error: error.message });
  }
};

exports.updateServiceItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ServicesItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item tidak ditemukan.' });
    }
    const { icon_name, title, duration, description, sort_order, is_active } = req.body;
    await item.update({ icon_name, title, duration, description, sort_order, is_active });
    return res.status(200).json({ success: true, message: 'Item berhasil diupdate!', data: item });
  } catch (error) {
    console.error('Update service item error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengupdate item.', error: error.message });
  }
};

exports.deleteServiceItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ServicesItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item tidak ditemukan.' });
    }
    await item.destroy();
    return res.status(200).json({ success: true, message: 'Item berhasil dihapus!' });
  } catch (error) {
    console.error('Delete service item error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus item.', error: error.message });
  }
};

// ============================================
// FOOTER SECTION
// ============================================

exports.getFooter = async (req, res) => {
  try {
    const footer = await FooterSection.findOne({ where: { id: 1 } });
    if (!footer) {
      return res.status(404).json({ success: false, message: 'Data footer tidak ditemukan.' });
    }
    return res.status(200).json({ success: true, data: footer });
  } catch (error) {
    console.error('Get footer error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data footer.', error: error.message });
  }
};

exports.updateFooter = async (req, res) => {
  try {
    const footer = await FooterSection.findOne({ where: { id: 1 } });
    if (!footer) {
      return res.status(404).json({ success: false, message: 'Data footer tidak ditemukan.' });
    }
    const { brand_name, brand_description, phone, whatsapp, email, address, copyright_text } = req.body;
    await footer.update({ brand_name, brand_description, phone, whatsapp, email, address, copyright_text });
    return res.status(200).json({ success: true, message: 'Footer berhasil diupdate!', data: footer });
  } catch (error) {
    console.error('Update footer error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengupdate footer.', error: error.message });
  }
};