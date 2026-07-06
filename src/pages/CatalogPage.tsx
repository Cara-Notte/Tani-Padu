import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ORDER_STATUS_LABELS, PRODUCT_AVAILABILITY_STATUS_LABELS } from '../constants';
import { createWhatsAppLink, mvpStorage } from '../lib';
import type { Product, PurchaseRequest } from '../types';

function createPurchaseRequestId() {
  return `purchase-request-${Date.now()}`;
}

function CatalogPage() {
  const authSession = mvpStorage.authSession.read();
  const [searchTerm, setSearchTerm] = useState('');
  const [requestMessage, setRequestMessage] = useState('Ajukan permintaan pembelian untuk produk yang tersedia.');
  const products = mvpStorage.products.read();
  const farmerProfiles = mvpStorage.farmerProfiles.read();
  const users = mvpStorage.users.read();
  const buyer = users.find((user) => user.id === authSession?.userId);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const farmerProfile = farmerProfiles.find((profile) => profile.id === product.farmerId);
    const searchableText = [product.name, product.commodity, product.location, farmerProfile?.displayName ?? '']
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedSearchTerm);
  });

  function handlePurchaseRequest(event: FormEvent<HTMLFormElement>, product: Product) {
    event.preventDefault();

    if (!authSession || authSession.role !== 'buyer' || !buyer) {
      setRequestMessage('Silakan masuk sebagai Pembeli untuk mengajukan permintaan pembelian.');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const quantity = Number(formData.get('quantity'));
    const note = String(formData.get('note') ?? '').trim();

    if (quantity <= 0) {
      setRequestMessage('Jumlah pembelian harus lebih dari nol.');
      return;
    }

    const now = new Date().toISOString();
    const nextRequest: PurchaseRequest = {
      id: createPurchaseRequestId(),
      productId: product.id,
      farmerId: product.farmerId,
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerPhone: buyer.phone,
      quantity,
      unit: product.unit,
      note: note || undefined,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    mvpStorage.purchaseRequests.write([...mvpStorage.purchaseRequests.read(), nextRequest]);
    setRequestMessage(`Permintaan pembelian ${product.name} berhasil dikirim dengan status ${ORDER_STATUS_LABELS.pending}.`);
    event.currentTarget.reset();
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
        <p className="text-sm font-semibold text-leaf-700">Produk panen</p>
        <h1 className="mt-2 text-3xl font-extrabold text-leaf-900">Katalog produk</h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          Lihat produk panen dari petani terverifikasi dan gunakan pencarian sederhana untuk menemukan komoditas.
        </p>
        <label className="mt-5 block text-sm font-semibold text-slate-800">
          Cari produk
          <input
            className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
            type="search"
            value={searchTerm}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
            placeholder="Cari nama produk, komoditas, petani, atau lokasi"
          />
        </label>
        <p className="mt-4 rounded-2xl bg-soil-100 p-3 text-sm text-soil-700">{requestMessage}</p>
      </div>

      {visibleProducts.length === 0 ? (
        <div className="rounded-3xl bg-white p-6 text-slate-700 shadow-sm ring-1 ring-leaf-100">
          Belum ada produk yang sesuai dengan pencarian.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.map((product) => {
            const farmerProfile = farmerProfiles.find((profile) => profile.id === product.farmerId);
            const whatsappMessage = `Halo ${farmerProfile?.displayName ?? 'Petani Tani Padu'}, saya ingin bertanya tentang ${product.name}.`;

            return (
              <article key={product.id} className="flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-leaf-700">{product.commodity}</p>
                    <h2 className="mt-1 text-2xl font-bold text-leaf-900">{product.name}</h2>
                  </div>
                  <span className="rounded-full bg-leaf-50 px-3 py-2 text-xs font-semibold text-leaf-900">
                    {PRODUCT_AVAILABILITY_STATUS_LABELS[product.availabilityStatus]}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-700">{product.description}</p>
                <dl className="mt-5 grid gap-3 text-sm text-slate-700">
                  <div className="rounded-2xl bg-leaf-50 p-3">
                    <dt className="font-semibold text-leaf-900">Harga</dt>
                    <dd>
                      Rp{product.price.toLocaleString('id-ID')} / {product.unit}
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-leaf-50 p-3">
                    <dt className="font-semibold text-leaf-900">Ketersediaan</dt>
                    <dd>
                      {product.stock} {product.unit} di {product.location}
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-leaf-50 p-3">
                    <dt className="font-semibold text-leaf-900">Petani</dt>
                    <dd>{farmerProfile?.displayName ?? 'Petani Tani Padu'}</dd>
                  </div>
                </dl>

                {authSession?.role === 'buyer' ? (
                  <form className="mt-5 space-y-3 rounded-2xl bg-leaf-50 p-4" onSubmit={(event: FormEvent<HTMLFormElement>) => handlePurchaseRequest(event, product)}>
                    <label className="block text-sm font-semibold text-slate-800">
                      Jumlah pembelian
                      <input
                        className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                        min="1"
                        name="quantity"
                        type="number"
                        placeholder={`Jumlah dalam ${product.unit}`}
                        required
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-800">
                      Catatan untuk petani
                      <textarea
                        className="mt-2 min-h-20 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                        name="note"
                        placeholder="Contoh: Mohon info jadwal panen terdekat"
                      />
                    </label>
                    <button
                      className="w-full rounded-xl bg-leaf-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-leaf-900 focus:outline-none focus:ring-2 focus:ring-leaf-600 focus:ring-offset-2"
                      type="submit"
                    >
                      Kirim Permintaan
                    </button>
                  </form>
                ) : (
                  <p className="mt-5 rounded-2xl bg-soil-100 p-3 text-sm text-soil-700">
                    Masuk sebagai Pembeli untuk mengajukan permintaan pembelian.
                  </p>
                )}

                {farmerProfile ? (
                  <a
                    className="mt-3 inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-leaf-700 shadow-sm ring-1 ring-leaf-100 transition hover:bg-leaf-100 focus:outline-none focus:ring-2 focus:ring-leaf-600 focus:ring-offset-2"
                    href={createWhatsAppLink(farmerProfile.whatsappNumber, whatsappMessage)}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Hubungi via WhatsApp
                  </a>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default CatalogPage;
