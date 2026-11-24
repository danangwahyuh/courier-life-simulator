# Courier Life Simulator 3D

Game simulasi kurir 3D open-world berlatar Indonesia, dirancang mobile-first untuk web/PWA.

## Status proyek

**Prototype 0.2.0 — kontrol kontinu dan fisika pemain.**

Yang sudah tersedia:
- Aplikasi React + TypeScript + Vite.
- Scene 3D area gudang, jalan, bangunan, dan karakter kurir.
- Fisika dasar pemain menggunakan Rapier: gravitasi, collider, dan tabrakan lingkungan.
- Gerakan kontinu menggunakan keyboard dan tombol sentuh.
- Mode berjalan dan mode motor dengan kecepatan berbeda.
- Kamera third-person mengikuti pemain dengan interpolasi halus.
- HUD status latihan kendaraan.

Target milestone vertical slice berikutnya:
- Sistem motor terpisah dengan suspensi/roda dan handling yang lebih realistis.
- Titik interaksi naik/turun motor yang mempertimbangkan jarak.
- Rute dan titik tujuan pengantaran.
- Serah-terima paket berbasis jarak dan tombol interaksi.
- Penyimpanan progres permainan.

## Teknologi

- React + TypeScript + Vite
- Three.js + React Three Fiber + Drei
- Rapier Physics melalui `@react-three/rapier`
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

| Aksi | Keyboard | Layar sentuh |
|---|---|---|
| Maju / gas | W atau panah atas | Tahan ▲ |
| Mundur / rem | S atau panah bawah | Tahan ▼ |
| Belok kiri | A atau panah kiri | Tahan ◀ |
| Belok kanan | D atau panah kanan | Tahan ▶ |
| Naik/turun mode motor | E | Tombol NAIK MOTOR / TURUN MOTOR |

Kontrol saat ini adalah prototype handling arcade sederhana. Model motor masih menempel pada rigid body pemain; sistem kendaraan dengan roda dan suspensi terpisah belum dibuat.

## Branch

- `main`: branch utama.
- `development`: branch pengembangan aktif.

## Lisensi

Lisensi proyek belum ditetapkan. Jangan mendistribusikan ulang aset pihak ketiga tanpa memeriksa lisensinya.


## Prototype 0.3.0

- Motorcycle and walking courier now use separate Rapier rigid bodies.
- The motorcycle can only be mounted when the courier is within approximately 2.25 world units.
- Press **E** or use the on-screen action button to mount or dismount.
- While mounted, W/S accelerate and brake, while A/D steer. Dismounting places the courier beside the motorcycle.
- Motorcycle handling is currently arcade-style chassis physics; independently simulated wheels, suspension, and tire grip are not implemented yet.

