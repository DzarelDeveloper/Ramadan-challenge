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

### Misi 5 — Jadwal Imsakiyah Interaktif

* **Pencarian Lokasi Otomatis**: Fitur pencarian kota/kabupaten di seluruh Indonesia menggunakan API eksternal.
* **Dashboard Jadwal Shalat**: Menampilkan waktu Imsak, Subuh, Dzuhur, Ashar, Maghrib, dan Isya.
* **Live Countdown**: Penghitung waktu mundur real-time menuju waktu shalat berikutnya.
* **Progress Bar Puasa**: Indikator visual progres ibadah puasa harian dari Imsak hingga Maghrib.
* **Dual View Mode**: Pilihan tampilan harian (Card view) yang fokus atau tampilan bulanan (Table view) yang komprehensif.

🔗 **Live Demo:** [Misi 5 - Jadwal Imsakiyah Interaktif](https://dzareldeveloper.github.io/Ramadan-challenge/Misi-5/)

### Misi 6 — Portal Ramadhan Terpadu (Final Hub)

* **Integrasi Seluruh Misi**: Menggabungkan seluruh fitur yang telah dibuat (Jadwal Imsakiyah, Doa, Hitung Dzikir, Kalkulator Zakat, Al-Qur'an, dan To-Do List) ke dalam satu portal terpadu.
* **Web Components**: Implementasi *Custom Elements* (`<portal-navbar>` dan `<portal-footer>`) untuk komponen yang *reusable* dan modular.
* **Landing Page Premium**: Navigasi pusat dengan desain modern, responsif, dan konsisten di seluruh fitur.
* **Produksi Siap Pakai**: Kode yang telah di-*refactor* menerapkan prinsip DRY dan performa yang dioptimalkan untuk pengalaman pengguna terbaik.

🔗 **Live Demo Final:** [Misi 6 - Portal Ramadhan Terpadu](https://dzareldeveloper.github.io/Ramadan-challenge/Misi-6/)

### 📱 Download Aplikasi (APK)

Versi Android dari portal ini sekarang tersedia! Anda dapat mengunduh APK terbaru langsung dari GitHub Releases:

🔗 **Download Sekarang:** [Ramadhan Portal APK (Latest Release)](https://github.com/DzarelDeveloper/Ramadan-challenge/releases)

---

## 🛠️ Tech Stack

* HTML5
* CSS3
* JavaScript (ES6+ & Web Components)
* Git & GitHub
* Visual Studio Code

---

## 📂 Struktur Folder

```text
Ramadan-challenge/
│
├── Misi-1/ (Halaman Doa)
│   ├── index.html
│   └── css/
│       └── style.css
│
├── Misi-2/ (Hitung Zikir)
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── Misi-3/ (Kalkulator Zakat)
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── Misi-4/ (To-Do List)
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── Misi-5/ (Jadwal Imsakiyah)
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── Misi-6/ (Portal Ramadhan Terpadu)
│   ├── index.html            (Landing Page)
│   ├── imsakiyah.html        (Jadwal Imsakiyah)
│   ├── quran.html            (Al-Qur'an Digital)
│   ├── doa-sahur-buka.html   (Doa Ramadhan)
│   ├── hitung-zikir.html     (Digital Tasbih)
│   ├── kalkulator-zakat.html (Kalkulator Zakat)
│   ├── todo-list.html       (Ramadhan To-Do)
│   ├── css/
│   │   ├── style.css         (Global Portal Styles)
│   │   ├── navbar.css
│   │   ├── imsakiyah.css
│   │   ├── quran.css
│   │   ├── doa-sahur-buka.css
│   │   ├── hitung-zikir.css
│   │   ├── kalkulator-zakat.css
│   │   └── todo-list.css
│   └── js/
│       ├── script.js         (Global Portal Logic)
│       ├── imsakiyah.js
│       ├── quran.js
│       ├── hitung-zikir.js
│       ├── kalkulator-zakat.js
│       ├── todo-list.js
│       └── components/       (Web Components)
│           ├── portal-navbar.js
│           └── portal-footer.js
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
