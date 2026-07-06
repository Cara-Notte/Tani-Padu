const foundationItems = [
  'Rute dasar sudah tersedia untuk halaman MVP.',
  'Tata letak utama responsif untuk perangkat kecil.',
  'Struktur data MVP siap disimpan secara lokal.',
  'Sesi pengguna MVP siap disimpan secara lokal.',
];

interface HomePageProps {
  isStorageReady: boolean;
}

function HomePage({ isStorageReady }: HomePageProps) {
  return (
    <section className="grid items-center gap-8 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
      <div>
        <p className="mb-3 inline-flex rounded-full bg-soil-100 px-3 py-1 text-sm font-semibold text-soil-700">
          Pasar agrikultur sederhana
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-leaf-900 sm:text-5xl">
          Tani Padu menghubungkan petani dan pembeli secara langsung.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
          Fondasi aplikasi sudah memiliki navigasi dasar, tata letak responsif, dan penyimpanan lokal untuk data MVP.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            className="inline-flex items-center justify-center rounded-xl bg-leaf-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-leaf-900 focus:outline-none focus:ring-2 focus:ring-leaf-600 focus:ring-offset-2"
            href="/katalog"
          >
            Lihat Katalog
          </a>
          <a
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-leaf-700 shadow-sm ring-1 ring-leaf-100 transition hover:bg-leaf-100 focus:outline-none focus:ring-2 focus:ring-leaf-600 focus:ring-offset-2"
            href="/harga-acuan"
          >
            Lihat Harga Acuan
          </a>
        </div>
      </div>

      <aside className="rounded-3xl bg-white p-5 shadow-xl shadow-leaf-900/10 ring-1 ring-leaf-100 sm:p-6">
        <h2 className="text-xl font-bold text-leaf-900">Kesiapan fondasi</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Komponen awal berikut sudah tersedia untuk pengembangan bertahap.
        </p>
        <ul className="mt-5 space-y-3">
          {foundationItems.map((item) => (
            <li key={item} className="flex gap-3 rounded-2xl bg-leaf-50 p-3 text-sm text-slate-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-xs font-bold text-white">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 rounded-2xl border border-dashed border-leaf-600 bg-leaf-50 p-4 text-sm text-leaf-900">
          Status penyimpanan lokal: <strong>{isStorageReady ? 'Siap digunakan' : 'Belum tersedia'}</strong>
        </div>
      </aside>
    </section>
  );
}

export default HomePage;
