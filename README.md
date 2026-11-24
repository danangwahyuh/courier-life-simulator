# Courier Life Simulator 3D

Game simulasi kurir 3D open-world berlatar Indonesia, dirancang dengan pendekatan **mobile-first** dan ditargetkan berjalan di web/PWA.

## Status proyek

**Prototype 0.1.0 — kerangka aplikasi dan scene awal.**

Yang sudah tersedia:
- Aplikasi React + TypeScript + Vite.
- Scene 3D awal berisi jalan, bangunan gudang, lingkungan, dan karakter kurir low-poly.
- Kontrol gerak melalui keyboard (WASD / tombol panah) dan tombol layar sentuh.
- Tombol simulasi naik/turun motor.
- HUD tugas dan penghitung paket (sementara masih berupa simulasi UI).

Target milestone pertama berikutnya adalah *playable vertical slice*:
- Pergerakan karakter dan kendaraan dengan fisika.
- Area gudang dan lingkungan yang lebih lengkap.
- Sistem rute dan titik tujuan pengantaran.
- Serah-terima paket berdasarkan jarak/interaksi.
- Penyimpanan progres permainan.

## Teknologi

- React + TypeScript + Vite
- Three.js + React Three Fiber + Drei
- Rapier Physics (disiapkan untuk implementasi fisika)
- GitHub untuk version control
- Cloudflare Pages untuk deployment web/PWA

## Menjalankan secara lokal

Pastikan Node.js versi LTS terpasang, lalu jalankan:

~~~bash
npm install
npm run dev
~~~

Buka alamat lokal yang ditampilkan Vite di terminal.

Pemeriksaan tipe dan build produksi:

~~~bash
npm run typecheck
npm run build
npm run preview
~~~

## Kontrol prototype

| Aksi | Kontrol |
|---|---|
| Bergerak | W, A, S, D atau tombol panah |
| Naik/turun motor | E atau tombol NAIK MOTOR / TURUN |
| Gerak di layar sentuh | D-pad di kiri bawah |
| Simulasi serah paket | Tombol SERAHKAN PAKET |

> Catatan: kontrol motor, pengantaran, dan hadiah pada versi ini masih prototype sederhana, belum memakai sistem gameplay/fisika final.

## Prinsip pengembangan

- Prioritaskan pengalaman bermain di perangkat mobile.
- Bangun fitur bertahap dan pastikan setiap milestone dapat diuji.
- Gunakan aset dengan lisensi yang sesuai dan dokumentasikan sumbernya.
- Pisahkan sistem gameplay, UI, dunia, dan penyimpanan agar mudah dikembangkan.

## Branch

- main: branch utama.
- development: branch pengembangan aktif.

## Lisensi

Lisensi proyek belum ditetapkan. Jangan mendistribusikan ulang aset pihak ketiga tanpa memeriksa lisensinya.
