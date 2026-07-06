import type { FarmerProfile, MarketPrice, Product, PurchaseRequest, User } from '../types';

const createdAt = '2026-07-06T00:00:00.000Z';

export const seedUsers: User[] = [
  {
    id: 'user-admin-1',
    name: 'Admin Tani Padu',
    email: 'admin@tanipadu.local',
    phone: '6281200000001',
    role: 'admin',
    createdAt,
  },
  {
    id: 'user-farmer-1',
    name: 'Siti Aminah',
    email: 'siti@tanipadu.local',
    phone: '6281200000002',
    role: 'farmer',
    createdAt,
  },
  {
    id: 'user-buyer-1',
    name: 'Budi Santoso',
    email: 'budi@tanipadu.local',
    phone: '6281200000003',
    role: 'buyer',
    createdAt,
  },
];

export const seedFarmerProfiles: FarmerProfile[] = [
  {
    id: 'farmer-profile-1',
    userId: 'user-farmer-1',
    displayName: 'Siti Aminah',
    groupName: 'Kelompok Tani Subur Makmur',
    location: 'Sleman, Daerah Istimewa Yogyakarta',
    whatsappNumber: '6281200000002',
    mainCommodities: ['Cabai Merah', 'Tomat'],
    description: 'Petani sayur musiman dengan panen segar dari lahan keluarga.',
    verificationStatus: 'verified',
    verificationNote: 'Data awal untuk demo MVP.',
    createdAt,
    updatedAt: createdAt,
  },
];

export const seedProducts: Product[] = [
  {
    id: 'product-1',
    farmerId: 'farmer-profile-1',
    name: 'Cabai Merah Segar',
    commodity: 'Cabai Merah',
    description: 'Cabai merah segar hasil panen pagi.',
    price: 42000,
    unit: 'kg',
    stock: 80,
    location: 'Sleman, Daerah Istimewa Yogyakarta',
    availabilityStatus: 'available',
    harvestDate: '2026-07-05',
    createdAt,
    updatedAt: createdAt,
  },
];

export const seedPurchaseRequests: PurchaseRequest[] = [];

export const seedMarketPrices: MarketPrice[] = [
  {
    id: 'market-price-1',
    commodity: 'Cabai Merah',
    marketName: 'Pasar Induk Kramat Jati',
    location: 'Jakarta Timur, DKI Jakarta',
    price: 45000,
    unit: 'kg',
    updatedAt: createdAt,
    sourceNote: 'Data acuan manual untuk demo MVP.',
  },
  {
    id: 'market-price-2',
    commodity: 'Tomat',
    marketName: 'Pasar Beringharjo',
    location: 'Yogyakarta, Daerah Istimewa Yogyakarta',
    price: 12000,
    unit: 'kg',
    updatedAt: createdAt,
    sourceNote: 'Data acuan manual untuk demo MVP.',
  },
];
