-- SIKP WARMINDO POINT8 - Database Initialization Script
-- Sistem Informasi Kasir & Penjualan Warmindo Point8
-- ---------------------------------------------
('KRY001', 'Pak Owner Warmindo Point8', 'owner@warmindopoint8.id', '081234567890', 'OWNER', 1),
('KRY002', 'Kasir Satu', 'kasir1@warmindopoint8.id', '081234567891', 'KARYAWAN', 2),
('KRY003', 'Kasir Dua', 'kasir2@warmindopoint8.id', '081234567892', 'KARYAWAN', 3);
    username VARCHAR(255) NOT NULL UNIQUE,
('Mie Goreng Warmindo Point8', 'MAKANAN', 22000, 'Mie goreng khas Warmindo Point8 dengan bumbu rahasia', TRUE),
    role ENUM('OWNER', 'KARYAWAN') DEFAULT 'KARYAWAN',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Karyawan (Data Pegawai)
CREATE TABLE IF NOT EXISTS Karyawan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idKaryawan VARCHAR(50) NOT NULL UNIQUE,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    noHp VARCHAR(20),
    jabatan ENUM('OWNER', 'HEAD_COOK', 'KARYAWAN') DEFAULT 'KARYAWAN',
    tgl_masuk DATETIME DEFAULT CURRENT_TIMESTAMP,
    userId INT NOT NULL UNIQUE,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Pelanggan
CREATE TABLE IF NOT EXISTS Pelanggan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    no_hp VARCHAR(20),
    alamat TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Menu (Produk)
CREATE TABLE IF NOT EXISTS Menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    jenis ENUM('MAKANAN', 'MINUMAN', 'SNACK') NOT NULL,
    harga FLOAT NOT NULL,
    deskripsi TEXT,
    gambar VARCHAR(500),
    isAvailable BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Transaksi (Penjualan)
CREATE TABLE IF NOT EXISTS Transaksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tgl_transaksi DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_harga FLOAT NOT NULL,
    pelangganId INT,
    karyawanId INT NOT NULL,
    FOREIGN KEY (pelangganId) REFERENCES Pelanggan(id) ON DELETE SET NULL,
    FOREIGN KEY (karyawanId) REFERENCES Karyawan(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel DetailTransaksi (Junction Table)
CREATE TABLE IF NOT EXISTS DetailTransaksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaksiId INT NOT NULL,
    menuId INT NOT NULL,
    qty INT NOT NULL,
    subtotal FLOAT NOT NULL,
    FOREIGN KEY (transaksiId) REFERENCES Transaksi(id) ON DELETE CASCADE,
    FOREIGN KEY (menuId) REFERENCES Menu(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Feedback
CREATE TABLE IF NOT EXISTS Feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaksiId INT NOT NULL UNIQUE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    komentar TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaksiId) REFERENCES Transaksi(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------
-- 2. INSERT DATA DUMMY
-- ---------------------------------------------

-- Insert User (Password: owner123 & kasir123 - bcrypt hashed)
INSERT INTO User (username, password, role) VALUES 
('owner', '$2b$10$8osiUzIjhFt.I2/ORYRtmeian18eQXl/SUsbNCehIEY2DYngXxb0a', 'OWNER'),
('kasir1', '$2b$10$gFc0PjEAIFgmOP4cdjFIWOktYJGZqWk0floaZLxJjAFUXbH6p4A1W', 'KARYAWAN'),
('kasir2', '$2b$10$gFc0PjEAIFgmOP4cdjFIWOktYJGZqWk0floaZLxJjAFUXbH6p4A1W', 'KARYAWAN');

-- Insert Karyawan
INSERT INTO Karyawan (idKaryawan, nama, email, noHp, jabatan, userId) VALUES 
('KRY001', 'Pak Owner Warmindo Point8', 'owner@warmindopoint8.id', '081234567890', 'OWNER', 1),
('KRY002', 'Kasir Satu', 'kasir1@warmindopoint8.id', '081234567891', 'KARYAWAN', 2),
('KRY003', 'Kasir Dua', 'kasir2@warmindopoint8.id', '081234567892', 'KARYAWAN', 3);

-- Insert Pelanggan
INSERT INTO Pelanggan (nama, no_hp, alamat) VALUES 
('Pelanggan Setia', '08123456789', 'Jl. Contoh No. 123'),
('Budi Santoso', '08198765432', 'Jl. Merdeka No. 45'),
('Ani Wijaya', '08112233445', 'Jl. Sudirman No. 67');

-- Insert Menu
INSERT INTO Menu (nama, jenis, harga, deskripsi, isAvailable) VALUES 
('Nasi Goreng Spesial', 'MAKANAN', 25000, 'Nasi goreng dengan telur, ayam, dan sayuran segar', TRUE),
('Mie Goreng Warmindo Point8', 'MAKANAN', 22000, 'Mie goreng khas Warmindo Point8 dengan bumbu rahasia', TRUE),
('Ayam Geprek', 'MAKANAN', 20000, 'Ayam goreng tepung dengan sambal geprek pedas', TRUE),
('Nasi Putih', 'MAKANAN', 5000, 'Nasi putih hangat', TRUE),
('Es Teh Manis', 'MINUMAN', 5000, 'Teh manis dingin segar', TRUE),
('Es Jeruk', 'MINUMAN', 7000, 'Jeruk peras segar dengan es', TRUE),
('Kopi Susu', 'MINUMAN', 12000, 'Kopi dengan campuran susu creamy', TRUE),
('Kerupuk', 'SNACK', 3000, 'Kerupuk renyah', TRUE),
('Gorengan Campur', 'SNACK', 10000, 'Aneka gorengan: tahu, tempe, bakwan', TRUE),
('Pisang Goreng', 'SNACK', 8000, 'Pisang goreng crispy dengan topping coklat/keju', TRUE);

-- Insert Transaksi Contoh
INSERT INTO Transaksi (tgl_transaksi, total_harga, pelangganId, karyawanId) VALUES 
(NOW() - INTERVAL 2 DAY, 52000, 1, 2),
(NOW() - INTERVAL 1 DAY, 35000, 2, 2),
(NOW(), 47000, 3, 3);

-- Insert DetailTransaksi
INSERT INTO DetailTransaksi (transaksiId, menuId, qty, subtotal) VALUES 
-- Transaksi 1
(1, 1, 1, 25000),  -- Nasi Goreng
(1, 5, 2, 10000),  -- Es Teh x2
(1, 8, 2, 6000),   -- Kerupuk x2
(1, 10, 1, 8000),  -- Pisang Goreng
-- Transaksi 2
(2, 2, 1, 22000),  -- Mie Goreng
(2, 6, 1, 7000),   -- Es Jeruk
(2, 8, 2, 6000),   -- Kerupuk x2
-- Transaksi 3
(3, 3, 1, 20000),  -- Ayam Geprek
(3, 4, 1, 5000),   -- Nasi Putih
(3, 7, 1, 12000),  -- Kopi Susu
(3, 9, 1, 10000);  -- Gorengan

-- Insert Feedback
INSERT INTO Feedback (transaksiId, rating, komentar) VALUES 
(1, 5, 'Makanan enak dan pelayanan cepat!'),
(2, 4, 'Mie gorengnya mantap, tapi agak lama nunggunya'),
(3, 5, 'Ayam gepreknya juara! Pasti balik lagi');

-- ============================================
-- END OF INITIALIZATION SCRIPT
-- ============================================