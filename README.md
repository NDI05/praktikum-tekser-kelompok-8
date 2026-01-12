# 🍜 SIKP Burjo Point8 - Sistem Informasi Kasir & Penjualan

**Kelompok 8** - Praktikum Teknologi Server  

Sistem point-of-sale (POS) untuk Warung Oyako dengan fitur manajemen menu, transaksi, pelanggan, karyawan, dan laporan penjualan.

---

## 📂 Struktur Project

```
├── backend/           # Backend API (Express.js + Prisma)
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth middleware
│   │   └── utils/         # Helper functions
│   ├── prisma/           # Database schema & migrations
│   ├── uploads/          # File uploads (menu images)
│   └── Dockerfile
│
├── frontend/          # Frontend (React + Vite + TailwindCSS)
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   └── context/      # React context
│   └── Dockerfile
│
├── database/          # Database initialization
│   └── init.sql          # SQL schema & seed data
│
├── nginx/             # Reverse proxy configuration
│   └── default.conf      # Nginx proxy config
│
├── docker-compose.yml  # Docker orchestration
├── .env               # Environment variables
└── dokumen/           # Project documentation
```

---

## 🚀 Quick Start (Docker)

### Prerequisites
- Docker & Docker Compose installed
- Port 8081 available (atau sesuaikan di `.env`)

### 1. Clone & Setup Environment
```bash
git clone <repository-url>
cd praktikum-tekser-template

# Edit .env sesuai kebutuhan (GROUP_NAME, APP_PORT)
nano .env
```

### 2. Jalankan dengan Docker
```bash
# Build dan jalankan semua services
docker compose up --build

# Atau jalankan di background
docker compose up --build -d
```

### 3. Akses Aplikasi
- **Web App:** http://localhost:8081
- **API Backend:** http://localhost:8081/api

### 4. Login Test
| Role | Username | Password |
|------|----------|----------|
| Owner | `owner` | `owner123` |
| Karyawan | `kasir1` | `kasir123` |

---

## 🏗️ Arsitektur Docker

```
┌──────────────────────────────────────────────────────────────────┐
│                         DOCKER NETWORK                           │
└──────────────────────────────────────────────────────────────────┘

    Browser (User)
         │
         ▼ Port 8081
    ┌─────────────┐
    │   NGINX     │ ──────────────────────────────────┐
    │  (Port 80)  │                                   │
    └─────────────┘                                   │
         │ /                                          │ /api
         ▼                                            ▼
    ┌─────────────┐                            ┌─────────────┐
    │  FRONTEND   │                            │   BACKEND   │
    │  (Vite)     │                            │  (Express)  │
    │  Port 5173  │                            │  Port 3000  │
    └─────────────┘                            └─────────────┘
                                                      │
                                                      ▼ Prisma ORM
                                               ┌─────────────┐
                                               │   MySQL     │
                                               │  Port 3306  │
                                               └─────────────┘
```

---

## 📋 Fitur Aplikasi (CRUD)

| Operasi | Deskripsi |
|---------|-----------|
| **Create** | Tambah menu, registrasi pelanggan, buat transaksi, tambah karyawan |
| **Read** | Lihat daftar menu, list pelanggan, riwayat transaksi, laporan |
| **Update** | Edit menu (harga, ketersediaan), informasi pelanggan, profil karyawan |
| **Delete** | Hapus menu, pelanggan, transaksi yang dibatalkan |

---

## 🗄️ Database Schema

| Tabel | Deskripsi |
|-------|-----------|
| `User` | Autentikasi user (OWNER/KARYAWAN) |
| `Karyawan` | Data pegawai |
| `Pelanggan` | Data pelanggan |
| `Menu` | Daftar menu (MAKANAN/MINUMAN/SNACK) |
| `Transaksi` | Record penjualan |
| `DetailTransaksi` | Item per transaksi |
| `Feedback` | Rating & komentar pelanggan |

---

## 🛠️ Development (Tanpa Docker)

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push  # Jika database sudah ada
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📝 Environment Variables

### Root `.env`
```env
# Database
DB_HOST=db_service
DB_USER=sikp_user
DB_PASS=sikp_password_123
DB_NAME=sikp_oyako
DB_ROOT_PASS=rootpassword

# App
GROUP_NAME=kelompok8
APP_PORT=8081
JWT_SECRET=rahasia_negara_oyako_123
```

---

## 🔧 Docker Commands

```bash
# Start semua services
docker compose up --build

# Stop semua services
docker compose down

# Hapus data & rebuild (reset database)
docker compose down -v
docker compose up --build

# Lihat logs
docker compose logs -f

# Lihat logs service tertentu
docker compose logs -f app_service
```

---

## 👥 Tim Pengembang

**Kelompok 8** - Praktikum Teknologi Server

---

_Dibuat untuk memenuhi tugas akhir mata kuliah Teknologi Server_ 🚀
