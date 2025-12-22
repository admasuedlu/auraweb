
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'am';

interface Translations {
    [key: string]: {
        en: string;
        am: string;
    };
}

// Translation dictionary
export const translations: Translations = {
    // Navbar
    'nav.home': { en: 'Home', am: 'መነሻ' },
    'nav.packages': { en: 'Packages', am: 'ፓኬጆች' },
    'nav.portfolio': { en: 'Portfolio', am: 'ፖርትፎሊዮ' },
    'nav.faq': { en: 'FAQ', am: 'ጥያቄዎች' },
    'nav.track': { en: 'Track Order', am: 'ትዕዛዝ ይከታተሉ' },
    'nav.admin': { en: 'Admin', am: 'አስተዳዳሪ' },

    // Hero Section
    'hero.tagline': { en: 'Fast & Professional', am: 'ፈጣን እና ሙያዊ' },
    'hero.title': { en: 'Get Your Website in 3 Days', am: 'ድህረ ገጽዎን በ3 ቀናት ይውሰዱ' },
    'hero.subtitle': {
        en: 'Professional websites for Ethiopian businesses. Fast delivery, affordable prices, and premium quality guaranteed.',
        am: 'ለኢትዮጵያ ንግዶች ሙያዊ ድህረ ገጾች። ፈጣን አቅርቦት፣ ተመጣጣኝ ዋጋ እና ከፍተኛ ጥራት ዋስትና።'
    },
    'hero.cta': { en: 'Get Started Now', am: 'አሁን ይጀምሩ' },
    'hero.viewPortfolio': { en: 'View Portfolio', am: 'ፖርትፎሊዮ ይመልከቱ' },

    // Packages
    'packages.title': { en: 'Choose Your Package', am: 'ፓኬጅዎን ይምረጡ' },
    'packages.subtitle': {
        en: 'Affordable pricing for every business size',
        am: 'ለሁሉም የንግድ መጠን ተመጣጣኝ ዋጋ'
    },
    'packages.starter.name': { en: 'Starter', am: 'ጀማሪ' },
    'packages.business.name': { en: 'Business', am: 'ቢዝነስ' },
    'packages.dynamic.name': { en: 'Dynamic', am: 'ዳይናሚክ' },
    'packages.popular': { en: 'Most Popular', am: 'በጣም ተወዳጅ' },
    'packages.select': { en: 'Select Package', am: 'ፓኬጅ ይምረጡ' },

    // Form
    'form.businessName': { en: 'Business Name', am: 'የንግድ ስም' },
    'form.businessType': { en: 'Business Type', am: 'የንግድ ዓይነት' },
    'form.phone': { en: 'Phone Number', am: 'ስልክ ቁጥር' },
    'form.email': { en: 'Email (Optional)', am: 'ኢሜይል (አማራጭ)' },
    'form.address': { en: 'Address', am: 'አድራሻ' },
    'form.aboutUs': { en: 'About Your Business', am: 'ስለ ንግድዎ' },
    'form.services': { en: 'Your Services', am: 'አገልግሎቶችዎ' },
    'form.workingHours': { en: 'Working Hours', am: 'የስራ ሰዓት' },
    'form.submit': { en: 'Submit Request', am: 'ጥያቄ ያስገቡ' },
    'form.next': { en: 'Next', am: 'ቀጣይ' },
    'form.back': { en: 'Back', am: 'ተመለስ' },

    // Design
    'design.title': { en: 'Design Preferences', am: 'የዲዛይን ምርጫዎች' },
    'design.language': { en: 'Website Language', am: 'የድህረገጽ ቋንቋ' },
    'design.color': { en: 'Primary Color', am: 'ዋና ቀለም' },
    'design.style': { en: 'Theme Style', am: 'የገጽ ዘይቤ' },

    // Success
    'success.title': { en: 'Thank You!', am: 'እናመሰግናለን!' },
    'success.message': {
        en: 'Your website request has been submitted successfully. We will contact you within 24 hours.',
        am: 'የድህረ ገጽ ጥያቄዎ በተሳካ ሁኔታ ገብቷል። በ24 ሰዓት ውስጥ እናገኝዎታለን።'
    },

    // FAQ
    'faq.title': { en: 'Frequently Asked Questions', am: 'በተደጋጋሚ የሚጠየቁ ጥያቄዎች' },

    // Testimonials
    'testimonials.title': { en: 'What Our Clients Say', am: 'ደንበኞቻችን ምን ይላሉ' },

    // Footer
    'footer.copyright': {
        en: '© 2025 Aurarise Tech Solution PLC. Empowering Ethiopian Businesses.',
        am: '© 2025 አውራራይዝ ቴክ ሶሉሽን ፒኤልሲ። ለኢትዮጵያ ንግዶች እናበረታታለን።'
    },

    // Order Tracking
    'track.title': { en: 'Track Your Order', am: 'ትዕዛዝዎን ይከታተሉ' },
    'track.search': { en: 'Track Order', am: 'ትዕዛዝ ያግኙ' },
    'track.phone': { en: 'Phone Number', am: 'ስልክ ቁጥር' },
    'track.orderId': { en: 'Order ID', am: 'የትዕዛዝ መለያ' },

    // Status
    'status.submitted': { en: 'Submitted', am: 'ገብቷል' },
    'status.reviewed': { en: 'Reviewed', am: 'ተገምግሟል' },
    'status.paymentPending': { en: 'Payment Pending', am: 'ክፍያ እየተጠበቀ' },
    'status.paymentReceived': { en: 'Payment Received', am: 'ክፍያ ተቀብሏል' },
    'status.inProgress': { en: 'In Progress', am: 'በሂደት ላይ' },
    'status.completed': { en: 'Completed', am: 'ተጠናቅቋል' },

    // Common
    'common.loading': { en: 'Loading...', am: 'እየጫነ...' },
    'common.error': { en: 'Something went wrong', am: 'ችግር ተፈጥሯል' },
    'common.success': { en: 'Success!', am: 'ተሳካ!' },
    'common.or': { en: 'or', am: 'ወይም' },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        // Check localStorage for saved preference
        const saved = localStorage.getItem('auraweb_language');
        return (saved as Language) || 'en';
    });

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('auraweb_language', lang);
    };

    const t = (key: string): string => {
        const translation = translations[key];
        if (!translation) {
            console.warn(`Translation missing for key: ${key}`);
            return key;
        }
        return translation[language];
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// Language Switcher Component
export const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${language === 'en'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => setLanguage('am')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${language === 'am'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
            >
                አማ
            </button>
        </div>
    );
};

export default LanguageContext;
