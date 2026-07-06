import type { ReactNode } from 'react';
import { ROLE_LABELS } from '../constants';
import { mvpStorage } from '../lib';
import { appRoutes, authRoutes } from '../routes';

interface MainLayoutProps {
  children: ReactNode;
  currentPath: string;
}

function linkClassName(path: string, currentPath: string) {
  const isActive = path === currentPath;
  return [
    'rounded-full px-3 py-2 text-sm font-semibold transition',
    isActive ? 'bg-leaf-700 text-white shadow-sm' : 'text-slate-700 hover:bg-leaf-100 hover:text-leaf-900',
  ].join(' ');
}

function MainLayout({ children, currentPath }: MainLayoutProps) {
  const authSession = mvpStorage.authSession.read();

  function handleLogout() {
    mvpStorage.authSession.clear();
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-leaf-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-leaf-100 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <a className="text-xl font-extrabold text-leaf-700" href="/" aria-label="Beranda Tani Padu">
              Tani Padu
            </a>
            <div className="flex shrink-0 gap-2">
              {authSession ? (
                <button
                  className="rounded-full bg-soil-100 px-3 py-2 text-sm font-semibold text-soil-700 transition hover:bg-leaf-100 hover:text-leaf-900"
                  type="button"
                  onClick={handleLogout}
                >
                  Keluar
                </button>
              ) : (
                authRoutes.map((route) => (
                  <a key={route.path} className={linkClassName(route.path, currentPath)} href={route.path}>
                    {route.label}
                  </a>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {appRoutes.map((route) => (
              <a key={route.path} className={linkClassName(route.path, currentPath)} href={route.path}>
                {route.label}
              </a>
            ))}
          </div>
        {authSession ? (
            <p className="rounded-2xl bg-leaf-50 px-3 py-2 text-sm text-slate-700">
              Sesi aktif: <strong>{authSession.userName}</strong> sebagai <strong>{ROLE_LABELS[authSession.role]}</strong>
            </p>
          ) : null}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

export default MainLayout;
