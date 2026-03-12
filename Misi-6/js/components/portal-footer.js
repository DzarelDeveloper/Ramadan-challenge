class PortalFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const quotes = {
      "index.html": {
        text: "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya.",
        source: "(HR. Ahmad)",
      },
      "imsakiyah.html": {
        text: "Puasa itu perisai, maka janganlah ia (orang yang puasa) berkata kotor dan berbuat jahil.",
        source: "(HR. Bukhari & Muslim)",
      },
      "quran.html": {
        text: "Bacalah Al-Qur'an, karena ia akan datang pada hari kiamat sebagai syafaat bagi pembacanya.",
        source: "(HR. Muslim)",
      },
      "doa-sahur-buka.html": {
        text: "Doa adalah senjata bagi orang mukmin, tiang agama, dan cahaya langit serta bumi.",
        source: "(HR. Al-Hakim)",
      },
      "hitung-zikir.html": {
        text: "Basahilah lidahmu dengan senantiasa berzikir kepada Allah.",
        source: "(HR. Tirmidzi)",
      },
      "kalkulator-zakat.html": {
        text: "Ambillah zakat dari harta mereka guna membersihkan dan mensucikan mereka.",
        source: "(QS. At-Taubah: 103)",
      },
      "todo-list.html": {
        text: "Maka apabila engkau telah selesai (dari sesuatu urusan), tetaplah bekerja keras (untuk urusan yang lain).",
        source: "(QS. Al-Insyirah: 7)",
      },
    };

    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html";
    const quote = quotes[page] || quotes["index.html"];

    this.innerHTML = `
        <footer>
            <div class="footer-content">
                <p class="quote">"${quote.text}" <br><small style="font-family:'Plus Jakarta Sans', sans-serif; opacity: 0.7;">${quote.source}</small></p>
                <p class="copyright">&copy; 2026 Marhaban Ya Marhaban. Crafted with devotion.</p>
            </div>
        </footer>
        `;
  }
}

customElements.define("portal-footer", PortalFooter);
