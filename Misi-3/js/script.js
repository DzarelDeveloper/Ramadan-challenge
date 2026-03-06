document.addEventListener('DOMContentLoaded', () => {
    const zakatTypeSelect = document.getElementById('zakat-type');

    const formPenghasilan = document.getElementById('form-penghasilan');
    const formPerusahaan = document.getElementById('form-perusahaan');
    const formPerdagangan = document.getElementById('form-perdagangan');
    const formEmas = document.getElementById('form-emas');

    const labelTotal = document.getElementById('label-total');
    const labelNisab = document.getElementById('label-nisab');
    const labelZakatAmount = document.getElementById('label-zakat-amount');

    const inputGaji = document.getElementById('gaji');
    const inputPenghasilanLain = document.getElementById('penghasilan-lain');
    const inputJumlahPenghasilan = document.getElementById('jumlah-penghasilan');

    const tabBtns = document.querySelectorAll('.baznas-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const inputPendapatanJasa = document.getElementById('pendapatan-jasa');
    const inputAktivaLancar = document.getElementById('aktiva-lancar');
    const inputPasivaLancar = document.getElementById('pasiva-lancar');
    const inputJumlahPerusahaan = document.getElementById('jumlah-perusahaan');

    const inputAsetLancarPerdagangan = document.getElementById('aset-lancar-perdagangan');
    const inputLabaPerdagangan = document.getElementById('laba-perdagangan');
    const inputJumlahPerdagangan = document.getElementById('jumlah-perdagangan');

    const inputEmasRupiah = document.getElementById('emas-rupiah');

    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const sedekahBtn = document.getElementById('sedekah-btn');

    const emptyState = document.getElementById('empty-state');
    const emptyDesc = emptyState.querySelector('.empty-desc');
    const resultBox = document.getElementById('result-box');
    const inlineResultMessage = document.getElementById('inline-result-message');

    const resTotal = document.getElementById('res-total');
    const resNisab = document.getElementById('res-nisab');
    const resStatus = document.getElementById('res-status');
    const zakatAmountContainer = document.getElementById('zakat-amount-container');
    const resZakat = document.getElementById('res-zakat');

    const NISAB_BULAN = 7640114;
    const NISAB_TAHUN = 91681728;

    const formatNumber = (angka) => {
        return new Intl.NumberFormat('id-ID').format(angka);
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(angka);
    };

    const calculateJumlahPenghasilan = () => {
        const gaji = parseFloat(inputGaji.value) || 0;
        const lain = parseFloat(inputPenghasilanLain.value) || 0;
        inputJumlahPenghasilan.value = formatNumber(gaji + lain);
    };

    inputGaji.addEventListener('input', calculateJumlahPenghasilan);
    inputPenghasilanLain.addEventListener('input', calculateJumlahPenghasilan);

    const calculateJumlahPerusahaan = () => {
        const aktiva = parseFloat(inputAktivaLancar.value) || 0;
        const pasiva = parseFloat(inputPasivaLancar.value) || 0;
        let sum = aktiva - pasiva;
        if (sum < 0) sum = 0;
        inputJumlahPerusahaan.value = formatNumber(sum);
    };

    inputAktivaLancar.addEventListener('input', calculateJumlahPerusahaan);
    inputPasivaLancar.addEventListener('input', calculateJumlahPerusahaan);

    const calculateJumlahPerdagangan = () => {
        const aset = parseFloat(inputAsetLancarPerdagangan.value) || 0;
        const laba = parseFloat(inputLabaPerdagangan.value) || 0;
        inputJumlahPerdagangan.value = formatNumber(aset + laba);
    };

    inputAsetLancarPerdagangan.addEventListener('input', calculateJumlahPerdagangan);
    inputLabaPerdagangan.addEventListener('input', calculateJumlahPerdagangan);

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            tabBtns.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.add('hidden'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.remove('hidden');

            showEmptyState();
        });
    });

    const showEmptyState = () => {
        emptyState.classList.remove('hidden');
        resultBox.classList.add('hidden');
        inlineResultMessage.classList.add('hidden');
    };

    const showResultState = () => {
        emptyState.classList.add('hidden');
        resultBox.classList.remove('hidden');
    };

    const hideAllForms = () => {
        formPenghasilan.classList.add('hidden');
        formPerusahaan.classList.add('hidden');
        formPerdagangan.classList.add('hidden');
        formEmas.classList.add('hidden');
        inlineResultMessage.classList.add('hidden');
    };

    zakatTypeSelect.addEventListener('change', () => {
        const type = zakatTypeSelect.value;
        hideAllForms();

        if (type === 'penghasilan') {
            formPenghasilan.classList.remove('hidden');
            labelTotal.textContent = 'Total Penghasilan (Per Bulan):';
            labelNisab.textContent = 'Nisab Zakat Penghasilan (Per Bulan):';
            emptyDesc.textContent = 'Zakat penghasilan wajib ditunaikan jika penghasilan bulanan Anda (gaji + lain-lain) mencapai nisab sebesar 85 gram emas per bulan. Lengkapi form di sebelah kiri untuk melihat kewajiban zakat Anda (2,5%).';
        } else {
            if (type === 'perusahaan') {
                formPerusahaan.classList.remove('hidden');
                labelTotal.textContent = 'Total Aset Bersih Perusahaan:';
                emptyDesc.textContent = 'Zakat perusahaan dihitung dari aset bersih (total aktiva lancar dikurangi utang jangka pendek) yang telah berumur satu tahun (haul). Nisabnya setara 85 gram emas murni (2,5%).';
            } else if (type === 'perdagangan') {
                formPerdagangan.classList.remove('hidden');
                labelTotal.textContent = 'Total Harta Perdagangan Bersih:';
                emptyDesc.textContent = 'Zakat perdagangan dikenakan pada modal yang diputar, keuntungan, dan piutang lancar, dikurangi utang jatuh tempo. Jika melebihi nisab 85 gram emas per tahun, zakat wajib dikeluarkan (2,5%).';
            } else if (type === 'emas') {
                formEmas.classList.remove('hidden');
                labelTotal.textContent = 'Total Nilai Rupiah Emas:';
                emptyDesc.textContent = 'Zakat emas wajib ditunaikan bagi yang memiliki emas lebih dari nisab 85 gram selama setahun. Masukkan nilai rupiah emas Anda saat ini. Tarif zakat adalah 2,5%.';
            }
            labelNisab.textContent = 'Nilai Standar Nisab (85g Emas):';
        }

        showEmptyState();
    });

    resetBtn.addEventListener('click', () => {
        inputGaji.value = '';
        inputPenghasilanLain.value = '';
        inputJumlahPenghasilan.value = '0';

        inputPendapatanJasa.value = '';
        inputAktivaLancar.value = '';
        inputPasivaLancar.value = '';
        inputJumlahPerusahaan.value = '0';

        inputAsetLancarPerdagangan.value = '';
        inputLabaPerdagangan.value = '';
        inputJumlahPerdagangan.value = '0';

        inputEmasRupiah.value = '';

        showEmptyState();

        if (window.innerWidth <= 900) {
            document.querySelector('.calculator-form-container').scrollIntoView({ behavior: 'smooth' });
        }
    });

    calculateBtn.addEventListener('click', () => {
        const type = zakatTypeSelect.value;
        let total = 0;
        let nisab = 0;

        if (type === 'penghasilan') {
            const gaji = parseFloat(inputGaji.value) || 0;
            const lain = parseFloat(inputPenghasilanLain.value) || 0;
            total = gaji + lain;
            nisab = NISAB_BULAN;
            labelZakatAmount.textContent = 'Jumlah Zakat yang Harus Ditunaikan per Bulan:';

            if (total <= 0) {
                alert('Silakan masukkan jumlah penghasilan yang valid.');
                inputGaji.focus();
                return;
            }
        }
        else {
            nisab = NISAB_TAHUN;
            labelZakatAmount.textContent = 'Jumlah Zakat yang Harus Ditunaikan:';

            if (type === 'perusahaan') {
                const activeTab = document.querySelector('.baznas-tab.active').getAttribute('data-tab');

                if (activeTab === 'tab-jasa') {
                    const pendapatan = parseFloat(inputPendapatanJasa.value) || 0;
                    total = pendapatan;

                    if (pendapatan <= 0) {
                        alert('Silakan masukkan pendapatan sebelum pajak yang valid.');
                        inputPendapatanJasa.focus();
                        return;
                    }
                } else if (activeTab === 'tab-dagang') {
                    const aktiva = parseFloat(inputAktivaLancar.value) || 0;
                    const pasiva = parseFloat(inputPasivaLancar.value) || 0;
                    total = aktiva - pasiva;

                    if (aktiva <= 0) {
                        alert('Silakan masukkan nilai aktiva lancar yang valid.');
                        inputAktivaLancar.focus();
                        return;
                    }
                }
            }
            else if (type === 'perdagangan') {
                const aset = parseFloat(inputAsetLancarPerdagangan.value) || 0;
                const laba = parseFloat(inputLabaPerdagangan.value) || 0;
                total = aset + laba;

                if (aset <= 0) {
                    alert('Silakan masukkan nilai aset lancar dengan valid.');
                    inputAsetLancarPerdagangan.focus();
                    return;
                }
            }
            else if (type === 'emas') {
                const totalEmasRp = parseFloat(inputEmasRupiah.value) || 0;

                if (totalEmasRp <= 0) {
                    alert('Silakan masukkan nilai kepemilikan emas yang valid (Rp).');
                    inputEmasRupiah.focus();
                    return;
                }

                total = totalEmasRp;
            }
        }

        if (total < 0) total = 0;

        resNisab.textContent = formatRupiah(nisab);
        resTotal.textContent = formatRupiah(total);

        inlineResultMessage.classList.add('hidden');

        if (total >= nisab) {
            resStatus.textContent = 'Wajib Menunaikan Zakat';
            resStatus.className = 'result-value status-badge wajib';

            const zakatAmount = total * 0.025;
            resZakat.textContent = formatRupiah(zakatAmount);
            zakatAmountContainer.classList.remove('hidden');
        } else {
            resStatus.textContent = 'Belum Memenuhi Nisab (Tidak Wajib)';
            resStatus.className = 'result-value status-badge tidak-wajib';

            zakatAmountContainer.classList.add('hidden');

            if (type === 'penghasilan') {
                inlineResultMessage.classList.remove('hidden');
            }
        }

        showResultState();

        calculateBtn.style.transform = 'scale(0.95)';
        setTimeout(() => calculateBtn.style.transform = 'scale(1)', 150);

        if (window.innerWidth <= 900 && total >= nisab) {
            document.querySelector('.calculator-result-container').scrollIntoView({ behavior: 'smooth' });
        }
    });

    sedekahBtn.addEventListener('click', () => {
        alert('Fitur donasi sedekah akan segera hadir!');
    });
});
