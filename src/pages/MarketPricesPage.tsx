import { useState, type ChangeEvent, type FormEvent } from 'react';
import { mvpStorage } from '../lib';
import type { MarketPrice } from '../types';

function createMarketPriceId() {
  return `market-price-${Date.now()}`;
}

function MarketPricesPage() {
  const authSession = mvpStorage.authSession.read();
  const [marketPrices, setMarketPrices] = useState(mvpStorage.marketPrices.read());
  const [commodity, setCommodity] = useState('');
  const [marketName, setMarketName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [sourceNote, setSourceNote] = useState('Data acuan manual untuk demo MVP.');
  const [message, setMessage] = useState('Harga acuan pasar dikelola manual untuk kebutuhan MVP.');
  const isAdmin = authSession?.role === 'admin';

  function resetForm() {
    setCommodity('');
    setMarketName('');
    setLocation('');
    setPrice('');
    setUnit('kg');
    setSourceNote('Data acuan manual untuk demo MVP.');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAdmin) {
      setMessage('Hanya Admin yang dapat memperbarui harga acuan pasar.');
      return;
    }

    const nextPrice: MarketPrice = {
      id: createMarketPriceId(),
      commodity: commodity.trim(),
      marketName: marketName.trim(),
      location: location.trim(),
      price: Number(price),
      unit: unit.trim(),
      updatedAt: new Date().toISOString(),
      sourceNote: sourceNote.trim(),
    };

    const nextMarketPrices = [nextPrice, ...marketPrices];
    mvpStorage.marketPrices.write(nextMarketPrices);
    setMarketPrices(nextMarketPrices);
    setMessage('Harga acuan pasar berhasil disimpan.');
    resetForm();
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
        <p className="text-sm font-semibold text-leaf-700">Harga pasar</p>
        <h1 className="mt-2 text-3xl font-extrabold text-leaf-900">Harga acuan pasar</h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          Gunakan halaman ini sebagai acuan manual harga komoditas. Data ini bukan harga otomatis dan tidak memakai kecerdasan buatan.
        </p>
        <p className="mt-4 rounded-2xl bg-soil-100 p-3 text-sm text-soil-700">{message}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
          <h2 className="text-2xl font-bold text-leaf-900">Daftar harga acuan</h2>
          <div className="mt-4 space-y-3">
            {marketPrices.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-leaf-200 p-4 text-sm text-slate-700">
                Belum ada harga acuan pasar.
              </p>
            ) : (
              marketPrices.map((marketPrice) => (
                <article key={marketPrice.id} className="rounded-2xl border border-leaf-100 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-leaf-700">{marketPrice.marketName}</p>
                      <h3 className="mt-1 text-xl font-bold text-leaf-900">{marketPrice.commodity}</h3>
                      <p className="mt-1 text-sm text-slate-600">{marketPrice.location}</p>
                    </div>
                    <strong className="text-lg text-leaf-900">
                      Rp{marketPrice.price.toLocaleString('id-ID')} / {marketPrice.unit}
                    </strong>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{marketPrice.sourceNote}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Diperbarui: {new Date(marketPrice.updatedAt).toLocaleDateString('id-ID')}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>

        <form className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-leaf-900">Perbarui harga</h2>
          {!isAdmin ? (
            <p className="mt-3 rounded-2xl bg-soil-100 p-3 text-sm text-soil-700">
              Masuk sebagai Admin untuk menambahkan harga acuan pasar.
            </p>
          ) : null}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-800">
              Komoditas
              <input
                className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                type="text"
                value={commodity}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setCommodity(event.target.value)}
                placeholder="Cabai Merah"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-slate-800">
              Nama pasar
              <input
                className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                type="text"
                value={marketName}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setMarketName(event.target.value)}
                placeholder="Pasar Induk"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-slate-800">
              Lokasi
              <input
                className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                type="text"
                value={location}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setLocation(event.target.value)}
                placeholder="Kabupaten, provinsi"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-slate-800">
              Harga
              <input
                className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                min="0"
                type="number"
                value={price}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setPrice(event.target.value)}
                placeholder="45000"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-slate-800">
              Satuan
              <input
                className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                type="text"
                value={unit}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setUnit(event.target.value)}
                placeholder="kg"
                required
              />
            </label>
          </div>

          <label className="mt-4 block text-sm font-semibold text-slate-800">
            Catatan sumber
            <textarea
              className="mt-2 min-h-24 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
              value={sourceNote}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setSourceNote(event.target.value)}
              placeholder="Sumber harga manual"
              required
            />
          </label>

          <button
            className="mt-5 w-full rounded-xl bg-leaf-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-leaf-900 focus:outline-none focus:ring-2 focus:ring-leaf-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
            type="submit"
            disabled={!isAdmin}
          >
            Simpan Harga
          </button>
        </form>
      </div>
    </section>
  );
}

export default MarketPricesPage;
