// Ganti dengan URL Deployment Google Apps Script Anda
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzw7m0L1OqBdYUwzZjbEpfmgAdGvzm4B90SZkDPWQ2DNRhzu4RVv68PrUsiakevsPNKXQ/exec";

const form = document.getElementById('inventarisForm');
const btnSubmit = document.getElementById('btnSubmit');
const tableBody = document.getElementById('tableBody');

// Fungsi untuk mengambil data dari Google Sheets
async function loadData() {
    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();

        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center">Belum ada data inventaris.</td></tr>';
            return;
        }

        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${row[0] || '-'}</td>
                <td>${row[1] || '-'}</td>
                <td>${row[2] || '-'}</td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center" style="color:red;">Gagal memuat data dari Google Sheets.</td></tr>';
    }
}

// Fungsi untuk mengirim data ke Google Sheets
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    btnSubmit.disabled = true;
    btnSubmit.innerText = "Menyimpan...";

    const payload = {
        namaLab: document.getElementById('namaLab').value,
        namaKomputer: document.getElementById('namaKomputer').value,
        jenisKerusakan: document.getElementById('jenisKerusakan').value
    };

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Diperlukan untuk Google Apps Script cross-origin request
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        alert("Data berhasil disimpan!");
        form.reset();
        
        // Beri jeda 1 detik sebelum memuat data baru
        setTimeout(loadData, 1000);
    } catch (error) {
        console.error('Error posting data:', error);
        alert("Gagal menyimpan data.");
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerText = "Simpan Data";
    }
});

// Load data saat halaman pertama kali dibuka
loadData();
