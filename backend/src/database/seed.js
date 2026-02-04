require('dotenv').config();
const { sequelize } = require('./connection');
const { User, Partner, Customer, Order, OrderStatusHistory } = require('../models');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    await OrderStatusHistory.destroy({ where: {}, force: true });
    await Order.destroy({ where: {}, force: true });
    await Customer.destroy({ where: {}, force: true });
    await Partner.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
    
    console.log('🗑️  Existing data cleared');
    
    // 1. Create Admin User
    const admin = await User.create({
      email: 'admin@laundryku.com',
      password: 'admin123',
      role: 'admin',
      is_active: true
    });
    console.log('✅ Admin user created');
    
    // 2. Create Mitra Users & Partners
    const mitra1User = await User.create({
      email: 'cleanbros@gmail.com',
      password: 'mitra123',
      role: 'mitra',
      is_active: true
    });
    
    const mitra1 = await Partner.create({
      user_id: mitra1User.id,
      nama_toko: 'Clean Bros Laundry',
      alamat: 'Jl. Sudirman No. 123, Depok',
      no_telepon: '081234567890',
      kota: 'Depok',
      status: 'active'
    });
    
    const mitra2User = await User.create({
      email: 'freshwash@gmail.com',
      password: 'mitra123',
      role: 'mitra',
      is_active: true
    });
    
    const mitra2 = await Partner.create({
      user_id: mitra2User.id,
      nama_toko: 'Fresh Wash',
      alamat: 'Jl. Margonda Raya No. 45, Depok',
      no_telepon: '081234567891',
      kota: 'Depok',
      status: 'active'
    });
    
    const mitra3User = await User.create({
      email: 'spotless@gmail.com',
      password: 'mitra123',
      role: 'mitra',
      is_active: true
    });
    
    const mitra3 = await Partner.create({
      user_id: mitra3User.id,
      nama_toko: 'Spotless Laundry',
      alamat: 'Jl. Juanda No. 78, Yogyakarta',
      no_telepon: '081234567892',
      kota: 'Yogyakarta',
      status: 'active'
    });
    
    console.log('✅ 3 Mitra users and partners created');
    
    // 3. Create Customers
    const customers = await Customer.bulkCreate([
      {
        nama: 'Budi Santoso',
        no_wa: '081234567001',
        alamat: 'Jl. Raya Margonda No. 10, Depok'
      },
      {
        nama: 'Siti Nurhaliza',
        no_wa: '081234567002',
        alamat: 'Jl. Proklamasi No. 5, Depok'
      },
      {
        nama: 'Ahmad Dhani',
        no_wa: '081234567003',
        alamat: 'Jl. Pemuda No. 20, Yogyakarta'
      },
      {
        nama: 'Dewi Lestari',
        no_wa: '081234567004',
        alamat: 'Jl. Kenari No. 15, Depok'
      },
      {
        nama: 'Rudi Tabuti',
        no_wa: '081234567005',
        alamat: 'Jl. Cendana No. 8, Yogyakarta'
      }
    ]);
    
    console.log('✅ 5 Customers created');
    
    // 4. Create Orders with different statuses
    const getEstimasiSelesai = (days) => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date;
    };
    
    // Helper function to generate kode laundry
    let orderCounter = 1;
    const generateKodeLaundry = () => {
      return `LDR${String(orderCounter++).padStart(3, '0')}`;
    };
    
    // Order 1 - Diterima
    const order1 = await Order.create({
      kode_laundry: generateKodeLaundry(),
      partner_id: mitra1.id,
      customer_id: customers[0].id,
      jenis_layanan: 'Laundry Kiloan',
      berat: 3.5,
      catatan: 'Pisahkan pakaian putih dan berwarna',
      total_harga: 35000,
      status: 'Diterima',
      tanggal_masuk: new Date(),
      estimasi_selesai: getEstimasiSelesai(2),
      metode_pembayaran: 'Cash',
      status_pembayaran: 'Belum Lunas'
    });
    
    await OrderStatusHistory.create({
      order_id: order1.id,
      status: 'Diterima',
      keterangan: 'Order diterima dari customer',
      updated_by: mitra1User.id
    });
    
    // Order 2 - Sedang Dicuci
    const order2 = await Order.create({
      kode_laundry: generateKodeLaundry(),
      partner_id: mitra1.id,
      customer_id: customers[1].id,
      jenis_layanan: 'Express 6 Jam',
      berat: 2.0,
      catatan: null,
      total_harga: 50000,
      status: 'Sedang Dicuci',
      tanggal_masuk: new Date(Date.now() - 3600000), // 1 hour ago
      estimasi_selesai: getEstimasiSelesai(0),
      metode_pembayaran: 'Transfer',
      status_pembayaran: 'Lunas'
    });
    
    await OrderStatusHistory.bulkCreate([
      {
        order_id: order2.id,
        status: 'Diterima',
        keterangan: 'Order diterima dari customer',
        updated_by: mitra1User.id,
        created_at: new Date(Date.now() - 3600000)
      },
      {
        order_id: order2.id,
        status: 'Sedang Dicuci',
        keterangan: 'Proses pencucian dimulai',
        updated_by: mitra1User.id,
        created_at: new Date(Date.now() - 1800000)
      }
    ]);
    
    // Order 3 - Sedang Dikeringkan
    const order3 = await Order.create({
      kode_laundry: generateKodeLaundry(),
      partner_id: mitra2.id,
      customer_id: customers[2].id,
      jenis_layanan: 'Laundry Satuan',
      jumlah_item: 5,
      catatan: 'Kemeja kantor',
      total_harga: 75000,
      status: 'Sedang Dikeringkan',
      tanggal_masuk: new Date(Date.now() - 86400000), // 1 day ago
      estimasi_selesai: getEstimasiSelesai(2),
      metode_pembayaran: 'QRIS',
      status_pembayaran: 'Lunas'
    });
    
    await OrderStatusHistory.bulkCreate([
      {
        order_id: order3.id,
        status: 'Diterima',
        updated_by: mitra2User.id,
        created_at: new Date(Date.now() - 86400000)
      },
      {
        order_id: order3.id,
        status: 'Sedang Dicuci',
        updated_by: mitra2User.id,
        created_at: new Date(Date.now() - 72000000)
      },
      {
        order_id: order3.id,
        status: 'Sedang Dikeringkan',
        updated_by: mitra2User.id,
        created_at: new Date(Date.now() - 43200000)
      }
    ]);
    
    // Order 4 - Sedang Disetrika
    const order4 = await Order.create({
      kode_laundry: generateKodeLaundry(),
      partner_id: mitra2.id,
      customer_id: customers[3].id,
      jenis_layanan: 'Setrika Saja',
      berat: 2.5,
      catatan: null,
      total_harga: 15000,
      status: 'Sedang Disetrika',
      tanggal_masuk: new Date(Date.now() - 172800000), // 2 days ago
      estimasi_selesai: getEstimasiSelesai(0),
      metode_pembayaran: 'Cash',
      status_pembayaran: 'Belum Lunas'
    });
    
    await OrderStatusHistory.bulkCreate([
      {
        order_id: order4.id,
        status: 'Diterima',
        updated_by: mitra2User.id,
        created_at: new Date(Date.now() - 172800000)
      },
      {
        order_id: order4.id,
        status: 'Sedang Disetrika',
        updated_by: mitra2User.id,
        created_at: new Date(Date.now() - 86400000)
      }
    ]);
    
    // Order 5 - Siap Diambil
    const order5 = await Order.create({
      kode_laundry: generateKodeLaundry(),
      partner_id: mitra3.id,
      customer_id: customers[4].id,
      jenis_layanan: 'Dry Cleaning',
      jumlah_item: 2,
      catatan: 'Jas dan blazer',
      total_harga: 120000,
      status: 'Siap Diambil',
      tanggal_masuk: new Date(Date.now() - 259200000), // 3 days ago
      estimasi_selesai: new Date(Date.now() - 86400000),
      metode_pembayaran: 'Transfer',
      status_pembayaran: 'Lunas'
    });
    
    await OrderStatusHistory.bulkCreate([
      {
        order_id: order5.id,
        status: 'Diterima',
        updated_by: mitra3User.id,
        created_at: new Date(Date.now() - 259200000)
      },
      {
        order_id: order5.id,
        status: 'Sedang Dicuci',
        updated_by: mitra3User.id,
        created_at: new Date(Date.now() - 216000000)
      },
      {
        order_id: order5.id,
        status: 'Sedang Dikeringkan',
        updated_by: mitra3User.id,
        created_at: new Date(Date.now() - 172800000)
      },
      {
        order_id: order5.id,
        status: 'Sedang Disetrika',
        updated_by: mitra3User.id,
        created_at: new Date(Date.now() - 129600000)
      },
      {
        order_id: order5.id,
        status: 'Siap Diambil',
        keterangan: 'Cucian sudah selesai, silakan diambil',
        updated_by: mitra3User.id,
        created_at: new Date(Date.now() - 86400000)
      }
    ]);
    
    // Order 6 - Selesai
    const order6 = await Order.create({
      kode_laundry: generateKodeLaundry(),
      partner_id: mitra3.id,
      customer_id: customers[0].id,
      jenis_layanan: 'Deep Clean',
      jumlah_item: 1,
      catatan: 'Karpet besar',
      total_harga: 200000,
      status: 'Selesai',
      tanggal_masuk: new Date(Date.now() - 432000000), // 5 days ago
      estimasi_selesai: new Date(Date.now() - 86400000),
      tanggal_selesai: new Date(Date.now() - 43200000),
      metode_pembayaran: 'Cash',
      status_pembayaran: 'Lunas'
    });
    
    await OrderStatusHistory.bulkCreate([
      {
        order_id: order6.id,
        status: 'Diterima',
        updated_by: mitra3User.id,
        created_at: new Date(Date.now() - 432000000)
      },
      {
        order_id: order6.id,
        status: 'Sedang Dicuci',
        updated_by: mitra3User.id,
        created_at: new Date(Date.now() - 345600000)
      },
      {
        order_id: order6.id,
        status: 'Sedang Dikeringkan',
        updated_by: mitra3User.id,
        created_at: new Date(Date.now() - 259200000)
      },
      {
        order_id: order6.id,
        status: 'Sedang Disetrika',
        updated_by: mitra3User.id,
        created_at: new Date(Date.now() - 172800000)
      },
      {
        order_id: order6.id,
        status: 'Siap Diambil',
        updated_by: mitra3User.id,
        created_at: new Date(Date.now() - 86400000)
      },
      {
        order_id: order6.id,
        status: 'Selesai',
        keterangan: 'Order telah diambil customer',
        updated_by: mitra3User.id,
        created_at: new Date(Date.now() - 43200000)
      }
    ]);
    
    console.log('✅ 6 Orders created with status history');
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - 1 Admin user');
    console.log('   - 3 Mitra users with partners');
    console.log('   - 5 Customers');
    console.log('   - 6 Orders with various statuses');
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin:');
    console.log('   - Email: admin@laundryku.com');
    console.log('   - Password: admin123');
    console.log('\n   Mitra 1 (Clean Bros Laundry):');
    console.log('   - Email: cleanbros@gmail.com');
    console.log('   - Password: mitra123');
    console.log('\n   Mitra 2 (Fresh Wash):');
    console.log('   - Email: freshwash@gmail.com');
    console.log('   - Password: mitra123');
    console.log('\n   Mitra 3 (Spotless Laundry):');
    console.log('   - Email: spotless@gmail.com');
    console.log('   - Password: mitra123');
    console.log('\n📦 Sample Tracking Codes:');
    console.log('   - LDR001, LDR002, LDR003, LDR004, LDR005, LDR006');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding
seedData();
