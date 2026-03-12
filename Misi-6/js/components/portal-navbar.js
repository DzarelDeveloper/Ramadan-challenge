class PortalNavbar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const currentPath = window.location.pathname;
    let currentPage = currentPath.split("/").pop() || "index.html";
    if (currentPage === "") currentPage = "index.html";

    this.innerHTML = `
        <header class="portal-header">
            <nav class="portal-nav">
                <a href="index.html" class="logo">
                    <i class="fas fa-moon"></i> Ramadhan App
                </a>
                <div class="hamburger">
                    <i class="fas fa-bars"></i>
                </div>
                <ul class="nav-links">
                    <li><a href="index.html" class="${currentPage === "index.html" ? "active" : ""}">Home</a></li>
                    <li><a href="imsakiyah.html" class="${currentPage === "imsakiyah.html" ? "active" : ""}">Imsakiyah</a></li>
                    <li><a href="quran.html" class="${currentPage === "quran.html" ? "active" : ""}">Al-Qur'an</a></li>
                    <li><a href="doa-sahur-buka.html" class="${currentPage === "doa-sahur-buka.html" ? "active" : ""}">Doa</a></li>
                    <li><a href="hitung-zikir.html" class="${currentPage === "hitung-zikir.html" ? "active" : ""}">Hitung Zikir</a></li>
                    <li><a href="kalkulator-zakat.html" class="${currentPage === "kalkulator-zakat.html" ? "active" : ""}">Kalkulator Zakat</a></li>
                    <li><a href="todo-list.html" class="${currentPage === "todo-list.html" ? "active" : ""}">To-Do List</a></li>
                </ul>
            </nav>
        </header>
        `;

    const hamburger = this.querySelector(".hamburger");
    const navLinks = this.querySelector(".nav-links");

    if (hamburger && navLinks) {
      const links = this.querySelectorAll(".nav-links li a");

      hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const isMenuOpen = navLinks.classList.contains("active");
        hamburger.innerHTML = isMenuOpen
          ? '<i class="fas fa-times"></i>'
          : '<i class="fas fa-bars"></i>';
      });

      links.forEach((link) => {
        link.addEventListener("click", () => {
          if (navLinks.classList.contains("active")) {
            navLinks.classList.remove("active");
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
          }
        });
      });
    }
  }
}

customElements.define("portal-navbar", PortalNavbar);
