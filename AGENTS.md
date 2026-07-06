# Instruksi Engineering Tani Padu

Tani Padu adalah MVP aplikasi marketplace agrikultur untuk membantu petani dan kelompok tani menjual hasil panen secara langsung kepada pembeli tanpa melewati banyak perantara.

## Prinsip utama

Ini adalah MVP, bukan marketplace besar.

Prioritas utama:

* Petani bisa membuat profil.
* Admin bisa memverifikasi petani.
* Petani terverifikasi bisa mengunggah produk panen.
* Pembeli bisa melihat katalog produk.
* Pembeli bisa mengajukan permintaan pembelian.
* Komunikasi lanjutan memakai WhatsApp.
* Admin bisa memantau petani, produk, dan pesanan.
* Ada halaman harga acuan pasar.

## Aturan bahasa

Semua teks yang terlihat oleh pengguna wajib menggunakan Bahasa Indonesia.

Yang wajib Bahasa Indonesia:

* Navbar
* Tombol
* Judul halaman
* Label form
* Placeholder
* Pesan error
* Pesan sukses
* Empty state
* Status pesanan
* Teks landing page
* Teks kartu produk
* Teks tabel
* Teks filter
* Teks modal

Jangan gunakan UI copy berbahasa Inggris seperti:

* Login
* Register
* Submit
* Dashboard
* Product
* Order
* Search
* Filter
* Profile
* Settings
* Delete
* Save
* Cancel

Gunakan padanan:

* Login → Masuk
* Register → Daftar
* Submit → Kirim
* Dashboard → Dasbor
* Product → Produk
* Order → Pesanan
* Search → Cari
* Filter → Saring
* Profile → Profil
* Settings → Pengaturan
* Delete → Hapus
* Save → Simpan
* Cancel → Batal
* Pending → Menunggu Konfirmasi
* Accepted → Diterima
* Rejected → Ditolak
* Processing → Diproses
* Completed → Selesai
* Cancelled → Dibatalkan

Nama variabel, nama function, nama file, nama folder, dan TypeScript type boleh menggunakan bahasa Inggris agar codebase tetap rapi.

## Stack teknis

Gunakan:

* React
* Vite
* TypeScript
* Tailwind CSS
* localStorage untuk persistence MVP

Jangan gunakan backend dulu kecuali diminta eksplisit.

## Larangan scope

Jangan implementasikan:

* Payment gateway
* Escrow
* Chat internal real-time
* Tracking kurir
* AI pricing
* Blockchain
* Sistem logistik kompleks
* Fitur rating/review kompleks
* Notifikasi real-time
* Multi-vendor marketplace kompleks

## Role pengguna

Role MVP:

* Petani
* Pembeli
* Admin

## Definition of done

Sebuah task dianggap selesai jika:

* Tidak ada TypeScript error.
* Tidak ada broken route.
* UI responsif di mobile.
* Semua UI copy menggunakan Bahasa Indonesia.
* Data penting tersimpan di localStorage.
* Alur yang diminta bisa didemokan.
* Tidak ada fitur di luar scope MVP.
* Build berhasil dijalankan.
