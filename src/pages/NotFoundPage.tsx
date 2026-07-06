function NotFoundPage() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
      <p className="text-sm font-semibold text-red-700">Halaman tidak ditemukan</p>
      <h1 className="mt-2 text-3xl font-extrabold text-leaf-900">Rute belum tersedia</h1>
      <p className="mt-3 max-w-2xl text-slate-700">
        Alamat yang dibuka belum terdaftar di Tani Padu. Kembali ke beranda untuk melanjutkan.
      </p>
      <a
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-leaf-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-leaf-900 focus:outline-none focus:ring-2 focus:ring-leaf-600 focus:ring-offset-2"
        href="/"
      >
        Kembali ke Beranda
      </a>
    </section>
  );
}

export default NotFoundPage;
