window.addEventListener('load', function() {
    // Simulasikan loading dengan setTimeout (bisa dihapus di production)
    // Di production, ini akan otomatis terpanggil saat semua resource selesai dimuat
    setTimeout(function() {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContent = document.getElementById('mainContent');
        
        // Hilangkan loading screen
        loadingScreen.style.opacity = '0';
        
        // Setelah animasi fade out selesai, sembunyikan element
        loadingScreen.addEventListener('transitionend', function() {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
        });
    }, 800); // Hapus timeout ini di production atau sesuaikan
});