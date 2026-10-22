# Raka Aditya — Portfolio Landing Page

Landing page portofolio satu halaman yang dibuat dengan HTML, CSS, dan JavaScript
murni. Tanpa build step, tanpa dependency, dan siap dibuka langsung di browser.

## Menjalankan

Cara paling cepat: buka `index.html` di browser (double-click).

Untuk hasil terbaik — dan agar `localStorage` untuk tema bekerja normal — jalankan
lewat server lokal:

```bash
# Python
python -m http.server 8000

# atau Node
npx serve .
```

Lalu buka `http://localhost:8000`.

## Struktur

```
index.html                 # seluruh markup (satu halaman)
assets/
  css/styles.css           # design system + seluruh styling
  js/main.js               # interaksi & animasi (vanilla JS)
  favicon.svg              # favicon monogram
```

## Fitur

- Desain responsif (desktop, tablet, mobile) dengan grid 12 kolom.
- Tema gelap & terang, mengikuti preferensi sistem dan tersimpan di `localStorage`.
- Animasi masuk saat scroll, marquee, counter angka, dan jam lokal Jakarta.
- Menu mobile layar penuh dengan trap state `aria-expanded` dan penutupan via `Esc`.
- Form kontak dengan validasi inline; submit membuka aplikasi email (mailto), tidak
  mengirim data ke mana pun.
- Tombol salin email dengan toast notification.
- Menghormati `prefers-reduced-motion`, punya skip link, focus ring, dan struktur
  heading yang berurutan.
- Metadata Open Graph + JSON-LD `Person` untuk SEO.

## Kustomisasi cepat

| Yang ingin diubah | Lokasi |
| --- | --- |
| Nama, jabatan, deskripsi | `index.html` — bagian hero & footer |
| Warna aksen & tema | `assets/css/styles.css` — variabel `--accent`, `--bg`, `--text` di `:root` |
| Font | `index.html` (`<link>` Google Fonts) dan `--font-sans` / `--font-serif` |
| Proyek & studi kasus | `index.html` — `<article class="work-card">` |
| Email | cari `hello@raka.design` di `index.html` dan `assets/js/main.js` |
| Tautan sosial | atribut `href` pada daftar `.socials` |

## Catatan produksi

- Ganti domain/OG image dan tautan sosial sebelum deploy.
- Tautan kartu proyek serta "Baca studi kasus" masih mengarah ke `#contact`
  sebagai placeholder. Ganti `href`-nya dengan URL halaman studi kasus Anda.
- Visual proyek sengaja dibuat dengan CSS/SVG (tanpa file gambar) agar ringan dan
  tidak bergantung aset eksternal. Ganti `.art` dengan screenshot asli bila ada.
- Form memakai `mailto:` sebagai fallback. Untuk form sungguhan, hubungkan
  handler submit di `main.js` ke endpoint (Formspree, Resend, API sendiri).

## Lisensi

Bebas dipakai dan dimodifikasi untuk portofolio pribadi.
