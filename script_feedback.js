// Menangkap form dari HTML
const form = document.getElementById('feedback-form');

// Menambahkan 'event listener' saat tombol 'submit' ditekan
form.addEventListener('submit', function(e) {
    // Mencegah form mengirim data dengan cara lama
    e.preventDefault(); 
    
    // --- PASTIKAN NOMOR INI BENAR DAN SESUAI FORMAT 62... ---
    const nomorWhatsapp = '6283818115136'; // GANTI DENGAN NOMORMU
    // ---------------------------------------------------------

    // Mengambil isi dari kolom input
    const nama = document.getElementById('nama').value;
    const pesan = document.getElementById('pesan').value;

    // Membuat format pesan untuk dikirim ke WhatsApp
    // Perhatikan penggunaan %0A untuk baris baru
    const formatPesan = `Halo, saya *${nama}*.%0A%0ASaya mau memberikan feedback untuk Erine Game Collection:%0A%0A"${pesan}"`;

    // ====================== PERHATIKAN BARIS INI ======================
    // Pastikan diawali dan diakhiri dengan backtick (`), dan ada tanda $
    const linkWhatsapp = `https://api.whatsapp.com/send?phone=${nomorWhatsapp}&text=${formatPesan}`;
    // =================================================================

    // Membuka link tersebut di tab baru
    window.open(linkWhatsapp, '_blank');
});