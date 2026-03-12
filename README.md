# 🌙 Marhaban Ya Marhaban — Ramadan Coding Challenge 2026

Marhaban Ya Marhaban adalah proyek website frontend yang dikembangkan sebagai bagian dari Ramadan Coding Challenge 2026 oleh Alhazen Academy. Proyek ini bertujuan untuk membangun portal web bertema Ramadhan yang berisi berbagai fitur informatif dan bermanfaat, seperti kumpulan doa, jadwal imsakiyah, dan halaman interaktif lainnya.

Website ini dikembangkan secara bertahap melalui beberapa misi, dimulai dari struktur HTML dan styling CSS dasar, hingga integrasi JavaScript dan deployment ke hosting publik.

---

## 🎯 Tujuan Proyek

* Membangun website portal Ramadhan yang modern dan responsif
* Melatih kemampuan frontend development menggunakan HTML, CSS, dan JavaScript
* Membuat proyek nyata yang dapat digunakan sebagai portfolio
* Memahami alur pengembangan web dari lokal hingga deployment

---

## 🚀 Fitur yang Dikembangkan

### Misi 1 — Halaman Doa Ramadhan

* Menampilkan doa sahur
* Menampilkan doa buka puasa
* Menggunakan semantic HTML
* Styling modern menggunakan CSS
* Layout responsif untuk desktop dan mobile

🔗 **Live Demo:** [Misi 1 - Halaman Doa Ramadhan](https://dzareldeveloper.github.io/Ramadan-challenge/Misi-1/)

### Misi 2 — Aplikasi Hitung Zikir

* Fitur penghitung (counter) dzikir interaktif
* Pilihan berbagai jenis dzikir lengkap dengan teks Arab dan Latin
* Progress bar dan target pencapaian dzikir
* Modal konfirmasi untuk mereset hitungan
* Notifikasi capaian target dzikir harian
* Implementasi DOM Manipulation dengan JavaScript

🔗 **Live Demo:** [Misi 2 - Aplikasi Hitung Zikir](https://dzareldeveloper.github.io/Ramadan-challenge/Misi-2/)

### Misi 3 — Kalkulator Zakat

* Pilihan antarmuka 4 jenis zakat (Penghasilan, Perusahaan, Perdagangan, dan Emas)
* Form input dinamis berdasarkan kategori zakat
* Perhitungan batas nisab otomatis (berdasarkan referensi 85 gram emas)
* Kalkulasi total harta bersih (dikurangi hutang jika ada) dan kewajiban zakat (2.5%) secara otomatis
* Penentuan status wajib zakat secara dinamis
* Antarmuka profesional dengan UX state informatif saat data kosong
* Responsif dan ramah pengguna di semua ukuran perangkat

🔗 **Live Demo:** [Misi 3 - Kalkulator Zakat](https://dzareldeveloper.github.io/Ramadan-challenge/Misi-3/)

### Misi 4 — Ramadhan To-Do List

* SPA satu halaman yang berfokus pada navigasi tab (Shalat, Quran, Puasa, Dzikir)
* **Pintasan Progres Harian**: Circle progress global dengan status motivasi dinamis
* **Checklist Shalat Wajib**:
    * Integrasi API waktu shalat & Geolocation otomatis (mendeteksi lokasi pengguna)
    * **Validasi Waktu**: Mencegah checklist sebelum masuk waktu shalat (Real-time Clock validation)
    * Penanda otomatis jika shalat dikerjakan "Terlewat" (berdasarkan batas waktu shalat berikutnya)
* **Target Tilawah Quran**:
    * Sistem kunci target (diubah setiap 3 hari) untuk menjaga konsistensi
    * Input manual halaman dibaca atau sekali klik "Target Selesai"
* **Jurnal Puasa Ramadhan**:
    * Kalender 30 hari interaktif dengan penentuan hari puasa secara real-time
    * Fitur "Halangan/Sakit" khusus (dengan penanda qadha/hutang puasa)
    * Pesan penyemangat & edukasi ibadah harian
* **Penyimpanan Lokal**: Semua progres disimpan aman di browser (`localStorage`)
* **Antarmuka Premium**: Desain modern bertema hijau (#03522f) dan emas dengan animasi halus

🔗 **Live Demo:** [Misi 4 - Ramadhan To-Do List](https://dzareldeveloper.github.io/Ramadan-challenge/Misi-4/)

### Misi 5 — Portal Ramadhan Terpadu (Final Hub)

* **Integrasi Seluruh Misi**: Kesimpulan dari seluruh misi, menggabungkan Jadwal Imsakiyah, Doa Ramadhan, Hitung Dzikir, Kalkulator Zakat, Baca Al-Qur'an, dan Ramadhan To-Do List ke dalam satu portal terpadu.
* **Web Components**: Implementasi *Custom Elements* (seperti `<portal-navbar>` dan `<portal-footer>`) untuk menciptakan komponen *reusable* layaknya framework modern, menggunakan JavaScript Vanilla murni.
* **Dashboard Jadwal Imsakiyah**: Mengambil data jadwal shalat secara *real-time* via API, dilengkapi *live countdown*, progres puasa, serta fitur pencarian pintar untuk menyesuaikan lokasi pengguna.
* **Navigasi Multi-Halaman Responsif**: Pengalaman transisi antar fitur yang mulus dengan *state* dan *styling* konsisten di seluruh halaman, memastikan keramahan pengguna baik di *desktop* maupun *mobile*.
* **Siap Produksi (Production Ready)**: Kode HTML, CSS, dan JavaScript telah dioptimisasi, di-*refactor* menerapkan prinsip DRY (Don't Repeat Yourself), dan siap diluncurkan.

🔗 **Live Demo Final:** [Misi 5 - Portal Ramadhan Terpadu](https://dzareldeveloper.github.io/Ramadan-challenge/Misi-5/)

---

## 🛠️ Tech Stack

* HTML5
* CSS3
* JavaScript
* GitHub
* Visual Studio Code

---

## 📂 Struktur Folder

```text
Ramadan-challenge/
│
├── Misi-1/
│   ├── index.html
│   └── css/
│       └── style.css
│
├── Misi-2/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── Misi-3/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── Misi-4/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── Misi-5/
│   ├── index.html
│   ├── doa-sahur-buka.html
│   ├── hitung-zikir.html
│   ├── kalkulator-zakat.html
│   ├── quran.html
│   ├── todo-list.html
│   ├── css/
│   │   ├── (Kumpulan file CSS modular)
│   └── js/
│       ├── components/ (Web Components)
│       └── (Kumpulan file JS modular)
│
└── README.md
```

---

## 🌐 Status Proyek

**Selesai / Production Ready** ✅

Proyek ini telah menyelesaikan semua misi dari tantangan Ramadan Coding Challenge 2026. Portal terpadu berhasil dibangun, responsif, dan siap digunakan sehari-hari melengkapi ibadah di bulan Ramadhan.

Telah tersedia live demo via GitHub Pages.

---

## 👨‍💻 Developer

DzarelDeveloper
Frontend Developer Student

GitHub: https://github.com/DzarelDeveloper

---

## 📜 License

Proyek ini menggunakan MIT License.
