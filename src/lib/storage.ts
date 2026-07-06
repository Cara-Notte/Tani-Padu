import { CURRENT_SEED_VERSION, STORAGE_KEYS } from '../constants';
import { seedFarmerProfiles, seedMarketPrices, seedProducts, seedPurchaseRequests, seedUsers } from '../data/seeds';
import type { AuthSession, FarmerProfile, MarketPrice, Product, PurchaseRequest, User } from '../types';

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readStorage<T>(key: string, fallback: T): T {
  if (!canUseLocalStorage()) {
    return fallback;
  }

  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key: string) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(key);
}

function seedCollection<T>(key: string, value: T) {
  const existingValue = readStorage<T | null>(key, null);

  if (existingValue === null) {
    writeStorage(key, value);
  }
}

export function initializeMvpStorage() {
  if (!canUseLocalStorage()) {
    return false;
  }

  seedCollection(STORAGE_KEYS.users, seedUsers);
  seedCollection(STORAGE_KEYS.farmerProfiles, seedFarmerProfiles);
  seedCollection(STORAGE_KEYS.products, seedProducts);
  seedCollection(STORAGE_KEYS.purchaseRequests, seedPurchaseRequests);
  seedCollection(STORAGE_KEYS.marketPrices, seedMarketPrices);
  writeStorage(STORAGE_KEYS.seedVersion, CURRENT_SEED_VERSION);

  return true;
}

export const mvpStorage = {
  authSession: {
    read: () => readStorage<AuthSession | null>(STORAGE_KEYS.authSession, null),
    write: (value: AuthSession) => writeStorage(STORAGE_KEYS.authSession, value),
    clear: () => removeStorage(STORAGE_KEYS.authSession),
  },
  users: {
    read: () => readStorage<User[]>(STORAGE_KEYS.users, []),
    write: (value: User[]) => writeStorage(STORAGE_KEYS.users, value),
  },
  farmerProfiles: {
    read: () => readStorage<FarmerProfile[]>(STORAGE_KEYS.farmerProfiles, []),
    write: (value: FarmerProfile[]) => writeStorage(STORAGE_KEYS.farmerProfiles, value),
  },
  products: {
    read: () => readStorage<Product[]>(STORAGE_KEYS.products, []),
    write: (value: Product[]) => writeStorage(STORAGE_KEYS.products, value),
  },
  purchaseRequests: {
    read: () => readStorage<PurchaseRequest[]>(STORAGE_KEYS.purchaseRequests, []),
    write: (value: PurchaseRequest[]) => writeStorage(STORAGE_KEYS.purchaseRequests, value),
  },
  marketPrices: {
    read: () => readStorage<MarketPrice[]>(STORAGE_KEYS.marketPrices, []),
    write: (value: MarketPrice[]) => writeStorage(STORAGE_KEYS.marketPrices, value),
  },
};
