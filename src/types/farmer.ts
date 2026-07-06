export type FarmerVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface FarmerProfile {
  id: string;
  userId: string;
  displayName: string;
  groupName?: string;
  location: string;
  whatsappNumber: string;
  mainCommodities: string[];
  description: string;
  verificationStatus: FarmerVerificationStatus;
  verificationNote?: string;
  createdAt: string;
  updatedAt: string;
}
