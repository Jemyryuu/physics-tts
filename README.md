# Physics TTS - Pemilihan Soal Teka-Teki Silang Fisika

Website interaktif dan minimalis untuk pemilihan soal kuis Teka-Teki Silang (TTS) Fisika. Terdiri dari 50 soal yang dibagi ke dalam 3 ronde utama dan ronde sisa nomor, dilengkapi dengan timer 45 detik, transisi 5 detik, serta pembeda visual antara soal mendatar dan menurun.

## 🚀 Fitur Utama

- **50 Soal Fluida & Mekanika Fisika:**
  - **Ronde 1 (1–12):** 7 Mendatar & 5 Menurun
  - **Ronde 2 (13–24):** 4 Mendatar & 8 Menurun
  - **Ronde 3 (25–36):** 7 Mendatar & 5 Menurun
  - **Sisa Nomor (37–50):** 7 Mendatar & 7 Menurun
- **Desain Minimalis Putih:** Latar belakang putih bersih (`#ffffff`) dengan teks kontras tinggi, ideal untuk proyektor dan layar besar.
- **Pembeda Visual Jelas:**
  - ➡️ **Mendatar (Biru)**
  - ⬇️ **Menurun (Hijau)**
- **Tampilan Soal Satu-Satu:** Setiap nomor soal dapat dibuka dalam mode fokus dengan ukuran teks besar dan mudah dibaca.
- **Timer & Transisi:**
  - **Transisi 5 Detik:** Hitung mundur persiapan sebelum waktu pengerjaan soal dimulai.
  - **Waktu Menjawab 45 Detik:** Hitung mundur dengan indikator progres bar dan perubahan warna otomatis saat waktu menipis.
- **Efek Suara Sintetis (Web Audio API):** Bip transisi, denting mulai, alarm 10 detik terakhir, dan bel waktu habis (bisa diaktifkan/dinonaktifkan).
- **Penanda Status Soal:** Tandai soal yang sudah selesai agar tidak terpilih dua kali.
- **Dukungan Pintasan Keyboard:**
  - `Spasi` : Jeda / Lanjut Timer
  - `R` : Ulangi Timer
  - `S` : Lewati Transisi 5 Detik
  - `←` / `→` : Navigasi Soal Sebelumnya / Selanjutnya
  - `Esc` : Kembali ke Daftar Soal

## 📂 Struktur File

```text
├── index.html       # Halaman utama aplikasi
├── style.css        # Styling tema minimalis putih & responsif
├── questions.js     # Database 50 soal TTS Fisika
├── app.js           # Logika interaktif, timer, audio synth, dan event handling
└── README.md        # Dokumentasi proyek
```

## 💻 Cara Menjalankan

Aplikasi ini murni menggunakan **HTML5, CSS3, dan Vanilla JavaScript**, sehingga tidak memerlukan instalasi dependensi (Node.js/npm) ataupun server web khusus.

1. Clone repositori ini:
   ```bash
   git clone https://github.com/Jemyryuu/physics-tts.git
   ```
2. Buka file `index.html` langsung di peramban (browser) favorit Anda (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
