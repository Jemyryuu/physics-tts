# Physics TTS - Pemilihan Soal Teka-Teki Silang Fisika

Website interaktif dan minimalis untuk pemilihan soal kuis Teka-Teki Silang (TTS) Fisika. Terdiri dari 50 soal yang dibagi ke dalam 3 ronde utama dan 1 ronde soal cadangan, dilengkapi dengan timer 45 detik, transisi 5 detik, fitur buka/tutup kunci jawaban, serta pembeda visual antara soal mendatar dan menurun.

## 🚀 Fitur Utama

- **50 Soal Fluida & Mekanika Fisika:**
  - **Ronde 1 (1 - 12):** 7 Mendatar & 5 Menurun
  - **Ronde 2 (1 - 12):** 5 Mendatar & 7 Menurun
  - **Ronde 3 (1 - 12):** 6 Mendatar & 6 Menurun
  - **Soal Cadangan (1 - 14):** 7 Mendatar & 7 Menurun
- **Kunci Jawaban Terintegrasi (Answer Reveal):** Tombol dan pintasan keyboard untuk melihat kunci jawaban pada modal kuis tanpa membocorkannya secara otomatis ke peserta.
- **Desain Minimalis Putih:** Latar belakang putih bersih (`#ffffff`) dengan teks kontras tinggi, ideal untuk proyektor dan layar besar.
- **Pembeda Visual Jelas:**
  - ➡️ **Mendatar (Biru)**
  - ⬇️ **Menurun (Hijau)**
- **Tampilan Soal Satu-Satu:** Setiap nomor soal dapat dibuka dalam mode fokus dengan ukuran teks besar dan mudah dibaca.
- **Timer & Transisi:**
  - **Transisi 5 Detik:** Hitung mundur persiapan sebelum waktu pengerjaan soal dimulai.
  - **Waktu Menjawab 45 Detik:** Hitung mundur dengan indikator progres bar dan perubahan warna otomatis saat waktu menipis.
- **Efek Suara Sintetis (Web Audio API) & Pengatur Volume:** Bip transisi, denting mulai, alarm 10 detik terakhir, dan bel waktu habis dengan slider volume interaktif (0 - 100%) dan tombol mute/unmute yang tersimpan otomatis.
- **Layar Ronde Selesai & Lanjut Ronde:** Tampilan perayaan saat ronde selesai dengan ringkasan statistik dan opsi instan untuk melanjutkan ke ronde berikutnya.
- **Penanda Status Soal:** Tandai soal yang sudah selesai agar tidak terpilih dua kali.
- **Dukungan Pintasan Keyboard:**
  - `Spasi` : Jeda / Lanjut Timer
  - `R` : Ulangi Timer
  - `S` : Lewati Transisi 5 Detik
  - `T` / `K` : Lewati Timer Soal 45 Detik
  - `J` : Tampilkan / Sembunyikan Kunci Jawaban
  - `M` : Mute / Unmute Suara
  - `←` / `→` : Navigasi Soal Sebelumnya / Selanjutnya
  - `Esc` : Kembali ke Daftar Soal

## 📂 Struktur File

```text
├── index.html       # Halaman utama aplikasi
├── style.css        # Styling tema minimalis putih & responsif
├── questions.js     # Database 50 soal TTS Fisika beserta kunci jawaban & konfigurasi ronde
├── app.js           # Logika interaktif, timer, audio synth, answer toggle, dan event handling
└── README.md        # Dokumentasi proyek
```

## 💻 Cara Menjalankan

Aplikasi ini murni menggunakan **HTML5, CSS3, dan Vanilla JavaScript**, sehingga tidak memerlukan instalasi dependensi (Node.js/npm) ataupun server web khusus.

1. Clone repositori ini:
   ```bash
   git clone https://github.com/Jemyryuu/physics-tts.git
   ```
2. Buka file `index.html` langsung di peramban (browser) favorit Anda (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

---

## 👤 Author & Credit

Made by **Raffasya Zhafran / XI-3**
