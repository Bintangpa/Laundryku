# 🚀 SETUP GUIDE - LaundryKu Backend

Panduan lengkap setup backend LaundryKu dari awal sampai running.

## 📋 Prerequisites

Pastikan sudah terinstall:
- ✅ Node.js (v14 atau lebih baru) - Download: https://nodejs.org
- ✅ MySQL (v8.0 atau lebih baru) - Download: https://dev.mysql.com/downloads/mysql/
- ✅ Git (optional) - Download: https://git-scm.com

## 🔧 Setup Step-by-Step

### STEP 1: Setup MySQL Database

1. **Buka MySQL Command Line atau MySQL Workbench**

2. **Login ke MySQL**
   ```bash
   mysql -u root -p
   # Enter your MySQL password
   ```

3. **Create Database**
   ```sql
   CREATE DATABASE laundryku_db;
   ```

4. **Verify Database Created**
   ```sql
   SHOW DATABASES;
   # You should see 'laundryku_db' in the list
   ```

5. **Exit MySQL**
   ```sql
   EXIT;
   ```

### STEP 2: Setup Backend Project

1. **Extract atau Navigate ke folder backend**
   ```bash
   cd laundryku-backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   
   Tunggu sampai semua package terinstall (bisa 2-5 menit tergantung koneksi internet)

3. **Setup Environment Variables**
   
   Copy file `.env.example` menjadi `.env`:
   ```bash
   # Windows
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

4. **Edit file `.env`**
   
   Buka file `.env` dengan text editor, lalu update sesuai konfigurasi MySQL lo:
   
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration - UPDATE INI!
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=laundryku_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here  # <-- Ganti dengan password MySQL lo
   
   # JWT Secret
   JWT_SECRET=laundryku_super_secret_2024_change_in_production
   JWT_EXPIRES_IN=7d
   
   # Frontend URL
   FRONTEND_URL=http://localhost:8080
   ```
   
   **PENTING**: Ganti `DB_PASSWORD` dengan password MySQL lo!

### STEP 3: Run Migration (Create Tables)

```bash
npm run migrate
```

**Expected Output:**
```
🔄 Starting database migration...
✅ Database connection successful
✅ All tables created successfully!

📋 Tables created:
   - users
   - partners
   - customers
   - orders
   - order_status_history
```

Kalau ada error, cek:
- ✅ MySQL service sudah running
- ✅ Database `laundryku_db` sudah dibuat
- ✅ Password di `.env` sudah benar

### STEP 4: Insert Dummy Data

```bash
npm run seed
```

**Expected Output:**
```
🌱 Starting database seeding...
🗑️  Existing data cleared
✅ Admin user created
✅ 3 Mitra users and partners created
✅ 5 Customers created
✅ 6 Orders created with status history

✅ Database seeding completed successfully!

📊 Summary:
   - 1 Admin user
   - 3 Mitra users with partners
   - 5 Customers
   - 6 Orders with various statuses

🔑 Login Credentials:
   Admin:
   - Email: admin@laundryku.com
   - Password: admin123

   Mitra 1 (Clean Bros Laundry):
   - Email: cleanbros@gmail.com
   - Password: mitra123

   ... (dan seterusnya)
```

### STEP 5: Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
=================================
🚀 LaundryKu API Server
=================================
📍 Server running on port 5000
🌍 Environment: development
🔗 API URL: http://localhost:5000
💾 Database: ✅ Connected
=================================
```

### STEP 6: Test API

Buka browser atau Postman, test endpoint berikut:

**Health Check:**
```
GET http://localhost:5000/
```

Response:
```json
{
  "success": true,
  "message": "LaundryKu API Server",
  "version": "1.0.0",
  "timestamp": "2024-xx-xx..."
}
```

**Database Health:**
```
GET http://localhost:5000/api/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "database": "Connected",
  "timestamp": "2024-xx-xx..."
}
```

## ✅ Setup Complete!

Backend sudah running di `http://localhost:5000`

### 🎯 What's Next?

Backend sudah siap untuk **FASE 2**: Backend API Development
- Authentication endpoints (login, register)
- CRUD endpoints untuk orders
- Tracking endpoint (public)
- Dashboard endpoints

## 🔑 Test Accounts

### Admin
- **Email**: admin@laundryku.com
- **Password**: admin123
- **Role**: admin

### Mitra Accounts

**Clean Bros Laundry**
- **Email**: cleanbros@gmail.com
- **Password**: mitra123
- **Toko**: Clean Bros Laundry, Depok

**Fresh Wash**
- **Email**: freshwash@gmail.com
- **Password**: mitra123
- **Toko**: Fresh Wash, Depok

**Spotless Laundry**
- **Email**: spotless@gmail.com
- **Password**: mitra123
- **Toko**: Spotless Laundry, Yogyakarta

## 📦 Sample Tracking Codes

Test tracking dengan kode ini:
- `LDR001` - Status: Diterima
- `LDR002` - Status: Sedang Dicuci
- `LDR003` - Status: Sedang Dikeringkan
- `LDR004` - Status: Sedang Disetrika
- `LDR005` - Status: Siap Diambil
- `LDR006` - Status: Selesai (sudah diambil)

## 🐛 Troubleshooting

### Error: Cannot connect to database

**Problem**: Database connection failed
```
❌ Unable to connect to the database: Access denied
```

**Solution**:
1. Pastikan MySQL service running
2. Cek password di `.env` file
3. Cek apakah database `laundryku_db` sudah dibuat

### Error: EADDRINUSE (Port sudah dipakai)

**Problem**: Port 5000 sudah digunakan aplikasi lain
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**:
1. Ganti PORT di `.env` menjadi 5001 atau 3000
2. Atau kill process yang pakai port 5000

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**Mac/Linux:**
```bash
lsof -ti:5000 | xargs kill -9
```

### Error: npm run migrate failed

**Problem**: Migration script error

**Solution**:
1. Cek apakah database `laundryku_db` sudah dibuat
2. Pastikan MySQL credentials di `.env` benar
3. Coba jalankan SQL schema manual:
   ```bash
   mysql -u root -p laundryku_db < database_schema.sql
   ```

### Error: Module not found

**Problem**: Dependencies belum terinstall

**Solution**:
```bash
rm -rf node_modules
npm install
```

## 📞 Need Help?

Kalau masih ada masalah, cek:
1. MySQL service status
2. File `.env` configuration
3. Node.js version (should be v14+)
4. Error logs di console

---

**✅ FASE 1 COMPLETE!**

Database structure & models sudah ready.
Next: FASE 2 - Build REST API endpoints! 🚀
