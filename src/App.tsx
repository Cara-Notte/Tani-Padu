import MainLayout from './layouts/MainLayout';
import AdminPage from './pages/AdminPage';
import CatalogPage from './pages/CatalogPage';
import FarmerPage from './pages/FarmerPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MarketPricesPage from './pages/MarketPricesPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
import { initializeMvpStorage } from './lib';
import { isKnownRoute, normalizePath } from './routes';

function getCurrentPath() {
  if (typeof window === 'undefined') {
    return '/';
  }

  return normalizePath(window.location.pathname);
}

function renderRoute(pathname: string, isStorageReady: boolean) {
  switch (pathname) {
    case '/':
      return <HomePage isStorageReady={isStorageReady} />;
    case '/masuk':
      return <LoginPage />;
    case '/daftar':
      return <RegisterPage />;
    case '/katalog':
      return <CatalogPage />;
    case '/harga-acuan':
      return <MarketPricesPage />;
    case '/petani':
      return <FarmerPage />;
    case '/admin':
      return <AdminPage />;
    default:
      return <NotFoundPage />;
  }
}

function App() {
  const isStorageReady = initializeMvpStorage();
  const currentPath = getCurrentPath();
  const routePath = isKnownRoute(currentPath) ? currentPath : '';

  return <MainLayout currentPath={routePath}>{renderRoute(currentPath, isStorageReady)}</MainLayout>;
}

export default App;
