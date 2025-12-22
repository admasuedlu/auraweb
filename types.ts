
export type BusinessType = 'Company' | 'Hotel' | 'Restaurant' | 'Shop' | 'Personal' | 'Other';
export type ProjectStatus = 'Submitted' | 'Reviewed' | 'Payment Pending' | 'Payment Received' | 'In Progress' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type LanguagePreference = 'English' | 'Amharic' | 'Both';

export interface Package {
  id: string;
  name: string;
  price: string;
  timeline: string;
  revisions: number;
  features: string[];
}

export interface PortfolioItem {
  id?: number;
  title: string;
  category: string;
  url: string;
  description: string;
  created_at?: string;
}

export interface WebsiteSubmission {
  id: string;
  submittedAt: string;
  status: ProjectStatus;

  // Profile
  packageId: string;
  businessName: string;
  businessType: BusinessType;
  phone: string;
  email?: string;
  address: string;
  googleMapsLink?: string;

  // Content
  aboutUs: string;
  services: string[];
  workingHours: string;
  socialLinks: {
    facebook?: string;
    telegram?: string;
    instagram?: string;
    youtube?: string;
  };

  // Design
  language: LanguagePreference;
  primaryColor: string;
  themeStyle: string;
  specialNotes?: string;

  // Media
  logoUrl?: string;
  imageUrls: string[];

  // Payment (optional, for admin view)
  paymentStatus?: PaymentStatus;
  paymentTxRef?: string;
  paymentAmount?: number;
  paidAt?: string;
  depositAmount?: number;

  // Admin fields (optional)
  adminNotes?: string;
  assignedTo?: string;
  estimatedDelivery?: string;
}

