export type AppRoutePath = '/' | '/masuk' | '/daftar' | '/katalog' | '/harga-acuan' | '/petani' | '/admin';

export interface AppRoute {
  path: AppRoutePath;
  label: string;
  description: string;
}

export const appRoutes: AppRoute[] = [
  {
    path: '/',
    label: 'Beranda',
    description: 'Halaman pengantar Tani Padu',
  },
  {
    path: '/katalog',
    label: 'Katalog',
    description: 'Daftar produk panen dari petani',
  },
  {
    path: '/harga-acuan',
    label: 'Harga Acuan',
    description: 'Informasi harga pasar manual',
  },
  {
    path: '/petani',
    label: 'Ruang Petani',
    description: 'Area kerja petani',
  },
  {
    path: '/admin',
    label: 'Ruang Admin',
    description: 'Area pemantauan admin',
  },
];

export const authRoutes: AppRoute[] = [
  {
    path: '/masuk',
    label: 'Masuk',
    description: 'Akses akun Tani Padu',
  },
  {
    path: '/daftar',
    label: 'Daftar',
    description: 'Buat akun baru',
  },
];

const validRoutePaths = new Set<string>([...appRoutes, ...authRoutes].map((route) => route.path));

export function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }

  return pathname || '/';
}

export function isKnownRoute(pathname: string) {
  return validRoutePaths.has(normalizePath(pathname));
}
