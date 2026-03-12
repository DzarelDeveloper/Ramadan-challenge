document.addEventListener("DOMContentLoaded", () => {
  const currentCountElement = document.getElementById("current-count");
  const targetCountElement = document.getElementById("target-count");
  const notificationArea = document.getElementById("notification-area");
  const addBtn = document.getElementById("add-btn");
  const resetBtn = document.getElementById("reset-btn");

  const dzikirTypeSelect = document.getElementById("dzikir-type");
  const dzikirTextContainer = document.getElementById("dzikir-text-container");
  const dzikirArabic = document.getElementById("dzikir-arabic");
  const dzikirLatin = document.getElementById("dzikir-latin");
  const progressBar = document.getElementById("progress-bar");
  const totalDailyCountElement = document.getElementById("total-daily-count");

  const resetModal = document.getElementById("reset-modal");
  const cancelResetBtn = document.getElementById("cancel-reset-btn");
  const confirmResetBtn = document.getElementById("confirm-reset-btn");

  let count = 0;
  let target = 33;
  let totalDailyCount = 0;
  let currentDzikirId = "subhanallah";

  initFromStorage();

  dzikirTypeSelect.addEventListener("change", () => {
    handleDzikirChange();
  });

  addBtn.addEventListener("click", () => {
    count++;
    totalDailyCount++;

    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }

    updateDOM();
    saveToStorage();

    currentCountElement.classList.remove("pop");
    void currentCountElement.offsetWidth;
    currentCountElement.classList.add("pop");

    checkTarget();
  });

  resetBtn.addEventListener("click", () => {
    resetModal.classList.remove("hidden");
  });

  cancelResetBtn.addEventListener("click", () => {
    resetModal.classList.add("hidden");
  });

  resetModal.addEventListener("click", (e) => {
    if (e.target === resetModal) {
      resetModal.classList.add("hidden");
    }
  });

  confirmResetBtn.addEventListener("click", () => {
    count = 0;
    updateDOM();
    saveToStorage();

    notificationArea.style.position = "absolute";
    notificationArea.classList.add("hidden");

    resetModal.classList.add("hidden");
  });

  function handleDzikirChange() {
    const selectedOption =
      dzikirTypeSelect.options[dzikirTypeSelect.selectedIndex];
    currentDzikirId = dzikirTypeSelect.value;

    count =
      parseInt(localStorage.getItem(`dzikir_count_${currentDzikirId}`)) || 0;
    target = parseInt(selectedOption.getAttribute("data-target"));

    const textArabic = selectedOption.getAttribute("data-arabic");
    const textLatin = selectedOption.getAttribute("data-latin");

    if (textArabic && textArabic.trim() !== "") {
      dzikirArabic.textContent = textArabic;
      dzikirLatin.textContent = textLatin;
      dzikirTextContainer.classList.remove("hidden");
    } else {
      dzikirTextContainer.classList.add("hidden");
    }

    notificationArea.style.position = "absolute";
    notificationArea.classList.add("hidden");

    updateDOM();
    checkTarget();
  }

  function updateDOM() {
    currentCountElement.textContent = count;
    targetCountElement.textContent = target;
    totalDailyCountElement.textContent = totalDailyCount;

    const progressPercentage = Math.min((count / target) * 100, 100);
    progressBar.style.width = `${progressPercentage}%`;

    if (count >= target && target > 0) {
      progressBar.classList.add("complete");
    } else {
      progressBar.classList.remove("complete");
    }
  }

  function checkTarget() {
    if (count === target && count > 0) {
      if ("vibrate" in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      notificationArea.textContent = "Alhamdulillah, target tercapai! ✨";
      notificationArea.style.position = "relative";
      notificationArea.classList.remove("hidden");
    } else if (count > target) {
      notificationArea.textContent = "MasyaAllah, dzikir melebihi target! ✨";
      notificationArea.style.position = "relative";
      notificationArea.classList.remove("hidden");
    } else {
      notificationArea.style.position = "absolute";
      notificationArea.classList.add("hidden");
    }
  }

  function saveToStorage() {
    localStorage.setItem(`dzikir_count_${currentDzikirId}`, count);

    const today = new Date().toDateString();
    localStorage.setItem("dzikir_date", today);
    localStorage.setItem("dzikir_total_daily", totalDailyCount);
  }

  function initFromStorage() {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("dzikir_date");

    if (savedDate !== today) {
      totalDailyCount = 0;
      const options = dzikirTypeSelect.options;
      for (let i = 0; i < options.length; i++) {
        localStorage.removeItem(`dzikir_count_${options[i].value}`);
      }
      saveToStorage();
    } else {
      totalDailyCount =
        parseInt(localStorage.getItem("dzikir_total_daily")) || 0;
    }

    handleDzikirChange();
  }
});
