export type ProductAvailabilityStatus = 'available' | 'limited' | 'sold_out';

export interface Product {
  id: string;
  farmerId: string;
  name: string;
  commodity: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  location: string;
  availabilityStatus: ProductAvailabilityStatus;
  harvestDate?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
