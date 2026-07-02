# Freashday — Smart Food Logistics & Waste Reduction System

Sistem manajemen logistik pangan segar cerdas yang dioptimalkan untuk meminimalkan potensi *food loss* dan *food waste* melalui kalkulasi AI Forecasting (Moving Average & Weekday Multiplier) dan kampanye promosi Digital Nudging berbasis FEFO (*First Expired, First Out*).

## 🚀 Fitur Utama
1. **Smart Logistics Dashboard**: Executive summary kondisi logistik, Sustainability Score, dan metrik keberlanjutan real-time.
2. **Inventory Management (FEFO)**: Pemantauan stok aktif per batch, penghitungan otomatis sisa umur simpan, level risiko, dan auto-deduction stok terlama saat transaksi.
3. **AI Forecasting**: Prediksi jumlah permintaan harian dan rekomendasi kuantitas order preventif.
4. **Digital Nudging**: Halaman manajemen nudge promosi (diskon, bundling, tag urgensi) untuk mempercepat penjualan barang mendekati masa kadaluarsa.
5. **Analytics & Performance**: Evaluasi visual (grafik Recharts) dampak waste reduction, performa per kategori produk, dan AI Insights logistik.
6. **User Management**: Pengaturan multi-role (Admin, Logistics Manager, Marketing Manager) dengan pembatasan hak akses (RBAC).

---

## 🛠️ Tech Stack
- **Frontend SPA**: React 19, TypeScript, TanStack Router & React Query, Zustand, Tailwind CSS, Shadcn UI.
- **Backend API**: NestJS, Prisma ORM, Passport JWT, Swagger API Docs.
- **Database**: PostgreSQL 16.
- **Containerization**: Docker & Docker Compose.

---

## 🔑 Akun Uji Coba (Seed Data)
Semua akun menggunakan password default: **`admin123`** / **`logistics123`** / **`marketing123`** masing-masing.

| Email | Role | Deskripsi Akses |
|---|---|---|
| `admin@freashday.com` | `ADMIN` | Akses penuh seluruh sistem & User CRUD |
| `logistics@freday.com` | `LOGISTICS_MANAGER` | Akses Inventory, Forecasting & Pemesanan |
| `marketing@freashday.com` | `MARKETING_MANAGER` | Akses Digital Nudging & Analytics |

---

## 💻 Cara Menjalankan untuk Pengembangan Lokal

### Prasyarat
- Node.js v20+ & npm v10+
- PostgreSQL server (aktif di port 5432)

### 1. Setup Backend
Masuk ke direktori `backend` dan ikuti perintah berikut:
```bash
cd backend

# Salin konfigurasi environment
cp .env.example .env

# Pasang dependencies
npm install

# Jalankan migrasi skema database & pengisian seed data otomatis
npx prisma migrate dev --name init

# Jalankan server API NestJS
npm run start:dev
```
Server backend akan berjalan di `http://localhost:3000/api`. Dokumen Swagger API bisa diakses di `http://localhost:3000/api/docs`.

### 2. Setup Frontend
Masuk ke direktori `frontend` dan ikuti perintah berikut:
```bash
cd ../frontend

# Salin konfigurasi environment
cp .env.example .env

# Pasang dependencies
npm install

# Jalankan server aplikasi React SPA
npm run dev
```
Aplikasi web dapat diakses di `http://localhost:5173`.

---

## 🐳 Cara Menjalankan dengan Docker Compose

Kamu bisa menjalankan seluruh sistem (Postgres, NestJS Backend, dan React Frontend Nginx) dengan sekali jalan menggunakan Docker:

```bash
# Jalankan di root directory proyek
docker-compose up --build -d
```

- **Aplikasi Web**: `http://localhost` (port 80)
- **Backend API**: `http://localhost:3000/api`
- **Swagger Docs**: `http://localhost:3000/api/docs`
