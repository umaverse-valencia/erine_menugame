// Menunggu seluruh konten halaman dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', () => {

    // Memilih semua elemen dengan class 'menu-button' dan 'logo-btn'
    const allButtons = document.querySelectorAll('.menu-button, .logo-btn');

    // Menambahkan 'event listener' untuk setiap tombol
    allButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Mencegah link '#' melakukan refresh halaman
            event.preventDefault();

            let buttonText;
            
            // Cek apakah yang diklik adalah logo atau tombol menu
            if (button.classList.contains('logo-btn')) {
                buttonText = 'Logo';
            } else {
                buttonText = button.textContent; // Mengambil teks dari tombol, misal "Game 1"
            }

            // Menampilkan pesan sederhana. Anda bisa mengganti ini dengan fungsi untuk memulai game.
            console.log(`Anda mengklik tombol: ${buttonText}`);
            alert(`Anda mengklik tombol: ${buttonText}`);
        });
    });

});

