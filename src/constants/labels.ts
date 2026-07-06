import type { FarmerVerificationStatus, OrderStatus, ProductAvailabilityStatus, UserRole } from '../types';

export const ROLE_LABELS: Record<UserRole, string> = {
  farmer: 'Petani',
  buyer: 'Pembeli',
  admin: 'Admin',
};

export const FARMER_VERIFICATION_STATUS_LABELS: Record<FarmerVerificationStatus, string> = {
  unverified: 'Belum Diverifikasi',
  pending: 'Menunggu Verifikasi',
  verified: 'Terverifikasi',
  rejected: 'Ditolak',
};

export const PRODUCT_AVAILABILITY_STATUS_LABELS: Record<ProductAvailabilityStatus, string> = {
  available: 'Tersedia',
  limited: 'Stok Terbatas',
  sold_out: 'Habis',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Menunggu Konfirmasi',
  accepted: 'Diterima',
  rejected: 'Ditolak',
  processing: 'Diproses',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};
