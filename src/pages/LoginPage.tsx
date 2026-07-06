import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ROLE_LABELS } from '../constants';
import { mvpStorage } from '../lib';
import type { User } from '../types';

function findUserByEmail(users: User[], email: string) {
  return users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
}

function getRoleHomePath(role: User['role']) {
  if (role === 'admin') {
    return '/admin';
  }

  if (role === 'farmer') {
    return '/petani';
  }

  return '/katalog';
}

function LoginPage() {
  const [email, setEmail] = useState('admin@tanipadu.local');
  const [message, setMessage] = useState('Gunakan akun demo yang tersedia di penyimpanan lokal.');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const user = findUserByEmail(mvpStorage.users.read(), email);

    if (!user) {
      setMessage('Akun tidak ditemukan. Periksa kembali alamat email yang digunakan.');
      return;
    }

    mvpStorage.authSession.write({
      userId: user.id,
      userName: user.name,
      role: user.role,
      startedAt: new Date().toISOString(),
    });

    window.location.href = getRoleHomePath(user.role);
  }

  return (
    <section className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
      <p className="text-sm font-semibold text-leaf-700">Akses akun</p>
      <h1 className="mt-2 text-3xl font-extrabold text-leaf-900">Masuk ke Tani Padu</h1>
      <p className="mt-3 text-slate-700">
        Masukkan alamat email akun demo untuk membuka ruang kerja sesuai peran.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold text-slate-800" htmlFor="email">
          Alamat email
        </label>
        <input
          id="email"
          className="w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
          type="email"
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
          placeholder="contoh@tanipadu.local"
          required
        />

        <div className="rounded-2xl bg-leaf-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-leaf-900">Akun demo</p>
          <ul className="mt-2 space-y-1">
            <li>Admin: admin@tanipadu.local</li>
            <li>Petani: siti@tanipadu.local</li>
            <li>Pembeli: budi@tanipadu.local</li>
          </ul>
        </div>

        <p className="rounded-2xl bg-soil-100 p-3 text-sm text-soil-700">{message}</p>

        <button
          className="w-full rounded-xl bg-leaf-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-leaf-900 focus:outline-none focus:ring-2 focus:ring-leaf-600 focus:ring-offset-2"
          type="submit"
        >
          Masuk
        </button>
      </form>

      <p className="mt-5 text-sm text-slate-600">
        Belum punya akun?{' '}
        <a className="font-semibold text-leaf-700 hover:text-leaf-900" href="/daftar">
          Daftar sebagai Petani atau Pembeli
        </a>
      </p>
      <p className="mt-3 text-xs text-slate-500">Peran aktif akan mengikuti akun yang dipilih: {Object.values(ROLE_LABELS).join(', ')}.</p>
    </section>
  );
}

export default LoginPage;
