# 🌙 Ramadhan Portal — Ramadan Coding Challenge 2026

Ramadhan Portal adalah proyek website frontend yang dikembangkan sebagai bagian dari Ramadan Coding Challenge 2026 oleh Alhazen Academy. Proyek ini bertujuan untuk membangun portal web bertema Ramadhan yang berisi berbagai fitur informatif dan bermanfaat, seperti kumpulan doa, jadwal imsakiyah, dan halaman interaktif lainnya.

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

* **Integrasi API**: Mengambil data jadwal shalat dan imsak secara real-time dari API publik (MyQuran).
* **Pencarian Kota Pintar**: Dropdown khusus (*custom select*) yang memungkinkan pengguna mengetik dan mencari nama kota/kabupaten dengan cepat.
* **Fitur Live Countdown**: Hitungan mundur (*countdown timer*) yang presisi menuju waktu shalat atau imsak berikutnya.
* **Peringatan Waktu Kritis**: Indikator visual berdenyut (*pulsing alert*) saat waktu tersisa kurang dari 5 menit.
* **Progress Bar Puasa**: Garis kemajuan visual yang menunjukkan persentase waktu berpuasa yang telah dilalui (antara Imsak hingga Maghrib).
* **Tampilan Fleksibel & Responsif**:
    * **Hari Ini (Card View)**: Menampilkan jadwal hari ini dalam bentuk kartu yang indah, di mana waktu shalat terdekat otomatis disorot.
    * **Sebulan (Table View)**: Menampilkan jadwal sebulan penuh dalam bentuk tabel dengan *sticky header* agar mudah dibaca saat di-scroll.
* **Personalisasi (Local Storage)**: Sistem secara otomatis mengingat kota terakhir yang dipilih pengguna sehingga besok tidak perlu menyetel ulang.

🔗 **Live Demo:** [Misi 5 - Jadwal Imsakiyah](https://dzareldeveloper.github.io/Ramadan-challenge/Misi-5/)

(Misi selanjutnya akan ditambahkan secara bertahap)

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
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
└── README.md
```

---

## 🌐 Status Proyek

Proyek sedang dalam tahap pengembangan sebagai bagian dari challenge.

Target akhir:

* Website portal lengkap
* Responsive design
* Deployment ke GitHub Pages 

---

## 👨‍💻 Developer

DzarelDeveloper
Frontend Developer Student

GitHub: https://github.com/DzarelDeveloper

---

## 📜 License

Proyek ini menggunakan MIT License.
