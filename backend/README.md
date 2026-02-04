# LaundryKu Backend API

Backend API untuk sistem tracking laundry LaundryKu dengan role Admin dan Mitra.

## 🚀 Tech Stack

- **Node.js** & **Express.js** - Backend framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
laundryku-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── database/
│   │   ├── connection.js        # Sequelize connection
│   │   ├── migrate.js           # Migration script
│   │   └── seed.js              # Seed data script
│   ├── models/
│   │   ├── User.js              # User model (admin & mitra)
│   │   ├── Partner.js           # Partner (laundry shop) model
│   │   ├── Customer.js          # Customer model
│   │   ├── Order.js             # Order model
│   │   ├── OrderStatusHistory.js # Status tracking model
│   │   └── index.js             # Model relationships
│   └── server.js                # Main server file
├── .env.example                 # Environment variables template
└── package.json
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and update with your configuration:

```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=laundryku_db
DB_USER=root
DB_PASSWORD=your_password_here

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:8080
```

### 3. Create MySQL Database

```sql
CREATE DATABASE laundryku_db;
```

### 4. Run Migration (Create Tables)

```bash
npm run migrate
```

This will create the following tables:
- `users` - Admin and Mitra authentication
- `partners` - Laundry shop details
- `customers` - Customer data
- `orders` - Laundry orders/transactions
- `order_status_history` - Status tracking history

### 5. Run Seeder (Insert Dummy Data)

```bash
npm run seed
```

This will insert:
- 1 Admin account
- 3 Mitra accounts with partner shops
- 5 Customers
- 6 Sample orders with various statuses

### 6. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 🔑 Default Login Credentials

### Admin
- **Email**: admin@laundryku.com
- **Password**: admin123

### Mitra 1 (Clean Bros Laundry)
- **Email**: cleanbros@gmail.com
- **Password**: mitra123

### Mitra 2 (Fresh Wash)
- **Email**: freshwash@gmail.com
- **Password**: mitra123

### Mitra 3 (Spotless Laundry)
- **Email**: spotless@gmail.com
- **Password**: mitra123

## 📦 Sample Tracking Codes

Test the tracking feature with these codes:
- `LDR001` - Status: Diterima
- `LDR002` - Status: Sedang Dicuci
- `LDR003` - Status: Sedang Dikeringkan
- `LDR004` - Status: Sedang Disetrika
- `LDR005` - Status: Siap Diambil
- `LDR006` - Status: Selesai

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique, for login
- `password` - Hashed password
- `role` - ENUM('admin', 'mitra')
- `is_active` - Boolean

### Partners Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `nama_toko` - Shop name
- `alamat` - Address
- `no_telepon` - Phone number
- `kota` - City
- `status` - ENUM('active', 'inactive')

### Customers Table
- `id` - Primary key
- `nama` - Customer name
- `no_wa` - WhatsApp number
- `alamat` - Address (optional)

### Orders Table
- `id` - Primary key
- `kode_laundry` - Unique tracking code (LDR001, LDR002, etc.)
- `partner_id` - Foreign key to partners
- `customer_id` - Foreign key to customers
- `jenis_layanan` - Service type
- `berat` - Weight (for kiloan)
- `jumlah_item` - Item count (for satuan)
- `catatan` - Notes
- `total_harga` - Total price
- `status` - Current status
- `tanggal_masuk` - Entry date
- `estimasi_selesai` - Estimated completion
- `tanggal_selesai` - Actual completion
- `metode_pembayaran` - Payment method
- `status_pembayaran` - Payment status

### Order Status History Table
- `id` - Primary key
- `order_id` - Foreign key to orders
- `status` - Status value
- `keterangan` - Notes/description
- `updated_by` - User who updated (mitra or admin)
- `created_at` - Timestamp

## 🎯 Status Flow

```
Diterima → Sedang Dicuci → Sedang Dikeringkan → Sedang Disetrika → Siap Diambil → Selesai
```

## 📋 Service Types (Jenis Layanan)

1. **Laundry Kiloan** - 2-3 Hari
   - Cuci, keringkan, dan lipat rapi per kilogram

2. **Laundry Satuan** - 3-5 Hari
   - Perawatan khusus untuk setiap item pakaian

3. **Express 6 Jam** - 6 Jam
   - Layanan kilat untuk kebutuhan mendesak

4. **Dry Cleaning** - 3-4 Hari
   - Pembersihan khusus tanpa air untuk bahan sensitif

5. **Setrika Saja** - 1 Hari
   - Layanan setrika profesional dengan hasil rapi

6. **Deep Clean** - 4-5 Hari
   - Pembersihan mendalam untuk noda membandel

## 🔄 API Endpoints (Coming in Phase 2)

```
Authentication:
POST   /api/auth/login
POST   /api/auth/register

Orders:
GET    /api/orders              # Get all orders (with filters)
GET    /api/orders/:id          # Get order detail
POST   /api/orders              # Create new order
PUT    /api/orders/:id          # Update order
DELETE /api/orders/:id          # Delete order
PATCH  /api/orders/:id/status   # Update order status

Tracking (Public):
GET    /api/tracking/:code      # Track order by code

Partners:
GET    /api/partners            # Get all partners
GET    /api/partners/:id        # Get partner detail
POST   /api/partners            # Create partner
PUT    /api/partners/:id        # Update partner
DELETE /api/partners/:id        # Delete partner

Dashboard:
GET    /api/dashboard/admin     # Admin dashboard stats
GET    /api/dashboard/mitra     # Mitra dashboard stats
```

## ⚡ Next Steps (Phase 2)

1. ✅ Authentication system (JWT)
2. ✅ CRUD API endpoints
3. ✅ Authorization middleware
4. ✅ Input validation
5. ✅ Error handling
6. ✅ Auto-generate tracking code

## 📝 Notes

- All passwords are hashed using bcrypt
- JWT tokens expire in 7 days (configurable)
- Database uses snake_case for column names
- Timestamps are automatically managed by Sequelize
- Tracking codes are auto-generated (LDR + sequential number)

## 🐛 Troubleshooting

### Database Connection Error
```bash
Error: ER_ACCESS_DENIED_ERROR
```
**Solution**: Check your MySQL credentials in `.env` file

### Migration Failed
```bash
Error: Unknown database
```
**Solution**: Create the database first using `CREATE DATABASE laundryku_db;`

### Port Already in Use
```bash
Error: EADDRINUSE
```
**Solution**: Change PORT in `.env` file or kill the process using the port

## 📧 Support

For issues or questions, please contact the development team.

---

**Status**: ✅ Phase 1 Complete - Database & Models Ready
**Next**: Phase 2 - Backend API Development
