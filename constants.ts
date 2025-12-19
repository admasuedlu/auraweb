
import { Package, BusinessType } from './types';

export const PACKAGES: Package[] = [
  {
    id: 'starter',
    name: 'Starter Landing Page',
    price: '7,000 ETB',
    timeline: '3 Days',
    revisions: 2,
    features: ['Single Page', 'Mobile Responsive', 'Contact Form', '1 Month Support']
  },
  {
    id: 'business',
    name: 'Business Pro',
    price: '10,000 ETB',
    timeline: '3 Days',
    revisions: 5,
    features: ['Up to 5 Pages', 'SEO Optimization', 'Custom Domain Setup', 'Social Media Integration']
  },
  {
    id: 'dynamic',
    name: 'Dynamic Website',
    price: '14,999 ETB',
    timeline: '3 Days',
    revisions: 10,
    features: ['Dynamic Content Management', 'Admin Dashboard', 'Database Integration', '3 Months Support']
  }
];

export const BUSINESS_TYPES: BusinessType[] = [
  'Company', 'Hotel', 'Restaurant', 'Shop', 'Personal', 'Other'
];

export const THEME_STYLES = [
  'Modern & Clean',
  'Elegant & Luxury',
  'Creative & Colorful',
  'Professional & Corporate',
  'Minimalist'
];

export const COLORS = [
  { name: 'Addis Blue', hex: '#1e40af' },
  { name: 'Heritage Green', hex: '#15803d' },
  { name: 'Modern Gold', hex: '#a16207' },
  { name: 'Classic Black', hex: '#18181b' },
  { name: 'Bold Red', hex: '#b91c1c' }
];

export const PORTFOLIO_ITEMS = [
  {
    title: 'Kuriftu Resort & Spa',
    category: 'Hotel & Tourism',
    url: 'https://kurifturesorts.com/',
    description: 'Luxury resort booking platform with immersive gallery.'
  },
  {
    title: 'Tomoca Coffee',
    category: 'E-commerce',
    url: 'https://www.tomocacoffee.com/',
    description: 'Global coffee shop chain with online ordering system.'
  },
  {
    title: 'Zeleman Productions',
    category: 'Creative Agency',
    url: 'https://zeleman.com/',
    description: 'Interactive portfolio for a leading media production house.'
  }
];
