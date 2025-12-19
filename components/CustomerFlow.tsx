
import React, { useState } from 'react';
import { WebsiteSubmission, BusinessType, LanguagePreference } from '../types';
import { PACKAGES, BUSINESS_TYPES, THEME_STYLES, COLORS, PORTFOLIO_ITEMS } from '../constants';
import { api } from '../api';

interface CustomerFlowProps {
  onComplete: (data: WebsiteSubmission) => void;
}

const CustomerFlow: React.FC<CustomerFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState(PORTFOLIO_ITEMS);

  React.useEffect(() => {
    api.fetchPortfolioItems()
      .then(items => {
        if (items && items.length > 0) {
          setPortfolioItems(items);
        }
      })
      .catch(err => console.error("Failed to load portfolio items:", err));
  }, []);

  const [formData, setFormData] = useState<Partial<WebsiteSubmission>>({
    packageId: 'business',
    businessType: 'Company',
    language: 'English',
    primaryColor: COLORS[0].hex,
    themeStyle: THEME_STYLES[0],
    services: [''],
    socialLinks: {},
    imageUrls: []
  });

  const [uploadedFiles, setUploadedFiles] = useState<{ name: string, size: string }[]>([]);
  const [uploadedFileObjects, setUploadedFileObjects] = useState<File[]>([]);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const updateField = (field: keyof WebsiteSubmission, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (index: number, value: string) => {
    const updated = [...(formData.services || [])];
    updated[index] = value;
    updateField('services', updated);
  };

  const removeServiceField = (index: number) => {
    const updated = (formData.services || []).filter((_, i) => i !== index);
    if (updated.length === 0) updated.push('');
    updateField('services', updated);
  };

  const addServiceField = () => {
    updateField('services', [...(formData.services || []), '']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure data integrity before finalizing
    const finalData: WebsiteSubmission = {
      id: Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
      packageId: formData.packageId || 'starter',
      businessName: formData.businessName || 'N/A',
      businessType: formData.businessType || 'Other',
      phone: formData.phone || 'N/A',
      email: formData.email,
      address: formData.address || 'N/A',
      googleMapsLink: formData.googleMapsLink,
      aboutUs: formData.aboutUs || '',
      services: (formData.services || []).filter(s => s.trim() !== ''),
      workingHours: formData.workingHours || '',
      socialLinks: formData.socialLinks || {},
      language: formData.language || 'English',
      primaryColor: formData.primaryColor || '#000000',
      themeStyle: formData.themeStyle || 'Modern & Clean',
      specialNotes: formData.specialNotes,
      // Initial URLs will be empty, they get populated by backend return + upload helper if needed,
      // but here we rely on the multipart upload in api.submitWebsite to handle the images.
      imageUrls: []
    };

    try {
      // Collect actual file objects from state (we need to track files, not just simulating metadata now)
      // Note: We need to modify the file input handler to actually save the File objects to state.
      // Currently 'uploadedFiles' only has metadata. We need to fix that first.

      // Assuming 'uploadedFileObjects' state exists (see next tool calls)
      console.log('DEBUG: Submitting with files:', uploadedFileObjects.length);
      const savedSub = await api.submitWebsite(finalData, uploadedFileObjects);

      onComplete(savedSub);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Failed to submit. Please check your connection.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Submission Received!</h2>
        <p className="text-slate-600 mb-8">
          Thank you for choosing EthioBuild. Our team will review your information and contact you within 24 hours to begin development.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          Start New Request
        </button>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Select Your Package</h2>
              <p className="text-slate-500">Choose the best fit for your business goals</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => updateField('packageId', pkg.id)}
                  className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-lg ${formData.packageId === pkg.id
                    ? 'border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600/10'
                    : 'border-slate-100 bg-white'
                    }`}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-800">{pkg.name}</h3>
                    <p className="text-2xl font-black text-blue-600 mt-2">{pkg.price}</p>
                    <p className="text-sm text-slate-500 mt-1">Delivery in {pkg.timeline}</p>
                  </div>
                  <ul className="space-y-2 mb-6 text-sm text-slate-600">
                    {pkg.features.map(f => (
                      <li key={f} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        {f}
                      </li>
                    ))}
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      {pkg.revisions} Design Revisions
                    </li>
                  </ul>
                  {formData.packageId === pkg.id && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white p-1 rounded-full">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Previous Work Section */}
            <div className="mt-16 pt-8 border-t border-slate-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800">Seen Our Previous Work</h3>
                <p className="text-slate-500">Explore websites we've built for other businesses</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {portfolioItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all group hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">{item.category}</span>
                      <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Business Profile</h2>
              <p className="text-slate-500">Tell us who you are</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl shadow-sm border">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Business/Personal Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Addis Flower Shop or Kebede's Portfolio"
                  className="w-full p-4 rounded-xl border border-slate-200 outline-none input-premium text-slate-700 font-medium"
                  value={formData.businessName || ''}
                  onChange={(e) => updateField('businessName', e.target.value)}
                  required
                />
                <p className="text-xs text-slate-400 pl-1">The official name that will appear on your website.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Business Type *</label>
                <select
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                  value={formData.businessType}
                  onChange={(e) => updateField('businessType', e.target.value)}
                >
                  {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+251 9..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="contact@yourbusiness.com"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700">Physical Address *</label>
                <input
                  type="text"
                  placeholder="e.g., Bole, Ward 03, House #123"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.address || ''}
                  onChange={(e) => updateField('address', e.target.value)}
                  required
                />
                <p className="text-xs text-slate-400 pl-1">Where can customers find you? (City, Sub-city, Woreda, Specific Location)</p>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700">Google Maps Link (Optional)</label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full p-4 pl-12 rounded-xl border border-slate-200 outline-none input-premium text-slate-700"
                    value={formData.googleMapsLink || ''}
                    onChange={(e) => updateField('googleMapsLink', e.target.value)}
                  />
                  <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-400 pl-1">Help customers navigate to you directly. (Paste the 'Share' link from Google Maps)</p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Website Content</h2>
              <p className="text-slate-500">What should we tell your customers?</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">About Us Description *</label>
                <p className="text-xs text-slate-400 italic mb-2">Example: "We are a boutique hotel in Gondar providing luxury rooms since 2015."</p>
                <textarea
                  rows={4}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Write a short description of your business..."
                  value={formData.aboutUs || ''}
                  onChange={(e) => updateField('aboutUs', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-700">Services or Products *</label>
                {formData.services?.map((service, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Service ${idx + 1} (e.g., Room Service)`}
                      className="flex-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={service}
                      onChange={(e) => handleServiceChange(idx, e.target.value)}
                    />
                    {formData.services && formData.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeServiceField(idx)}
                        className="p-3 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addServiceField}
                  className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:text-blue-700"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add Another Service
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Working Hours *</label>
                  <input
                    type="text"
                    placeholder="e.g., Mon-Sat: 8 AM - 6 PM"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.workingHours || ''}
                    onChange={(e) => updateField('workingHours', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Telegram Username (Optional)</label>
                  <input
                    type="text"
                    placeholder="@username"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.socialLinks?.telegram || ''}
                    onChange={(e) => updateField('socialLinks', { ...formData.socialLinks, telegram: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">YouTube Channel (Optional)</label>
                  <input
                    type="text"
                    placeholder="Channel Name or URL"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.socialLinks?.youtube || ''}
                    onChange={(e) => updateField('socialLinks', { ...formData.socialLinks, youtube: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Design & Media</h2>
              <p className="text-slate-500">Customize the look and feel</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-700">Preferred Language</label>
                  <div className="flex gap-4">
                    {['English', 'Amharic', 'Both'].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => updateField('language', lang)}
                        className={`flex-1 p-3 rounded-xl border font-medium transition-all ${formData.language === lang
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-200'
                          }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-700">Primary Brand Color</label>
                  <div className="flex flex-wrap gap-4">
                    {COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => updateField('primaryColor', c.hex)}
                        title={c.name}
                        className={`w-10 h-10 rounded-full border-2 transition-all scale-100 hover:scale-110 ${formData.primaryColor === c.hex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-white'
                          }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-700">Website Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {THEME_STYLES.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => updateField('themeStyle', style)}
                      className={`p-3 text-xs font-semibold rounded-xl border transition-all ${formData.themeStyle === style
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-slate-600 border-slate-200'
                        }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h4 className="font-semibold text-slate-800">Upload Logo & Images</h4>
                <p className="text-sm text-slate-500 mt-1">If no images are provided, we will use professional stock photos for you.</p>
                <label
                  htmlFor="media-upload"
                  className="mt-4 inline-block btn-primary text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 cursor-pointer hover:scale-105 transition-transform"
                >
                  Choose Files to Upload
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="media-upload"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files) {
                      const files: File[] = Array.from(e.target.files);
                      setUploadedFileObjects(prev => [...prev, ...files]);

                      const newMetadata = files.map(f => ({
                        name: f.name,
                        size: (f.size / 1024).toFixed(1) + ' KB'
                      }));
                      setUploadedFiles(prev => [...prev, ...newMetadata]);
                    }
                  }}
                />
              </div>

              {/* Uploaded File List */}
              {uploadedFiles.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Allocated Images</h5>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-blue-50 text-blue-500 flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">{file.name}</p>
                            <p className="text-[10px] text-slate-400">{file.size}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFiles(prev => prev.filter((_, idx) => idx !== i));
                            setUploadedFileObjects(prev => prev.filter((_, idx) => idx !== i));
                          }}
                          className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Review & Submit</h2>
              <p className="text-slate-500">Double check your details before we start</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
              <div className="grid md:grid-cols-2 gap-8 text-sm">
                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-4">Business Details</h4>
                  <div className="space-y-2">
                    <p><span className="text-slate-500">Name:</span> <span className="font-semibold text-slate-800">{formData.businessName || 'N/A'}</span></p>
                    <p><span className="text-slate-500">Type:</span> <span className="font-semibold text-slate-800">{formData.businessType || 'N/A'}</span></p>
                    <p><span className="text-slate-500">Contact:</span> <span className="font-semibold text-slate-800">{formData.phone || 'N/A'}</span></p>
                    {formData.googleMapsLink && (
                      <p><span className="text-slate-500">Map:</span> <a href={formData.googleMapsLink} target="_blank" className="font-semibold text-blue-600 hover:underline cursor-pointer truncate block max-w-[200px]">{formData.googleMapsLink}</a></p>
                    )}
                    <p><span className="text-slate-500">Package:</span> <span className="font-semibold text-blue-600 uppercase">{formData.packageId || 'starter'}</span></p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-4">Preferences</h4>
                  <div className="space-y-2">
                    <p><span className="text-slate-500">Language:</span> <span className="font-semibold text-slate-800">{formData.language || 'English'}</span></p>
                    <p><span className="text-slate-500">Style:</span> <span className="font-semibold text-slate-800">{formData.themeStyle || 'Modern'}</span></p>
                    <p><span className="text-slate-500">Color:</span> <span className="inline-block w-3 h-3 rounded-full ml-1" style={{ backgroundColor: formData.primaryColor || '#0000' }}></span></p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border-yellow-100">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded text-blue-600" id="confirm-payment" required />
                <label htmlFor="confirm-payment" className="text-sm text-yellow-800">
                  I confirm that all provided information is accurate. I understand that I will receive a payment link/invoice to settle the 50% down payment before development begins.
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-12 px-4 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 -z-10 rounded-full" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 -z-10 transition-all duration-500 rounded-full"
          style={{ width: `${((step - 1) / 4) * 100}%` }}
        />
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${step >= s ? 'bg-blue-600 text-white ring-4 ring-blue-50' : 'bg-white text-slate-400'
              }`}
          >
            {s}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {renderStep()}

        <div className="flex justify-between mt-12 px-4">
          <button
            type="button"
            onClick={prevStep}
            className={`px-8 py-3 rounded-xl font-bold border border-slate-200 bg-white text-slate-600 transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-slate-50'
              }`}
          >
            Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 rounded-xl font-bold bg-blue-600 text-white transition-all hover:bg-blue-700 shadow-lg shadow-blue-200"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              className="px-8 py-3 rounded-xl font-bold bg-green-600 text-white transition-all hover:bg-green-700 shadow-lg shadow-green-200"
            >
              Submit Requirements
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CustomerFlow;
