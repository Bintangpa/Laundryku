const { Order } = require('../models');

/**
 * Generate unique tracking code
 * Format: LND + YYYYMMDD + 4-digit random number
 * Example: LND20260205A1B2
 */
async function generateTrackingCode() {
  const prefix = 'LND';
  const date = new Date();
  
  // Format: YYYYMMDD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Generate random 4-character alphanumeric (uppercase)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < 4; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  const code = `${prefix}${dateStr}${randomStr}`;
  
  // Check if code already exists (very unlikely, but just in case)
  const existing = await Order.findOne({ where: { kode_laundry: code } });
  
  if (existing) {
    // Recursively generate new code if collision occurs
    return generateTrackingCode();
  }
  
  return code;
}

module.exports = { generateTrackingCode };