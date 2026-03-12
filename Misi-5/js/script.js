const citySelect = document.getElementById('city-select');
const scheduleBody = document.getElementById('schedule-body');
const locationName = document.getElementById('location-name');
const currentMonthEl = document.getElementById('current-month');
const loadingState = document.getElementById('loading');
const errorState = document.getElementById('error');
const scheduleContent = document.getElementById('schedule-content');

// Custom Select Elements
const customSelectWrapper = document.getElementById('custom-select-wrapper');
const selectTrigger = document.getElementById('select-trigger');
const optionsList = document.getElementById('options-list');
const citySearch = document.getElementById('city-search');
const selectedCityText = document.getElementById('selected-city-text');

// Bonus Feature Elements
const btnViewCards = document.getElementById('btn-view-cards');
const btnViewTable = document.getElementById('btn-view-table');
const viewCardsContainer = document.getElementById('view-cards');
const viewTableContainer = document.getElementById('view-table');
const dailyGrid = document.getElementById('daily-grid');
const dailyDateDisplay = document.getElementById('daily-date-display');
const dailyHijriDisplay = document.getElementById('daily-hijri-display');
const countdownContainer = document.querySelector('.countdown-container');
const countdownText = document.getElementById('next-prayer-name');
const countdownTimer = document.getElementById('countdown-timer');

// Fasting Progress Elements
const fastingProgressContainer = document.getElementById('fasting-progress-container');
const progressStartTime = document.getElementById('progress-start-time');
const progressEndTime = document.getElementById('progress-end-time');
const fastingProgressBar = document.getElementById('fasting-progress-bar');
const fastingProgressText = document.getElementById('fasting-progress-text');

let cities = [];
let selectedCityId = null;
let currentScheduleData = null;
let currentViewMode = 'cards'; // 'cards' or 'table'
let countdownInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchCities();
    setupCustomSelect();
    setupViewToggles();
    setupTableScroll();
});

function setupTableScroll() {
    viewTableContainer.addEventListener('scroll', () => {
        if (viewTableContainer.scrollTop > 0) {
            viewTableContainer.classList.add('is-scrolled');
        } else {
            viewTableContainer.classList.remove('is-scrolled');
        }
    });
}

function setupViewToggles() {
    btnViewCards.addEventListener('click', () => {
        currentViewMode = 'cards';
        btnViewCards.classList.add('active');
        btnViewTable.classList.remove('active');
        viewCardsContainer.classList.remove('hidden');
        viewTableContainer.classList.add('hidden');
        if (currentScheduleData) renderDailyCards(currentScheduleData);
    });

    btnViewTable.addEventListener('click', () => {
        currentViewMode = 'table';
        btnViewTable.classList.add('active');
        btnViewCards.classList.remove('active');
        viewTableContainer.classList.remove('hidden');
        viewCardsContainer.classList.add('hidden');
    });
}

function setupCustomSelect() {
    // Toggle dropdown
    selectTrigger.addEventListener('click', () => {
        if (!citySelect.disabled) {
            customSelectWrapper.classList.toggle('open');
            if (customSelectWrapper.classList.contains('open')) {
                citySearch.focus();
            }
        }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!customSelectWrapper.contains(e.target)) {
            customSelectWrapper.classList.remove('open');
        }
    });

    // Search functionality
    citySearch.addEventListener('input', (e) => {
        filterOptions(e.target.value);
    });
}

function filterOptions(searchTerm) {
    const term = searchTerm.toLowerCase();
    const options = optionsList.querySelectorAll('li');
    let hasResults = false;

    options.forEach(option => {
        if (option.classList.contains('no-result')) return;

        const text = option.textContent.toLowerCase();
        if (text.includes(term)) {
            option.style.display = 'block';
            hasResults = true;
        } else {
            option.style.display = 'none';
        }
    });

    // Handle no results
    let noResultMsg = optionsList.querySelector('.no-result');
    if (!hasResults) {
        if (!noResultMsg) {
            noResultMsg = document.createElement('li');
            noResultMsg.className = 'no-result';
            noResultMsg.textContent = 'Kota tidak ditemukan';
            optionsList.appendChild(noResultMsg);
        } else {
            noResultMsg.style.display = 'block';
        }
    } else if (noResultMsg) {
        noResultMsg.style.display = 'none';
    }
}

async function fetchCities() {
    try {
        const response = await fetch('https://api.myquran.com/v2/sholat/kota/semua');
        const result = await response.json();

        if (result.status) {
            cities = result.data;
            populateCityDropdown();

            // Check localStorage for saved city, otherwise default to Jakarta (ID: 1301)
            const savedCityId = localStorage.getItem('ramadhan_selected_city');
            const defaultCityId = savedCityId && cities.find(c => c.id === savedCityId) ? savedCityId : '1301';

            selectCity(defaultCityId);
            citySelect.disabled = false;
        } else {
            showError();
        }
    } catch (err) {
        console.error('Error fetching cities:', err);
        showError();
    }
}

function populateCityDropdown() {
    optionsList.innerHTML = '';
    citySelect.innerHTML = ''; // Keep native select in sync

    // Sort cities alphabetically
    cities.sort((a, b) => a.lokasi.localeCompare(b.lokasi));

    cities.forEach(city => {
        // Native option
        const option = document.createElement('option');
        option.value = city.id;
        option.textContent = city.lokasi;
        citySelect.appendChild(option);

        // Custom option
        const li = document.createElement('li');
        li.dataset.value = city.id;
        li.textContent = city.lokasi;

        li.addEventListener('click', () => {
            selectCity(city.id);
            customSelectWrapper.classList.remove('open');
            citySearch.value = ''; // Clear search on select
            filterOptions(''); // Reset filter
        });

        optionsList.appendChild(li);
    });
}

function selectCity(cityId) {
    selectedCityId = cityId;
    const city = cities.find(c => c.id === cityId);

    if (city) {
        selectedCityText.textContent = city.lokasi;
        citySelect.value = cityId; // Keep native select in sync

        // Save to Local Storage
        localStorage.setItem('ramadhan_selected_city', cityId);

        // Update selected class
        const options = optionsList.querySelectorAll('li');
        options.forEach(opt => {
            if (opt.dataset.value === cityId) opt.classList.add('selected');
            else opt.classList.remove('selected');
        });

        fetchSchedule(cityId);
    }
}

async function fetchSchedule(cityId) {
    showLoading();

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    try {
        const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${year}/${month}`);
        const result = await response.json();

        if (result.status) {
            renderSchedule(result.data);
            hideStatus();
        } else {
            showError();
        }
    } catch (err) {
        console.error('Error fetching schedule:', err);
        showError();
    }
}

function renderSchedule(data) {
    currentScheduleData = data;
    locationName.textContent = data.lokasi;

    // Setup Table View
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    scheduleBody.innerHTML = '';

    data.jadwal.forEach(item => {
        const tr = document.createElement('tr');

        if (item.date === todayStr) {
            tr.classList.add('today');
        }

        tr.innerHTML = `
            <td>${item.tanggal}</td>
            <td>${item.imsak}</td>
            <td>${item.subuh}</td>
            <td>${item.dzuhur}</td>
            <td>${item.ashar}</td>
            <td>${item.maghrib}</td>
            <td>${item.isya}</td>
        `;

        scheduleBody.appendChild(tr);
    });

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    currentMonthEl.textContent = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

    // Render active view
    if (currentViewMode === 'cards') {
        renderDailyCards(data);
    }
}

function renderDailyCards(data) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    // Find today's schedule or fallback to first day
    let todaySchedule = data.jadwal.find(item => item.date === todayStr);

    if (!todaySchedule) {
        // If today is not in the schedule (e.g. wrong month loaded), just show the first day
        todaySchedule = data.jadwal[0];
    }

    dailyDateDisplay.textContent = todaySchedule.tanggal;

    // In a real app we would use a Hijri converter API here. 
    // For this challenge, we use a static string based on the design requirement
    dailyHijriDisplay.textContent = 'Ramadhan 1447 H';

    // Determine next prayer for highlight
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const prayers = [
        { name: 'Imsak', time: todaySchedule.imsak },
        { name: 'Subuh', time: todaySchedule.subuh },
        { name: 'Dzuhur', time: todaySchedule.dzuhur },
        { name: 'Ashar', time: todaySchedule.ashar },
        { name: 'Maghrib', time: todaySchedule.maghrib },
        { name: 'Isya', time: todaySchedule.isya }
    ];

    let nextPrayerIndex = -1;
    for (let i = 0; i < prayers.length; i++) {
        const [h, m] = prayers[i].time.split(':').map(Number);
        const prayerMinutes = h * 60 + m;
        if (currentTime < prayerMinutes) {
            nextPrayerIndex = i;
            break;
        }
    }
    // If all prayers passed, next is Imsak tomorrow
    if (nextPrayerIndex === -1) nextPrayerIndex = 0;

    dailyGrid.innerHTML = '';

    prayers.forEach((prayer, index) => {
        const isHighlight = index === nextPrayerIndex;

        const card = document.createElement('div');
        card.className = `prayer-card ${isHighlight ? 'highlight' : ''}`;

        card.innerHTML = `
            <div class="prayer-name">${prayer.name}</div>
            <div class="prayer-time">${prayer.time}</div>
        `;

        dailyGrid.appendChild(card);
    });

    // Start Live Countdown
    startLiveCountdown(todaySchedule, prayers, nextPrayerIndex);
}

function startLiveCountdown(todaySchedule, prayers, nextPrayerIndex) {
    if (countdownInterval) clearInterval(countdownInterval);

    // If next prayer is tomorrow's Imsak (index 0 but tomorrow), we simplify it 
    // by just asking user to wait for tomorrow. For a full implementation we'd grab tomorrow's schedule.
    let targetTimeStr = prayers[nextPrayerIndex].time;
    countdownText.textContent = prayers[nextPrayerIndex].name;

    const updateTimer = () => {
        const now = new Date();
        const currentH = now.getHours();
        const currentM = now.getMinutes();
        const currentS = now.getSeconds();

        const [targetH, targetM] = targetTimeStr.split(':').map(Number);

        let targetDate = new Date();
        targetDate.setHours(targetH, targetM, 0, 0);

        // If next prayer is Imsak and we are past Isya, target is tomorrow
        if (nextPrayerIndex === 0 && (currentH > 19 || (currentH === 19 && currentM > 30))) {
            targetDate.setDate(targetDate.getDate() + 1);
        }

        const diffMs = targetDate - now;

        if (diffMs <= 0) {
            // Time is up! Refresh the cards to get the next prayer
            clearInterval(countdownInterval);
            countdownTimer.textContent = "00 : 00 : 00";
            countdownContainer.classList.remove('urgent');
            if (currentScheduleData) {
                setTimeout(() => renderDailyCards(currentScheduleData), 1000);
            }
            return;
        }

        // Add urgent pulse class if less than 5 minutes remain (300,000 ms)
        if (diffMs <= 300000) {
            countdownContainer.classList.add('urgent');
        } else {
            countdownContainer.classList.remove('urgent');
        }

        // Fasting Progress Logic
        const isFastingPeriod = currentH > Math.floor(prayers[0].time.split(':')[0]) ||
            (currentH === Math.floor(prayers[0].time.split(':')[0]) && currentM >= Math.floor(prayers[0].time.split(':')[1]));
        const isBeforeMaghrib = currentH < Math.floor(prayers[4].time.split(':')[0]) ||
            (currentH === Math.floor(prayers[4].time.split(':')[0]) && currentM < Math.floor(prayers[4].time.split(':')[1]));

        if (isFastingPeriod && isBeforeMaghrib) {
            fastingProgressContainer.classList.remove('hidden');

            const imsakParts = prayers[0].time.split(':').map(Number);
            const maghribParts = prayers[4].time.split(':').map(Number);

            progressStartTime.textContent = prayers[0].time;
            progressEndTime.textContent = prayers[4].time;

            const startMs = new Date().setHours(imsakParts[0], imsakParts[1], 0, 0);
            const endMs = new Date().setHours(maghribParts[0], maghribParts[1], 0, 0);
            const totalFastingMs = endMs - startMs;
            const elapsedMs = now - startMs;

            let percentage = (elapsedMs / totalFastingMs) * 100;
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;

            fastingProgressBar.style.width = `${percentage}%`;
            fastingProgressText.textContent = `${percentage.toFixed(1)}% Puasa Selesai`;

        } else {
            fastingProgressContainer.classList.add('hidden');
        }

        const h = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diffMs % (1000 * 60)) / 1000);

        countdownTimer.textContent = `${String(h).padStart(2, '0')} : ${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')}`;
    };

    updateTimer(); // Initial call
    countdownInterval = setInterval(updateTimer, 1000);
}

function retryFetch() {
    if (citySelect.value) {
        fetchSchedule(citySelect.value);
    } else {
        fetchCities();
    }
}

function showLoading() {
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    scheduleContent.classList.add('hidden');
}

function showError() {
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
    scheduleContent.classList.add('hidden');
}

function hideStatus() {
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    scheduleContent.classList.remove('hidden');
}
