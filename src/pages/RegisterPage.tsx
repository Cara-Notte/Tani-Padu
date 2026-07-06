import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ROLE_LABELS } from '../constants';
import { mvpStorage } from '../lib';
import type { User, UserRole } from '../types';

const selectableRoles: UserRole[] = ['farmer', 'buyer'];

function createUserId() {
  return `user-${Date.now()}`;
}

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [message, setMessage] = useState('Pilih peran Petani atau Pembeli untuk membuat akun MVP.');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const users = mvpStorage.users.read();
    const normalizedEmail = email.trim().toLowerCase();
    const isEmailUsed = users.some((user) => user.email.toLowerCase() === normalizedEmail);

    if (isEmailUsed) {
      setMessage('Alamat email sudah terdaftar. Gunakan alamat email lain.');
      return;
    }

    const newUser: User = {
      id: createUserId(),
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      role,
      createdAt: new Date().toISOString(),
    };

    mvpStorage.users.write([...users, newUser]);
    mvpStorage.authSession.write({
      userId: newUser.id,
      userName: newUser.name,
      role: newUser.role,
      startedAt: new Date().toISOString(),
    });

    window.location.href = role === 'farmer' ? '/petani' : '/katalog';
  }

  return (
    <section className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-leaf-100">
      <p className="text-sm font-semibold text-leaf-700">Akun baru</p>
      <h1 className="mt-2 text-3xl font-extrabold text-leaf-900">Daftar akun Tani Padu</h1>
      <p className="mt-3 text-slate-700">
        Buat akun MVP untuk mulai memakai Tani Padu sebagai Petani atau Pembeli.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="name">
            Nama lengkap
          </label>
          <input
            id="name"
            className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
            type="text"
            value={name}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
            placeholder="Nama sesuai identitas"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="email">
            Alamat email
          </label>
          <input
            id="email"
            className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
            type="email"
            value={email}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
            placeholder="nama@tanipadu.local"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="phone">
            Nomor WhatsApp
          </label>
          <input
            id="phone"
            className="mt-2 w-full rounded-xl border border-leaf-100 px-4 py-3 text-base outline-none transition focus:border-leaf-600 focus:ring-2 focus:ring-leaf-100"
            type="tel"
            value={phone}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setPhone(event.target.value)}
            placeholder="62812xxxxxxx"
            required
          />
        </div>

        <fieldset className="rounded-2xl border border-leaf-100 p-4">
          <legend className="px-2 text-sm font-semibold text-slate-800">Pilih peran</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {selectableRoles.map((roleOption) => (
              <label
                key={roleOption}
                className="flex cursor-pointer items-center gap-3 rounded-xl bg-leaf-50 p-3 text-sm font-semibold text-slate-700 ring-1 ring-leaf-100"
              >
                <input
                  className="h-4 w-4 accent-leaf-700"
                  type="radio"
                  name="role"
                  value={roleOption}
                  checked={role === roleOption}
                  onChange={() => setRole(roleOption)}
                />
                {ROLE_LABELS[roleOption]}
              </label>
            ))}
          </div>
        </fieldset>

        <p className="rounded-2xl bg-soil-100 p-3 text-sm text-soil-700">{message}</p>

        <button
          className="w-full rounded-xl bg-leaf-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-leaf-900 focus:outline-none focus:ring-2 focus:ring-leaf-600 focus:ring-offset-2"
          type="submit"
        >
          Daftar
        </button>
      </form>
    </section>
  );
}

export default RegisterPage;
