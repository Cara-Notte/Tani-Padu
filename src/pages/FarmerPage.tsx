import { useState, type ChangeEvent, type FormEvent } from 'react';
import { FARMER_VERIFICATION_STATUS_LABELS, ORDER_STATUS_LABELS, PRODUCT_AVAILABILITY_STATUS_LABELS } from '../constants';
import { createWhatsAppLink, mvpStorage } from '../lib';
import type { FarmerProfile, OrderStatus, Product, ProductAvailabilityStatus, PurchaseRequest } from '../types';

function createProfileId() {
  return `farmer-profile-${Date.now()}`;
}

function createProductId() {
  return `product-${Date.now()}`;
}

function splitCommodities(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const availabilityOptions: ProductAvailabilityStatus[] = ['available', 'limited', 'sold_out'];

function FarmerPage() {
  const authSession = mvpStorage.authSession.read();
  const [farmerProfiles, setFarmerProfiles] = useState(mvpStorage.farmerProfiles.read());
  const [products, setProducts] = useState(mvpStorage.products.read());
  const [purchaseRequests, setPurchaseRequests] = useState(mvpStorage.purchaseRequests.read());
  const currentProfile = farmerProfiles.find((profile) => profile.userId === authSession?.userId);
  const currentUser = mvpStorage.users.read().find((user) => user.id === authSession?.userId);
  const farmerProducts = products.filter((product) => product.farmerId === currentProfile?.id);
  const farmerPurchaseRequests = purchaseRequests.filter((request) => request.farmerId === currentProfile?.id);

  const [displayName, setDisplayName] = useState(currentProfile?.displayName ?? currentUser?.name ?? '');
  const [groupName, setGroupName] = useState(currentProfile?.groupName ?? '');
  const [location, setLocation] = useState(currentProfile?.location ?? '');
  const [whatsappNumber, setWhatsappNumber] = useState(currentProfile?.whatsappNumber ?? currentUser?.phone ?? '');
  const [mainCommodities, setMainCommodities] = useState(currentProfile?.mainCommodities.join(', ') ?? '');
  const [description, setDescription] = useState(currentProfile?.description ?? '');
  const [profileMessage, setProfileMessage] = useState('Lengkapi profil agar admin dapat melakukan verifikasi.');

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [commodity, setCommodity] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('');
  const [productLocation, setProductLocation] = useState(currentProfile?.location ?? '');
  const [availabilityStatus, setAvailabilityStatus] = useState<ProductAvailabilityStatus>('available');
  const [harvestDate, setHarvestDate] = useState('');
  const [productMessage, setProductMessage] = useState('Produk hanya dapat diunggah setelah profil petani terverifikasi.');

  if (!authSession) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
        <p className="text-sm font-semibold text-leaf-700">Area petani</p>
        <h1 className="mt-2 text-3xl font-extrabold text-leaf-900">Masuk sebagai Petani</h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          Silakan masuk terlebih dahulu untuk membuat profil dan mengelola produk panen.
        </p>
        <a className="mt-6 inline-flex rounded-xl bg-leaf-700 px-5 py-3 text-sm font-semibold text-white" href="/masuk">
          Masuk
        </a>
      </section>
    );
  }

  if (authSession.role !== 'farmer') {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
        <p className="text-sm font-semibold text-leaf-700">Area petani</p>
        <h1 className="mt-2 text-3xl font-extrabold text-leaf-900">Khusus Petani</h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          Halaman ini hanya dapat digunakan oleh akun dengan peran Petani.
        </p>
      </section>
    );
  }

  function resetProductForm(nextLocation = currentProfile?.location ?? '') {
    setEditingProductId(null);
    setProductName('');
    setCommodity('');
    setProductDescription('');
    setPrice('');
    setUnit('kg');
    setStock('');
    setProductLocation(nextLocation);
    setAvailabilityStatus('available');
    setHarvestDate('');
  }

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authSession) {
      return;
    }

    const now = new Date().toISOString();
    const nextProfile: FarmerProfile = {
      id: currentProfile?.id ?? createProfileId(),
      userId: authSession.userId,
      displayName: displayName.trim(),
      groupName: groupName.trim() || undefined,
      location: location.trim(),
      whatsappNumber: whatsappNumber.trim(),
      mainCommodities: splitCommodities(mainCommodities),
      description: description.trim(),
      verificationStatus: currentProfile?.verificationStatus ?? 'pending',
      verificationNote: currentProfile?.verificationNote,
      createdAt: currentProfile?.createdAt ?? now,
      updatedAt: now,
    };

    const nextProfiles = currentProfile
      ? farmerProfiles.map((profile) => (profile.id === currentProfile.id ? nextProfile : profile))
      : [...farmerProfiles, nextProfile];

    mvpStorage.farmerProfiles.write(nextProfiles);
    setFarmerProfiles(nextProfiles);
    setProductLocation(nextProfile.location);
    setProfileMessage('Profil petani berhasil disimpan. Admin dapat meninjau status verifikasi.');
  }

  function handleProductSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentProfile || currentProfile.verificationStatus !== 'verified') {
      setProductMessage('Produk belum dapat diunggah karena profil petani belum terverifikasi.');
      return;
    }

    const now = new Date().toISOString();
    const existingProduct = products.find((product) => product.id === editingProductId);
    const nextProduct: Product = {
      id: existingProduct?.id ?? createProductId(),
      farmerId: currentProfile.id,
      name: productName.trim(),
      commodity: commodity.trim(),
      description: productDescription.trim(),
      price: Number(price),
      unit: unit.trim(),
      stock: Number(stock),
      location: productLocation.trim(),
      availabilityStatus,
      harvestDate: harvestDate || undefined,
      imageUrl: existingProduct?.imageUrl,
      createdAt: existingProduct?.createdAt ?? now,
      updatedAt: now,
    };

    const nextProducts = existingProduct
      ? products.map((product) => (product.id === existingProduct.id ? nextProduct : product))
      : [...products, nextProduct];

    mvpStorage.products.write(nextProducts);
    setProducts(nextProducts);
    setProductMessage(existingProduct ? 'Produk berhasil diperbarui.' : 'Produk panen berhasil diunggah.');
    resetProductForm(nextProduct.location);
  }

  function handleEditProduct(product: Product) {
    setEditingProductId(product.id);
    setProductName(product.name);
    setCommodity(product.commodity);
    setProductDescription(product.description);
    setPrice(String(product.price));
    setUnit(product.unit);
    setStock(String(product.stock));
    setProductLocation(product.location);
    setAvailabilityStatus(product.availabilityStatus);
    setHarvestDate(product.harvestDate ?? '');
    setProductMessage('Ubah data produk lalu tekan tombol Simpan Produk.');
  }

  function handleDeleteProduct(productId: string) {
    const nextProducts = products.filter((product) => product.id !== productId);
    mvpStorage.products.write(nextProducts);
    setProducts(nextProducts);
    setProductMessage('Produk berhasil dihapus dari katalog.');

    if (editingProductId === productId) {
      resetProductForm();
    }
  }


  function handlePurchaseRequestStatus(requestId: string, status: OrderStatus) {
    const now = new Date().toISOString();
    const nextRequests = purchaseRequests.map((request) =>
      request.id === requestId
        ? {
            ...request,
            status,
            updatedAt: now,
          }
        : request,
    );

    mvpStorage.purchaseRequests.write(nextRequests);
    setPurchaseRequests(nextRequests);
  }

  function getProductByRequest(request: PurchaseRequest) {
    return products.find((product) => product.id === request.productId);
  }

  const statusLabel = FARMER_VERIFICATION_STATUS_LABELS[currentProfile?.verificationStatus ?? 'pending'];
  const isVerifiedFarmer = currentProfile?.verificationStatus === 'verified';

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
          <p className="text-sm font-semibold text-leaf-700">Area petani</p>
          <h1 className="mt-2 text-3xl font-extrabold text-leaf-900">Profil petani</h1>
          <p className="mt-3 text-slate-700">
            Data ini dipakai admin untuk memverifikasi petani sebelum produk panen dapat dikelola.
          </p>
          <div className="mt-5 rounded-2xl bg-leaf-50 p-4 text-sm text-slate-700">
            Status verifikasi: <strong className="text-leaf-900">{statusLabel}</strong>
          </div>
        </aside>

        <form className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100" onSubmit={handleProfileSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-800">
              Nama tampilan
              <input
                className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                type="text"
                value={displayName}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setDisplayName(event.target.value)}
                placeholder="Nama petani atau usaha"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-slate-800">
              Nama kelompok tani
              <input
                className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                type="text"
                value={groupName}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setGroupName(event.target.value)}
                placeholder="Opsional"
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
              Nomor WhatsApp
              <input
                className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                type="tel"
                value={whatsappNumber}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setWhatsappNumber(event.target.value)}
                placeholder="62812xxxxxxx"
                required
              />
            </label>
          </div>

          <label className="mt-4 block text-sm font-semibold text-slate-800">
            Komoditas utama
            <input
              className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
              type="text"
              value={mainCommodities}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setMainCommodities(event.target.value)}
              placeholder="Contoh: Cabai Merah, Tomat"
              required
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-slate-800">
            Deskripsi singkat
            <textarea
              className="mt-2 min-h-28 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
              value={description}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
              placeholder="Ceritakan jenis panen dan lokasi lahan secara singkat"
              required
            />
          </label>

          <p className="mt-4 rounded-2xl bg-soil-100 p-3 text-sm text-soil-700">{profileMessage}</p>

          <button
            className="mt-5 w-full rounded-xl bg-leaf-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-leaf-900 focus:outline-none focus:ring-2 focus:ring-leaf-600 focus:ring-offset-2"
            type="submit"
          >
            Simpan Profil
          </button>
        </form>
      </div>


      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
        <p className="text-sm font-semibold text-leaf-700">Permintaan pembelian</p>
        <h2 className="mt-2 text-2xl font-bold text-leaf-900">Pesanan masuk</h2>
        <p className="mt-3 text-slate-700">
          Tinjau permintaan dari pembeli, lalu lanjutkan komunikasi melalui WhatsApp.
        </p>

        {farmerPurchaseRequests.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-leaf-200 p-4 text-sm text-slate-700">
            Belum ada permintaan pembelian untuk produk petani ini.
          </div>
        ) : (
          <div className="mt-5 grid gap-4">
            {farmerPurchaseRequests.map((request) => {
              const requestedProduct = getProductByRequest(request);
              const whatsappMessage = `Halo ${request.buyerName}, permintaan pembelian ${requestedProduct?.name ?? 'produk panen'} sejumlah ${request.quantity} ${request.unit} berstatus ${ORDER_STATUS_LABELS[request.status]}.`;

              return (
                <article key={request.id} className="rounded-2xl border border-leaf-100 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-leaf-700">{requestedProduct?.name ?? 'Produk panen'}</p>
                      <h3 className="mt-1 text-xl font-bold text-leaf-900">{request.buyerName}</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        Jumlah: {request.quantity} {request.unit}
                      </p>
                    </div>
                    <span className="rounded-full bg-leaf-50 px-3 py-2 text-sm font-semibold text-leaf-900">
                      {ORDER_STATUS_LABELS[request.status]}
                    </span>
                  </div>

                  {request.note ? <p className="mt-3 text-sm text-slate-700">Catatan: {request.note}</p> : null}

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <button
                      className="rounded-xl bg-leaf-700 px-4 py-2 text-sm font-semibold text-white"
                      type="button"
                      onClick={() => handlePurchaseRequestStatus(request.id, 'accepted')}
                    >
                      Terima
                    </button>
                    <button
                      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-700 ring-1 ring-red-100"
                      type="button"
                      onClick={() => handlePurchaseRequestStatus(request.id, 'rejected')}
                    >
                      Tolak
                    </button>
                    <a
                      className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-leaf-700 ring-1 ring-leaf-100"
                      href={createWhatsAppLink(request.buyerPhone, whatsappMessage)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      WhatsApp
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
        <p className="text-sm font-semibold text-leaf-700">Produk panen</p>
        <h2 className="mt-2 text-2xl font-bold text-leaf-900">Kelola produk</h2>
        <p className="mt-3 text-slate-700">
          Petani terverifikasi dapat mengunggah produk panen yang akan tampil di katalog.
        </p>

        {!isVerifiedFarmer ? (
          <div className="mt-5 rounded-2xl bg-soil-100 p-4 text-sm text-soil-700">
            Produk belum dapat diunggah karena profil petani masih menunggu verifikasi admin.
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <form className="space-y-4 rounded-2xl bg-leaf-50 p-4" onSubmit={handleProductSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-800">
                  Nama produk
                  <input
                    className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                    type="text"
                    value={productName}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setProductName(event.target.value)}
                    placeholder="Contoh: Cabai Merah Segar"
                    required
                  />
                </label>

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
                  Harga
                  <input
                    className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                    min="0"
                    type="number"
                    value={price}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setPrice(event.target.value)}
                    placeholder="42000"
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

                <label className="block text-sm font-semibold text-slate-800">
                  Stok
                  <input
                    className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                    min="0"
                    type="number"
                    value={stock}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setStock(event.target.value)}
                    placeholder="80"
                    required
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-800">
                  Tanggal panen
                  <input
                    className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                    type="date"
                    value={harvestDate}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setHarvestDate(event.target.value)}
                  />
                </label>
              </div>

              <label className="block text-sm font-semibold text-slate-800">
                Lokasi produk
                <input
                  className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                  type="text"
                  value={productLocation}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setProductLocation(event.target.value)}
                  placeholder="Kabupaten, provinsi"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-slate-800">
                Status ketersediaan
                <select
                  className="mt-2 w-full rounded-xl border border-leaf-100 bg-white px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                  value={availabilityStatus}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    setAvailabilityStatus(event.target.value as ProductAvailabilityStatus)
                  }
                >
                  {availabilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {PRODUCT_AVAILABILITY_STATUS_LABELS[option]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-800">
                Deskripsi produk
                <textarea
                  className="mt-2 min-h-24 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
                  value={productDescription}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setProductDescription(event.target.value)}
                  placeholder="Jelaskan kondisi panen secara singkat"
                  required
                />
              </label>

              <p className="rounded-2xl bg-white p-3 text-sm text-soil-700">{productMessage}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  className="rounded-xl bg-leaf-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-leaf-900 focus:outline-none focus:ring-2 focus:ring-leaf-600 focus:ring-offset-2"
                  type="submit"
                >
                  {editingProductId ? 'Simpan Produk' : 'Unggah Produk'}
                </button>
                <button
                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-leaf-700 shadow-sm ring-1 ring-leaf-100 transition hover:bg-leaf-100 focus:outline-none focus:ring-2 focus:ring-leaf-600 focus:ring-offset-2"
                  type="button"
                  onClick={() => resetProductForm()}
                >
                  Batal
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {farmerProducts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-leaf-200 p-4 text-sm text-slate-700">
                  Belum ada produk panen milik petani ini.
                </div>
              ) : (
                farmerProducts.map((product) => (
                  <article key={product.id} className="rounded-2xl border border-leaf-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-leaf-900">{product.name}</h3>
                        <p className="text-sm text-slate-600">{product.commodity}</p>
                      </div>
                      <span className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-semibold text-leaf-900">
                        {PRODUCT_AVAILABILITY_STATUS_LABELS[product.availabilityStatus]}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-700">{product.description}</p>
                    <p className="mt-2 text-sm font-semibold text-leaf-900">
                      Rp{product.price.toLocaleString('id-ID')} / {product.unit} • Stok {product.stock} {product.unit}
                    </p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <button
                        className="rounded-xl bg-leaf-700 px-4 py-2 text-sm font-semibold text-white"
                        type="button"
                        onClick={() => handleEditProduct(product)}
                      >
                        Ubah
                      </button>
                      <button
                        className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-700 ring-1 ring-red-100"
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FarmerPage;
