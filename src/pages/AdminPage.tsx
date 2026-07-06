import { useState } from 'react';
import { FARMER_VERIFICATION_STATUS_LABELS, ORDER_STATUS_LABELS, PRODUCT_AVAILABILITY_STATUS_LABELS } from '../constants';
import { mvpStorage } from '../lib';
import type { FarmerProfile, FarmerVerificationStatus } from '../types';

function updateProfileStatus(
  profiles: FarmerProfile[],
  profileId: string,
  verificationStatus: FarmerVerificationStatus,
  verificationNote: string,
) {
  const now = new Date().toISOString();

  return profiles.map((profile) =>
    profile.id === profileId
      ? {
          ...profile,
          verificationStatus,
          verificationNote,
          updatedAt: now,
        }
      : profile,
  );
}

function AdminPage() {
  const authSession = mvpStorage.authSession.read();
  const [farmerProfiles, setFarmerProfiles] = useState(mvpStorage.farmerProfiles.read());
  const products = mvpStorage.products.read();
  const purchaseRequests = mvpStorage.purchaseRequests.read();
  const pendingFarmers = farmerProfiles.filter((profile) => profile.verificationStatus === 'pending').length;
  const activeProducts = products.filter((product) => product.availabilityStatus !== 'sold_out').length;
  const pendingRequests = purchaseRequests.filter((request) => request.status === 'pending').length;

  function handleVerification(
    profileId: string,
    verificationStatus: FarmerVerificationStatus,
    verificationNote: string,
  ) {
    const nextProfiles = updateProfileStatus(farmerProfiles, profileId, verificationStatus, verificationNote);
    mvpStorage.farmerProfiles.write(nextProfiles);
    setFarmerProfiles(nextProfiles);
  }

  if (!authSession) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
        <p className="text-sm font-semibold text-leaf-700">Area admin</p>
        <h1 className="mt-2 text-3xl font-extrabold text-leaf-900">Masuk sebagai Admin</h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          Silakan masuk sebagai admin untuk meninjau dan memverifikasi profil petani.
        </p>
        <a className="mt-6 inline-flex rounded-xl bg-leaf-700 px-5 py-3 text-sm font-semibold text-white" href="/masuk">
          Masuk
        </a>
      </section>
    );
  }

  if (authSession.role !== 'admin') {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
        <p className="text-sm font-semibold text-leaf-700">Area admin</p>
        <h1 className="mt-2 text-3xl font-extrabold text-leaf-900">Khusus Admin</h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          Halaman ini hanya dapat digunakan oleh akun dengan peran Admin.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
        <p className="text-sm font-semibold text-leaf-700">Area admin</p>
        <h1 className="mt-2 text-3xl font-extrabold text-leaf-900">Dasbor admin</h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          Pantau petani, produk, dan permintaan pembelian dari data MVP yang tersimpan secara lokal.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-leaf-100">
          <p className="text-sm font-semibold text-slate-600">Total petani</p>
          <strong className="mt-2 block text-3xl text-leaf-900">{farmerProfiles.length}</strong>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-leaf-100">
          <p className="text-sm font-semibold text-slate-600">Menunggu verifikasi</p>
          <strong className="mt-2 block text-3xl text-leaf-900">{pendingFarmers}</strong>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-leaf-100">
          <p className="text-sm font-semibold text-slate-600">Produk aktif</p>
          <strong className="mt-2 block text-3xl text-leaf-900">{activeProducts}</strong>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-leaf-100">
          <p className="text-sm font-semibold text-slate-600">Pesanan menunggu</p>
          <strong className="mt-2 block text-3xl text-leaf-900">{pendingRequests}</strong>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
        <h2 className="text-2xl font-bold text-leaf-900">Verifikasi petani</h2>
        <p className="mt-2 max-w-2xl text-slate-700">
          Tinjau profil petani, lalu setujui atau tolak verifikasi berdasarkan data yang tersedia.
        </p>
      </div>

      {farmerProfiles.length === 0 ? (
        <div className="rounded-3xl bg-white p-6 text-slate-700 shadow-sm ring-1 ring-leaf-100">
          Belum ada profil petani yang perlu ditinjau.
        </div>
      ) : (
        <div className="grid gap-4">
          {farmerProfiles.map((profile) => (
            <article key={profile.id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-leaf-700">{profile.location}</p>
                  <h2 className="mt-1 text-2xl font-bold text-leaf-900">{profile.displayName}</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {profile.groupName ? `${profile.groupName} • ` : ''}WhatsApp: {profile.whatsappNumber}
                  </p>
                </div>
                <span className="rounded-full bg-leaf-50 px-3 py-2 text-sm font-semibold text-leaf-900">
                  {FARMER_VERIFICATION_STATUS_LABELS[profile.verificationStatus]}
                </span>
              </div>

              <p className="mt-4 text-slate-700">{profile.description}</p>
              <p className="mt-3 text-sm text-slate-600">
                Komoditas utama: <strong>{profile.mainCommodities.join(', ')}</strong>
              </p>
              {profile.verificationNote ? (
                <p className="mt-3 rounded-2xl bg-soil-100 p-3 text-sm text-soil-700">
                  Catatan verifikasi: {profile.verificationNote}
                </p>
              ) : null}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  className="rounded-xl bg-leaf-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-leaf-900 focus:outline-none focus:ring-2 focus:ring-leaf-600 focus:ring-offset-2"
                  type="button"
                  onClick={() => handleVerification(profile.id, 'verified', 'Profil disetujui oleh admin.')}
                >
                  Setujui
                </button>
                <button
                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-red-100 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                  type="button"
                  onClick={() => handleVerification(profile.id, 'rejected', 'Profil ditolak oleh admin.')}
                >
                  Tolak
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
          <h2 className="text-2xl font-bold text-leaf-900">Pantauan produk</h2>
          <div className="mt-4 space-y-3">
            {products.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-leaf-200 p-4 text-sm text-slate-700">
                Belum ada produk yang diunggah petani.
              </p>
            ) : (
              products.map((product) => {
                const farmerProfile = farmerProfiles.find((profile) => profile.id === product.farmerId);

                return (
                  <article key={product.id} className="rounded-2xl border border-leaf-100 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-bold text-leaf-900">{product.name}</h3>
                        <p className="text-sm text-slate-600">{farmerProfile?.displayName ?? 'Petani Tani Padu'} • {product.location}</p>
                      </div>
                      <span className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-semibold text-leaf-900">
                        {PRODUCT_AVAILABILITY_STATUS_LABELS[product.availabilityStatus]}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-700">
                      Rp{product.price.toLocaleString('id-ID')} / {product.unit} • Stok {product.stock} {product.unit}
                    </p>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
          <h2 className="text-2xl font-bold text-leaf-900">Pantauan pesanan</h2>
          <div className="mt-4 space-y-3">
            {purchaseRequests.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-leaf-200 p-4 text-sm text-slate-700">
                Belum ada permintaan pembelian.
              </p>
            ) : (
              purchaseRequests.map((request) => {
                const requestedProduct = products.find((product) => product.id === request.productId);

                return (
                  <article key={request.id} className="rounded-2xl border border-leaf-100 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-bold text-leaf-900">{requestedProduct?.name ?? 'Produk panen'}</h3>
                        <p className="text-sm text-slate-600">{request.buyerName} • {request.quantity} {request.unit}</p>
                      </div>
                      <span className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-semibold text-leaf-900">
                        {ORDER_STATUS_LABELS[request.status]}
                      </span>
                    </div>
                    {request.note ? <p className="mt-3 text-sm text-slate-700">Catatan: {request.note}</p> : null}
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

export default AdminPage;
