const app = {
  apiBaseContent: "https://equran.id/api/v2",
  juzApiBase: "https://api.myquran.com/v2/quran/ayat/juz",
  allSurahs: [],
  currentAudio: null,
  currentAyatPlaying: null,
  currentTab: "surah",

  init() {
    this.fetchSurahList();
    this.renderJuzList();
    this.setupSearch();
  },

  switchTab(tabName) {
    this.currentTab = tabName;

    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset && btn.dataset.target === tabName + "-view") {
        btn.classList.add("active");
      } else if (
        btn.getAttribute("onclick") &&
        btn.getAttribute("onclick").includes(tabName)
      ) {
        btn.classList.add("active");
      }
    });

    if (tabName === "surah") {
      document.getElementById("surah-grid").style.display = "grid";
      document.getElementById("juz-grid").style.display = "none";
      document.querySelector(".search-container").style.display = "block";
    } else {
      document.getElementById("surah-grid").style.display = "none";
      document.getElementById("juz-grid").style.display = "grid";
      document.querySelector(".search-container").style.display = "none";
    }
  },

  async fetchSurahList() {
    const grid = document.getElementById("surah-grid");
    try {
      const res = await fetch(`${this.apiBaseContent}/surat`);
      const data = await res.json();

      if (data.code === 200) {
        this.allSurahs = data.data;
        this.renderSurahList(this.allSurahs);
      } else {
        grid.innerHTML = `<div class="loader" style="color:red">Gagal memuat data surah.</div>`;
      }
    } catch (error) {
      grid.innerHTML = `<div class="loader" style="color:red">Terjadi kesalahan koneksi.</div>`;
    }
  },

  renderSurahList(surahs) {
    const grid = document.getElementById("surah-grid");
    grid.innerHTML = "";

    if (surahs.length === 0) {
      grid.innerHTML = `<div class="loader">Pencarian tidak ditemukan.</div>`;
      return;
    }

    surahs.forEach((surah) => {
      const card = document.createElement("div");
      card.className = "surah-card";
      card.onclick = () => this.openSurahDetail(surah.nomor);

      card.innerHTML = `
                <div class="surah-number">${surah.nomor}</div>
                <div class="surah-info">
                    <div class="surah-name-latin">${surah.namaLatin}</div>
                    <div class="surah-translation">${surah.arti}</div>
                    <div class="surah-details-meta">${surah.tempatTurun} • ${surah.jumlahAyat} Ayat</div>
                </div>
                <div class="surah-name-arabic">${surah.nama}</div>
            `;
      grid.appendChild(card);
    });
  },

  renderJuzList() {
    const grid = document.getElementById("juz-grid");
    grid.innerHTML = "";

    for (let i = 1; i <= 30; i++) {
      const card = document.createElement("div");
      card.className = "surah-card";
      card.onclick = () => this.openJuzDetail(i);

      card.innerHTML = `
                <div class="surah-number">${i}</div>
                <div class="surah-info">
                    <div class="surah-name-latin">Juz ${i}</div>
                </div>
                <div class="surah-name-arabic">الجزء ${i}</div>
            `;
      grid.appendChild(card);
    }
  },

  setupSearch() {
    const searchInput = document.getElementById("search-surah");
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = this.allSurahs.filter(
        (s) =>
          s.namaLatin.toLowerCase().includes(term) ||
          s.arti.toLowerCase().includes(term) ||
          s.nomor.toString() === term,
      );
      this.renderSurahList(filtered);
    });
  },

  async openSurahDetail(surahNumber) {
    document.getElementById("surah-list-view").style.display = "none";
    const detailView = document.getElementById("surah-detail-view");
    detailView.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });

    const headerInfo = document.getElementById("surah-header-info");
    const ayatList = document.getElementById("ayat-list");
    const audioBarContainer = document.getElementById(
      "surah-audio-player-container",
    );

    headerInfo.innerHTML =
      '<div class="loader"><i class="fas fa-spinner fa-spin"></i> Memuat detail surah...</div>';
    ayatList.innerHTML = "";
    audioBarContainer.style.display = "none";

    if (this.currentAudio) {
      this.currentAudio.pause();
    }

    try {
      const res = await fetch(`${this.apiBaseContent}/surat/${surahNumber}`);
      const data = await res.json();

      if (data.code === 200) {
        this.renderSurahDetail(data.data);
      } else {
        headerInfo.innerHTML = `<div class="loader" style="color:red">Gagal memuat detail surah.</div>`;
      }
    } catch (error) {
      headerInfo.innerHTML = `<div class="loader" style="color:red">Terjadi kesalahan koneksi.</div>`;
    }
  },

  renderSurahDetail(surahData) {
    const headerInfo = document.getElementById("surah-header-info");
    const ayatList = document.getElementById("ayat-list");
    const audioBarContainer = document.getElementById(
      "surah-audio-player-container",
    );

    headerInfo.innerHTML = `
            <h2>${surahData.namaLatin}</h2>
            <div class="surah-header-arabic">${surahData.nama}</div>
            <p>${surahData.arti} • ${surahData.tempatTurun} • ${surahData.jumlahAyat} Ayat</p>
            <p style="font-size:0.9rem; color:#888;">${surahData.deskripsi.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 150)}...</p>
        `;

    let bismillahHtml = "";
    if (surahData.nomor !== 1 && surahData.nomor !== 9) {
      bismillahHtml = `<div class="bismillah">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div>`;
    }

    audioBarContainer.style.display = "flex";
    audioBarContainer.innerHTML = `
            <div class="audio-title">
                <i class="fas fa-headphones"></i> Murottal Full Surah
            </div>
            <audio controls id="full-surah-audio" preload="none">
                <source src="${surahData.audioFull["01"]}" type="audio/mpeg">
                Browser Anda tidak mendukung elemen audio.
            </audio>
        `;

    let ayahsHtml = bismillahHtml;

    surahData.ayat.forEach((ayat) => {
      const audioSrc = ayat.audio["01"];

      ayahsHtml += `
            <div class="ayat-card" id="ayat-${ayat.nomorAyat}">
                <div class="ayat-header">
                    <div class="ayat-number">${surahData.nomor}:${ayat.nomorAyat}</div>
                    <div class="ayat-actions">
                        <button onclick="app.playAyatAudio('${audioSrc}', ${ayat.nomorAyat})" id="btn-play-${ayat.nomorAyat}" title="Putar Ayat">
                            <i class="fas fa-play-circle"></i>
                        </button>
                    </div>
                </div>
                <div class="ayat-arabic">${ayat.teksArab}</div>
                <div class="ayat-latin">${ayat.teksLatin}</div>
                <div class="ayat-translation">${ayat.teksIndonesia}</div>
            </div>
            `;
    });

    ayatList.innerHTML = ayahsHtml;

    const fullAudio = document.getElementById("full-surah-audio");
    fullAudio.addEventListener("play", () => {
      if (this.currentAudio && this.currentAudio !== fullAudio) {
        this.currentAudio.pause();
        this.resetPlayButtons();
      }
      this.currentAudio = fullAudio;
    });
  },

  playAyatAudio(src, nomorAyat) {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }

    this.resetPlayButtons();

    const fullAudio = document.getElementById("full-surah-audio");
    if (fullAudio) fullAudio.pause();

    const audio = new Audio(src);
    this.currentAudio = audio;
    this.currentAyatPlaying = nomorAyat;

    const btn = document.getElementById(`btn-play-${nomorAyat}`);
    if (btn) {
      btn.innerHTML = '<i class="fas fa-pause-circle"></i>';
      btn.classList.add("playing");
    }


    audio.onended = () => {
      this.resetPlayButtons();
    };
  },

  resetPlayButtons() {
    if (this.currentAyatPlaying) {
      const btn = document.getElementById(
        `btn-play-${this.currentAyatPlaying}`,
      );
      if (btn) {
        btn.innerHTML = '<i class="fas fa-play-circle"></i>';
        btn.classList.remove("playing");
      }
      this.currentAyatPlaying = null;
    }
  },

  closeSurahDetail() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
      this.resetPlayButtons();
    }

    document.getElementById("surah-detail-view").style.display = "none";
    document.getElementById("surah-list-view").style.display = "block";
  },

  async openJuzDetail(juzNumber) {
    document.getElementById("surah-list-view").style.display = "none";
    const detailView = document.getElementById("surah-detail-view");
    detailView.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });

    const headerInfo = document.getElementById("surah-header-info");
    const ayatList = document.getElementById("ayat-list");
    const audioBarContainer = document.getElementById(
      "surah-audio-player-container",
    );

    headerInfo.innerHTML =
      '<div class="loader"><i class="fas fa-spinner fa-spin"></i> Memuat detail Juz...</div>';
    ayatList.innerHTML = "";
    audioBarContainer.style.display = "none";

    if (this.currentAudio) {
      this.currentAudio.pause();
    }

    try {
      const res = await fetch(`${this.juzApiBase}/${juzNumber}`);
      const data = await res.json();

      if (data.status === true) {
        this.renderJuzDetail(juzNumber, data.data);
      } else {
        headerInfo.innerHTML = `<div class="loader" style="color:red">Gagal memuat detail juz.</div>`;
      }
    } catch (error) {
      headerInfo.innerHTML = `<div class="loader" style="color:red">Terjadi kesalahan koneksi.</div>`;
    }
  },

  renderJuzDetail(juzNumber, ayahs) {
    const headerInfo = document.getElementById("surah-header-info");
    const ayatList = document.getElementById("ayat-list");

    headerInfo.innerHTML = `
            <h2>Juz ${juzNumber}</h2>
            <div class="surah-header-arabic">الجزء ${juzNumber}</div>
            <p>${ayahs.length} Ayat</p>
        `;

    let ayahsHtml = "";
    let currentSurahTracker = null;

    ayahs.forEach((ayat) => {
      if (currentSurahTracker !== ayat.surah) {
        currentSurahTracker = ayat.surah;

        let surahName = `Surah ${ayat.surah}`;
        if (this.allSurahs && this.allSurahs.length > 0) {
          const s = this.allSurahs.find((x) => x.nomor == ayat.surah);
          if (s) surahName = s.namaLatin;
        }

        ayahsHtml += `
                    <div class="surah-separator" style="text-align:center; margin: 40px 0 20px; padding-bottom: 10px; border-bottom: 2px solid var(--secondary);">
                        <h3 style="color: var(--primary); font-size: 1.5rem;">${surahName}</h3>
                    </div>
                `;

        if (ayat.surah != 1 && ayat.surah != 9 && ayat.ayah == 1) {
          ayahsHtml += `<div class="bismillah">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div>`;
        }
      }

      const audioSrc = ayat.audio;
      const idAyatHtml = `ayat-juz-${ayat.surah}-${ayat.ayah}`;

      ayahsHtml += `
            <div class="ayat-card" id="${idAyatHtml}">
                <div class="ayat-header">
                    <div class="ayat-number">${ayat.surah}:${ayat.ayah}</div>
                    <div class="ayat-actions">
                        <button onclick="app.playAyatAudio('${audioSrc}', '${ayat.surah}-${ayat.ayah}')" id="btn-play-${ayat.surah}-${ayat.ayah}" title="Putar Ayat">
                            <i class="fas fa-play-circle"></i>
                        </button>
                    </div>
                </div>
                <div class="ayat-arabic">${ayat.arab}</div>
                <div class="ayat-latin">${ayat.latin || ""}</div>
                <div class="ayat-translation">${ayat.text}</div>
            </div>
            `;
    });

    ayatList.innerHTML = ayahsHtml;
  },
};

document.addEventListener("DOMContentLoaded", () => {
  app.init();
});
