document.addEventListener('DOMContentLoaded', () => {

    const STORAGE_KEY = 'ramadhanApp_misi4_data';

    let defaultData = {
        lastSavedDate: new Date().toDateString(),
        gender: null,
        shalat: {
            subuh: { checked: false, isLate: false },
            dzuhur: { checked: false, isLate: false },
            ashar: { checked: false, isLate: false },
            maghrib: { checked: false, isLate: false },
            isya: { checked: false, isLate: false }
        },
        quran: { target: 20, read: 0, done: false, targetLastUpdate: null },
        puasa: { todayChecked: false, checkedDays: [], puasaDetails: {} },
        dzikir: { subhanallah: 0, alhamdulillah: 0, allahuakbar: 0 }
    };

    let appData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;

    appData = { ...defaultData, ...appData };
    appData.shalat = { ...defaultData.shalat, ...appData.shalat };

    for (const key in appData.shalat) {
        if (typeof appData.shalat[key] === 'boolean') {
            appData.shalat[key] = { checked: appData.shalat[key], isLate: false };
        }
    }

    appData.quran = { ...defaultData.quran, ...appData.quran };
    appData.puasa = { ...defaultData.puasa, ...appData.puasa };
    appData.puasa.checkedDays = appData.puasa.checkedDays || [];
    appData.puasa.puasaDetails = appData.puasa.puasaDetails || {};
    appData.dzikir = { ...defaultData.dzikir, ...appData.dzikir };

    const todayStr = new Date().toDateString();
    if (!appData.lastSavedDate || appData.lastSavedDate !== todayStr) {

        for (const key in appData.shalat) {
            appData.shalat[key] = { checked: false, isLate: false };
        }

        appData.quran.read = 0;
        appData.quran.done = false;

        appData.puasa.todayChecked = false;

        appData.lastSavedDate = todayStr;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    }

    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(`tab-${targetId}`).classList.add('active');
        });
    });

    const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('global-date').textContent = new Date().toLocaleDateString('id-ID', dateOpts);

    function saveToStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
        calculateGlobalProgress();
    }

    const shalatChecks = document.querySelectorAll('.shalat-check');

    function initShalatUI() {
        fetchShalatSchedule();

        shalatChecks.forEach(check => {
            const val = check.value;
            const isChecked = appData.shalat[val].checked;
            check.checked = isChecked;

            if (isChecked) {
                check.disabled = true;
            }

            if (isChecked && appData.shalat[val].isLate) {
                markAsLate(check);
            }

            check.addEventListener('change', (e) => {
                const currentChecked = e.target.checked;

                if (currentChecked) {

                    if (!isShalatTimeReached(val)) {
                        e.target.checked = false;
                        const shalatDisplay = val.charAt(0).toUpperCase() + val.slice(1);
                        showToast(`Belum masuk waktu ${shalatDisplay}.`, 'warning');
                        return;
                    }

                    e.target.disabled = true;

                    const isLate = checkIsLate(val);
                    appData.shalat[val].isLate = isLate;
                    if (isLate) {
                        markAsLate(check);
                    } else {
                        removeLateMark(check);
                    }
                } else {
                    appData.shalat[val].isLate = false;
                    removeLateMark(check);
                }

                appData.shalat[val].checked = currentChecked;

                updateShalatStats();
                calculateGlobalProgress();
                saveToStorage();
            });
        });
        updateShalatStats();
        initDigitalClock();
    }

    function initDigitalClock() {
        const clockEl = document.getElementById('digital-clock');
        if (!clockEl) return;

        function updateClock() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            clockEl.textContent = `${hours}:${minutes}:${seconds}`;
        }

        updateClock();
        setInterval(updateClock, 1000);
    }

    function markAsLate(checkboxElement) {
        const parentLabel = checkboxElement.closest('label');
        if (!parentLabel.classList.contains('late-check')) {
            parentLabel.classList.add('late-check');
            const badge = document.createElement('span');
            badge.className = 'late-badge';
            badge.textContent = 'Terlewat';
            parentLabel.appendChild(badge);
        }
    }

    function removeLateMark(checkboxElement) {
        const parentLabel = checkboxElement.closest('label');
        parentLabel.classList.remove('late-check');
        const badge = parentLabel.querySelector('.late-badge');
        if (badge) {
            badge.remove();
        }
    }

    function isShalatTimeReached(shalatName) {
        if (!appData.shalatSchedule || !appData.shalatSchedule[shalatName]) return true;

        const now = new Date();
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

        const getMinutes = (timeStr) => {
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
        };

        const shalatTimeInMinutes = getMinutes(appData.shalatSchedule[shalatName]);
        return currentTimeInMinutes >= shalatTimeInMinutes;
    }

    function checkIsLate(shalatName) {
        if (!appData.shalatSchedule || !appData.shalatSchedule[shalatName]) return false;

        const now = new Date();
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

        const getMinutes = (timeStr) => {
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
        };

        const shalatOrder = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
        const currentIndex = shalatOrder.indexOf(shalatName);

        let nextShalatInMinutes;

        if (currentIndex < shalatOrder.length - 1) {

            const nextShalatName = shalatOrder[currentIndex + 1];
            nextShalatInMinutes = getMinutes(appData.shalatSchedule[nextShalatName]);
        } else {

            nextShalatInMinutes = 24 * 60;
        }

        if (currentTimeInMinutes >= nextShalatInMinutes) {
            return true;
        }

        return false;
    }

    async function fetchShalatSchedule() {
        const todayStr = new Date().toDateString();
        const locTextEl = document.getElementById('location-text');

        if (appData.shalatScheduleDate === todayStr && appData.shalatSchedule) {
            updateShalatTimeDOM();
            if (locTextEl) locTextEl.textContent = appData.shalatLocationName || '📍 Jakarta';
            return;
        }

        const fallbackFetch = async () => {
            try {
                const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=11');
                const data = await response.json();
                processShalatData(data.data.timings, '📍 Jakarta (Default)');
            } catch (error) {
                console.error('Failed to fetch fallback schedule:', error);
            }
        };

        if ('geolocation' in navigator) {
            if (locTextEl) locTextEl.textContent = '📍 Mendeteksi...';
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=11`);
                    const data = await response.json();

                    let regionName = 'Lokasi Anda (GPS)';
                    try {
                        const geoResp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
                        const geoData = await geoResp.json();
                        regionName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state_district || 'Lokasi Anda';
                        regionName = `📍 ${regionName}`;
                    } catch (geoErr) {
                        console.error('Reverse Geocoding failed:', geoErr);
                    }

                    processShalatData(data.data.timings, regionName);
                } catch (error) {
                    console.error('Failed to fetch coords schedule:', error);
                    fallbackFetch();
                }
            }, (error) => {
                console.log('Geolocation denied/failed. Falling back to Jakarta.', error);
                fallbackFetch();
            });
        } else {
            fallbackFetch();
        }

        function processShalatData(timings, locName) {
            appData.shalatSchedule = {
                subuh: timings.Fajr,
                dzuhur: timings.Dhuhr,
                ashar: timings.Asr,
                maghrib: timings.Maghrib,
                isya: timings.Isha
            };
            appData.shalatScheduleDate = todayStr;
            appData.shalatLocationName = locName;

            if (locTextEl) locTextEl.textContent = locName;

            saveToStorage();
            updateShalatTimeDOM();
        }
    }

    function updateShalatTimeDOM() {
        if (!appData.shalatSchedule) return;
        ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].forEach(type => {
            const timeEl = document.getElementById(`time-${type}`);
            if (timeEl && appData.shalatSchedule[type]) {
                timeEl.textContent = appData.shalatSchedule[type];
            }
        });
    }

    function updateShalatStats() {
        let total = 5;
        let done = 0;
        Object.values(appData.shalat).forEach(val => val.checked && done++);

        let percentage = Math.round((done / total) * 100);
        document.getElementById('shalat-progress-fill').style.width = `${percentage}%`;

        let status = '';
        if (percentage <= 40) status = 'Belum optimal';
        else if (percentage <= 80) status = 'Cukup baik';
        else status = 'MasyaAllah lengkap!';

        document.getElementById('shalat-status-text').textContent = `${percentage}% - ${status}`;
    }

    document.getElementById('btn-save-shalat').addEventListener('click', () => {
        saveToStorage();
        showToast('Data shalat berhasil disimpan!', 'success');
    });

    const qQuranTarget = document.getElementById('quran-target');
    const qBtnEditTarget = document.getElementById('btn-edit-target');
    const qQuranRead = document.getElementById('quran-read');
    const qQuranDone = document.getElementById('quran-done-check');

    function initQuranUI() {

        if (appData.quran.targetLastUpdate === undefined) {
            appData.quran.targetLastUpdate = null;
        }

        qQuranTarget.value = appData.quran.target;
        qQuranRead.value = appData.quran.read;
        qQuranDone.checked = appData.quran.done;

        qQuranTarget.disabled = true;

        if (qBtnEditTarget) {
            qBtnEditTarget.addEventListener('click', () => {

                if (!appData.quran.targetLastUpdate) {
                    qQuranTarget.disabled = false;
                    qQuranTarget.focus();
                    showToast("Target tilawah harian baru diset. Silakan tentukan targetmu!", 'success');

                    return;
                }

                const lastUpdate = new Date(appData.quran.targetLastUpdate);
                const now = new Date();

                lastUpdate.setHours(0, 0, 0, 0);
                now.setHours(0, 0, 0, 0);

                const diffTime = Math.abs(now - lastUpdate);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays >= 3) {
                    qQuranTarget.disabled = false;
                    qQuranTarget.focus();

                    showToast("Konsistensi terjaga! Anda dapat memperbarui target tilawah hari ini.", 'success');
                } else {
                    const daysLeft = 3 - diffDays;
                    showToast(`Target membaca Qur'an terkunci demi konsistensi. Bisa diubah ${daysLeft} hari lagi.`, 'warning');
                }
            });
        }

        qQuranTarget.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                qQuranTarget.disabled = true;
                showToast("Target tilawah harian telah disimpan dan dikunci.", 'success');
            }
        });

        qQuranTarget.addEventListener('blur', () => {
            qQuranTarget.disabled = true;
        });

        if (appData.quran.done) {
            lockQuranUI();
        }

        [qQuranTarget, qQuranRead].forEach(el => {
            el.addEventListener('input', () => {
                appData.quran.target = parseInt(qQuranTarget.value) || 1;
                let currentRead = parseInt(qQuranRead.value) || 0;

                appData.quran.read = currentRead;

                const today = new Date().toDateString();
                if (appData.quran.targetLastUpdate !== today) {
                    appData.quran.targetLastUpdate = today;
                    saveToStorage();
                }

                updateQuranStats();
                calculateGlobalProgress();
                saveToStorage();
            });
        });

        qQuranDone.addEventListener('change', (e) => {
            if (e.target.checked) {
                appData.quran.done = true;
                appData.quran.read = appData.quran.target;
                qQuranRead.value = appData.quran.target;
                lockQuranUI();
            }
            updateQuranStats();
            calculateGlobalProgress();
            saveToStorage();
        });

        updateQuranStats();
    }

    function lockQuranUI() {
        qQuranRead.disabled = true;
        qQuranRead.style.cursor = 'not-allowed';
        qQuranRead.style.opacity = '0.7';

        qQuranDone.disabled = true;
        qQuranDone.style.cursor = 'not-allowed';

        if (qBtnEditTarget) {
            qBtnEditTarget.disabled = true;
            qBtnEditTarget.style.cursor = 'not-allowed';
            qBtnEditTarget.style.opacity = '0.5';
        }
    }

    function updateQuranStats() {
        let target = appData.quran.target;
        let read = appData.quran.read;
        let percentage = target > 0 ? Math.round((read / target) * 100) : 0;

        if (appData.quran.done && percentage < 100) percentage = 100;

        const visualPercentage = Math.min(percentage, 100);
        document.getElementById('quran-progress-fill').style.width = `${visualPercentage}%`;

        let status = '';
        if (percentage < 50) {
            status = 'Bismillah, mari mulai perlahan.';
        } else if (percentage < 100) {
            status = 'MasyaAllah, sedikit lagi target tercapai!';
        } else if (percentage === 100) {
            status = 'Alhamdulillah, target tercapai sempurna! ✨';
        } else {
            status = 'Luar Biasa! Bonus Ibadah - Teruslah Mendulang Pahala! 🔥✨';
        }

        document.getElementById('quran-status-text').textContent = `${percentage}% - ${status}`;
    }

    document.getElementById('btn-save-quran').addEventListener('click', () => {
        saveToStorage();
        showToast("Data tadarus Qur'an berhasil disimpan!", 'success');
    });

    const puasaCalendar = document.getElementById('puasa-calendar');
    const puasaTodayCheck = document.getElementById('puasa-today-check');

    function getCurrentRamadanDay() {

        const ramadhanStart = new Date(2026, 1, 19);
        const today = new Date();

        ramadhanStart.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = today - ramadhanStart;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (diffDays < 1) return 1;
        if (diffDays > 30) return 30;
        return diffDays;
    }

    function completeTodayPuasa() {
        const todayDay = getCurrentRamadanDay();
        appData.puasa.todayChecked = true;

        if (!appData.puasa.checkedDays.includes(todayDay)) {
            appData.puasa.checkedDays.push(todayDay);
        }

        puasaTodayCheck.checked = true;
        puasaTodayCheck.disabled = true;

        updatePuasaCalendarUI();
        updatePuasaStats();
        calculateGlobalProgress();
        saveToStorage();
    }

    function updatePuasaCalendarUI() {
        puasaCalendar.innerHTML = '';
        let todayDay = getCurrentRamadanDay();

        for (let i = 1; i <= 30; i++) {
            let div = document.createElement('div');
            div.className = 'calendar-day';

            const isToday = (i === todayDay);
            const status = appData.puasa.puasaDetails[i];

            if (i > todayDay) {
                div.classList.add('future');
                div.title = "Belum waktunya";
            }

            if (status) {
                const classToAdd = (status === 'puasa') ? 'checked' : status;
                div.classList.add(classToAdd);
                div.style.cursor = 'not-allowed';
                div.title = "Data sudah terkunci";
            }

            div.innerHTML = `<span>${i}</span>`;

            if (i <= todayDay) {
                div.addEventListener('click', () => {
                    if (status) {
                        showToast("Data hari ini sudah terkunci dan tidak bisa diubah.", "error");
                        return;
                    }
                    openPuasaStatusModal(i);
                });
            }

            puasaCalendar.appendChild(div);
        }
    }

    const genderModal = document.getElementById('gender-modal');
    const puasaStatusModal = document.getElementById('puasa-status-modal');
    const puasaModalDateTitle = document.getElementById('puasa-modal-date-title');
    const puasaStatusButtons = document.querySelectorAll('.btn-status-puasa, .btn-status-halangan, .btn-status-tidak');

    const infoModal = document.getElementById('info-modal');
    const infoModalTitle = document.getElementById('info-modal-title');
    const infoModalMsg = document.getElementById('info-modal-msg');

    let activeEditingDay = null;

    function openInfoModal(title, message) {
        infoModalTitle.textContent = title;
        infoModalMsg.textContent = message;
        infoModal.classList.remove('hidden');
    }

    document.getElementById('close-info-modal').addEventListener('click', () => {
        infoModal.classList.add('hidden');
    });

    function initGenderLogic() {
        if (!appData.gender) {
            genderModal.classList.remove('hidden');
        }

        document.getElementById('gender-male-btn').addEventListener('click', () => {
            appData.gender = 'laki-laki';
            saveToStorage();
            genderModal.classList.add('hidden');
            showToast("Profil Laki-laki disimpan", "success");
        });

        document.getElementById('gender-female-btn').addEventListener('click', () => {
            appData.gender = 'perempuan';
            saveToStorage();
            genderModal.classList.add('hidden');
            showToast("Profil Perempuan disimpan", "success");
        });
    }

    function openPuasaStatusModal(dayNum) {
        activeEditingDay = dayNum;
        puasaModalDateTitle.textContent = `Status Puasa: Hari ke-${dayNum}`;

        const halanganBtn = document.getElementById('btn-halangan');
        if (appData.gender === 'perempuan') {
            halanganBtn.textContent = "Lagi Halangan / Sakit";
        } else {
            halanganBtn.textContent = "Sedang Sakit / Udzur";
        }

        puasaStatusModal.classList.remove('hidden');
    }

    puasaStatusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const status = btn.getAttribute('data-status');
            const todayDay = getCurrentRamadanDay();

            appData.puasa.puasaDetails[activeEditingDay] = status;

            if (status === 'puasa') {
                if (!appData.puasa.checkedDays.includes(activeEditingDay)) {
                    appData.puasa.checkedDays.push(activeEditingDay);
                }
            } else {
                appData.puasa.checkedDays = appData.puasa.checkedDays.filter(d => d !== activeEditingDay);
            }

            if (activeEditingDay === todayDay) {
                appData.puasa.todayChecked = (status === 'puasa');
                puasaTodayCheck.checked = appData.puasa.todayChecked;
                if (status) puasaTodayCheck.disabled = true;
            }

            puasaStatusModal.classList.add('hidden');
            updatePuasaCalendarUI();
            updatePuasaStats();
            calculateGlobalProgress();
            saveToStorage();

            if (status === 'halangan' || status === 'tidak-puasa') {
                let advice = "";
                if (status === 'halangan') {
                    advice = (appData.gender === 'perempuan')
                        ? "Jangan lupa ganti (Qadha) puasa ya nanti setelah bulan Ramadhan! ✨"
                        : "Jangan lupa istirahat dan minum obat ya agar lekas pulih dan bisa melanjutkan ibadah lagi. ✨";
                } else {
                    advice = "Jangan lupa ganti (Qadha) puasa ya nanti, dan pastikan tetap menjaga kesehatan selama Ramadhan! ✨";
                }

                openInfoModal("Pesan Semangat", advice);
            } else {
                showToast("Alhamdulillah, semoga berkah puasanya! ✨", "success");
            }
        });
    });

    document.getElementById('close-puasa-modal').addEventListener('click', () => {
        puasaStatusModal.classList.add('hidden');
    });

    function initPuasaUI() {
        const todayDay = getCurrentRamadanDay();
        const statusToday = appData.puasa.puasaDetails[todayDay];

        puasaTodayCheck.checked = (statusToday === 'puasa');

        if (statusToday) {
            puasaTodayCheck.disabled = true;
        }

        puasaTodayCheck.addEventListener('change', (e) => {
            if (e.target.checked) {
                completeTodayPuasa();
            }
        });

        updatePuasaCalendarUI();
        updatePuasaStats();
    }

    function updatePuasaStats() {
        let total = 30;
        let checked = appData.puasa.checkedDays.length;
        let percentage = Math.round((checked / total) * 100);

        let debtCount = 0;
        for (const day in appData.puasa.puasaDetails) {
            const status = appData.puasa.puasaDetails[day];
            if (status === 'halangan' || status === 'tidak-puasa') {
                debtCount++;
            }
        }

        let todayDay = getCurrentRamadanDay();
        document.getElementById('puasa-day-indicator').textContent = `Hari ke-${todayDay}`;
        document.getElementById('puasa-progress-fill').style.width = `${percentage}%`;
        document.getElementById('puasa-status-text').textContent = `${checked}/30 Hari Puasa - Semangat!`;

        const qadhaEl = document.getElementById('puasa-qadha-text');
        if (debtCount > 0) {
            qadhaEl.textContent = `Hutang: ${debtCount} Hari (Qadha)`;
        } else {
            qadhaEl.textContent = "";
        }
    }

    document.getElementById('btn-save-puasa').addEventListener('click', () => {
        saveToStorage();
        showToast('Data puasa berhasil disimpan!', 'success');
    });

    const currentCountElement = document.getElementById('current-count');
    const targetCountElement = document.getElementById('target-count');
    const notificationArea = document.getElementById('notification-area');
    const addBtn = document.getElementById('add-btn');
    const resetBtn = document.getElementById('reset-btn');
    const dzikirTypeSelect = document.getElementById('dzikir-type');
    const dzikirTextContainer = document.getElementById('dzikir-text-container');
    const dzikirArabic = document.getElementById('dzikir-arabic');
    const dzikirLatin = document.getElementById('dzikir-latin');
    const dzikirProgressBar = document.getElementById('dzikir-progress-bar');
    const totalDailyCountElement = document.getElementById('total-daily-count');

    const resetModal = document.getElementById('reset-modal');
    const cancelResetBtn = document.getElementById('cancel-reset-btn');
    const confirmResetBtn = document.getElementById('confirm-reset-btn');

    let dzikirCount = 0;
    let dzikirTarget = 33;
    let dzikirTotalDailyCount = 0;
    let currentDzikirId = 'subhanallah';

    function handleDzikirChange() {
        const selectedOption = dzikirTypeSelect.options[dzikirTypeSelect.selectedIndex];
        currentDzikirId = dzikirTypeSelect.value;

        dzikirCount = parseInt(localStorage.getItem(`misi4_dzikir_count_${currentDzikirId}`)) || 0;
        dzikirTarget = parseInt(selectedOption.getAttribute('data-target'));

        const textArabic = selectedOption.getAttribute('data-arabic');
        const textLatin = selectedOption.getAttribute('data-latin');

        if (textArabic && textArabic.trim() !== '') {
            dzikirArabic.textContent = textArabic;
            dzikirLatin.textContent = textLatin;
            dzikirTextContainer.classList.remove('hidden');
        } else {
            dzikirTextContainer.classList.add('hidden');
        }

        notificationArea.style.position = 'absolute';
        notificationArea.classList.add('hidden');

        updateDzikirDOM();
        checkDzikirTarget();
    }

    function updateDzikirDOM() {
        currentCountElement.textContent = dzikirCount;
        targetCountElement.textContent = dzikirTarget;
        totalDailyCountElement.textContent = dzikirTotalDailyCount;

        const progressPercentage = Math.min((dzikirCount / dzikirTarget) * 100, 100);
        dzikirProgressBar.style.width = `${progressPercentage}%`;

        if (dzikirCount >= dzikirTarget && dzikirTarget > 0) {
            dzikirProgressBar.classList.add('complete');
        } else {
            dzikirProgressBar.classList.remove('complete');
        }
    }

    function checkDzikirTarget() {
        if (dzikirCount === dzikirTarget && dzikirCount > 0) {
            if ('vibrate' in navigator) {
                navigator.vibrate([100, 50, 100]);
            }
            notificationArea.textContent = 'Alhamdulillah, target tercapai! ✨';
            notificationArea.style.position = 'relative';
            notificationArea.classList.remove('hidden');
        } else if (dzikirCount > dzikirTarget) {
            notificationArea.textContent = 'MasyaAllah, dzikir melebihi target! ✨';
            notificationArea.style.position = 'relative';
            notificationArea.classList.remove('hidden');
        } else {
            notificationArea.style.position = 'absolute';
            notificationArea.classList.add('hidden');
        }
    }

    function saveDzikirToStorage() {
        localStorage.setItem(`misi4_dzikir_count_${currentDzikirId}`, dzikirCount);
        const today = new Date().toDateString();
        localStorage.setItem('misi4_dzikir_date', today);
        localStorage.setItem('misi4_dzikir_total_daily', dzikirTotalDailyCount);
    }

    function initDzikirUI() {
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('misi4_dzikir_date');

        if (savedDate !== today) {
            dzikirTotalDailyCount = 0;
            const options = dzikirTypeSelect.options;
            for (let i = 0; i < options.length; i++) {
                localStorage.removeItem(`misi4_dzikir_count_${options[i].value}`);
            }
            saveDzikirToStorage();
        } else {
            dzikirTotalDailyCount = parseInt(localStorage.getItem('misi4_dzikir_total_daily')) || 0;
        }

        handleDzikirChange();

        dzikirTypeSelect.addEventListener('change', () => {
            handleDzikirChange();
        });

        addBtn.addEventListener('click', () => {
            dzikirCount++;
            dzikirTotalDailyCount++;

            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }

            updateDzikirDOM();
            saveDzikirToStorage();

            currentCountElement.classList.remove('pop');
            void currentCountElement.offsetWidth;
            currentCountElement.classList.add('pop');

            checkDzikirTarget();
        });

        resetBtn.addEventListener('click', () => {
            resetModal.classList.remove('hidden');
        });

        cancelResetBtn.addEventListener('click', () => {
            resetModal.classList.add('hidden');
        });

        resetModal.addEventListener('click', (e) => {
            if (e.target === resetModal) {
                resetModal.classList.add('hidden');
            }
        });

        confirmResetBtn.addEventListener('click', () => {
            dzikirCount = 0;
            updateDzikirDOM();
            saveDzikirToStorage();

            notificationArea.style.position = 'absolute';
            notificationArea.classList.add('hidden');

            resetModal.classList.add('hidden');
        });
    }

    function calculateGlobalProgress() {
        let shalatDone = 0;
        Object.values(appData.shalat).forEach(v => v.checked && shalatDone++);
        let shalatPct = (shalatDone / 5);

        let quranPct = 0;
        if (appData.quran.done) {
            quranPct = 1;
        } else if (appData.quran.target > 0) {
            quranPct = Math.min(appData.quran.read / appData.quran.target, 1);
        }

        let puasaPct = appData.puasa.todayChecked ? 1 : 0;

        let totalPct = Math.round(((shalatPct + quranPct + puasaPct) / 3) * 100);

        const circle = document.getElementById('global-progress-circle');
        circle.style.background = `conic-gradient(#03522f ${totalPct}%, #e2e8f0 0%)`;
        document.getElementById('global-progress-text').textContent = `${totalPct}%`;

        const motiTitle = document.getElementById('motivation-title');
        const motiDesc = document.getElementById('motivation-desc');

        if (totalPct === 100) {
            motiTitle.textContent = "Alhamdulillah, Sempurna!";
            motiDesc.textContent = "Pertahankan semangat ibadahmu hari ini.";
        } else if (totalPct >= 50) {
            motiTitle.textContent = "Masih Semangat!";
            motiDesc.textContent = "Sebentar lagi target ibadah harianmu terpenuhi.";
        } else {
            motiTitle.textContent = "Bismillah!";
            motiDesc.textContent = "Mari lengkapi ibadah harianmu hari ini.";
        }
    }

    initShalatUI();
    initQuranUI();
    initPuasaUI();
    initGenderLogic();
    initDzikirUI();
    calculateGlobalProgress();

    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.style.pointerEvents = 'auto';
        toast.style.cursor = 'pointer';
        toast.title = "Klik untuk menutup";

        let icon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#03522f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        if (type === 'error') icon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        else if (type === 'warning') icon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';

        toast.innerHTML = `
            <span class="toast-icon" style="display: flex; align-items: center;">${icon}</span>
            <span class="toast-msg" style="flex: 1;">${message}</span>
            <span style="font-size: 0.8rem; opacity: 0.6; margin-left: 10px;">✕</span>
        `;

        container.appendChild(toast);

        toast.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        });

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.add('show');
            });
        });

        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 400);
            }
        }, 8000);
    }
});
