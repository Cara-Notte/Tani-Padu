export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'processing' | 'completed' | 'cancelled';

export interface PurchaseRequest {
  id: string;
  productId: string;
  farmerId: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  quantity: number;
  unit: string;
  note?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
