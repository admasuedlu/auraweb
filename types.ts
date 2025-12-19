
export type BusinessType = 'Company' | 'Hotel' | 'Restaurant' | 'Shop' | 'Personal' | 'Other';
export type ProjectStatus = 'Submitted' | 'In Progress' | 'Completed';
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
}
