# Minesweeper Express + CLI

Sebuah implementasi sederhana game **Minesweeper** menggunakan **Node.js (Express)** sebagai backend API, dan **Node CLI** (`play.js`) sebagai antarmuka permainan di terminal.

---

## 📦 Fitur
- Membuat game baru dengan ukuran papan (`n x n`) dan jumlah mine yang bisa diatur.
- Menampilkan status papan permainan di CLI.
- Mengungkap sel tertentu (`row`, `col`).
- Otomatis menampilkan semua mine jika kalah.
- Pesan error yang jelas jika input tidak valid atau game tidak ditemukan.

---

## 🚀 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/username/minesweeper-express.git
cd minesweeper-express
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Jalankan Server
```bash
npm start
```
Server akan berjalan di `http://localhost:3000`.

---

## 🎮 Penggunaan CLI

### Menjalankan CLI
```bash
node play.js <command> [options]
```

### Perintah Tersedia

#### 1. Membuat Game Baru
```bash
node play.js new <n> <mines>
```
- `n` = ukuran papan (contoh: `4` berarti papan 4x4).
- `mines` = jumlah mine yang ingin ditempatkan.

**Contoh:**
```bash
node play.js new 4 3
```
Output:
```
New Game Created: G1
```

---

#### 2. Menampilkan Status Game
```bash
node play.js show <gameId>
```
**Contoh:**
```bash
node play.js show G1
```
Output:
```
=== Game Status: playing ===
. . . .
. . . .
. . . .
. . . .
```

---

#### 3. Mengungkap Sel
```bash
node play.js reveal <gameId> <row> <col>
```
**Contoh:**
```bash
node play.js reveal G1 1 2
```

---

## ⚠️ Pesan Error yang Mungkin Muncul
- `game not found` → ID game tidak ditemukan.
- `row and col must be integers` → Koordinat harus angka.
- `coordinates out of bounds` → Koordinat di luar papan.
- `Cell already revealed` → Sel sudah dibuka.
- `n and mines must be integers` → Input ukuran papan dan mine harus angka.
- `mines must be less than n*n` → Jumlah mine tidak boleh melebihi jumlah sel.

---

## 📄 Lisensi
Proyek ini bebas digunakan untuk tujuan pembelajaran.

---

**Author:** Febryana  
**Tech Stack:** Node.js, Express, JavaScript (ES Modules)  
**Node Version:** v22.15.0 (LTS)
