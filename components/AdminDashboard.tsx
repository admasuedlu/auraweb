
import React, { useState, useEffect } from 'react';
import { WebsiteSubmission, ProjectStatus, PortfolioItem } from '../types';
import { api } from '../api';
import Login from './Login';

interface AdminDashboardProps {
  submissions: WebsiteSubmission[];
  onUpdateSubmission: (id: string, updates: Partial<WebsiteSubmission>) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ submissions = [], onUpdateSubmission }) => {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [activeTab, setActiveTab] = useState<'submissions' | 'portfolio'>('submissions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Portfolio State
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [newPortfolioItem, setNewPortfolioItem] = useState<Partial<PortfolioItem>>({
    title: '', category: '', url: '', description: ''
  });
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);

  useEffect(() => {
    if (activeTab === 'portfolio') {
      loadPortfolio();
    }
  }, [activeTab]);

  const loadPortfolio = async () => {
    try {
      const items = await api.fetchPortfolioItems();
      setPortfolioItems(items);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newPortfolioItem.title || !newPortfolioItem.url) return;
      await api.addPortfolioItem(newPortfolioItem as PortfolioItem);
      await loadPortfolio();
      setNewPortfolioItem({ title: '', category: '', url: '', description: '' });
      setIsAddingPortfolio(false);
    } catch (err) {
      alert('Failed to add item');
    }
  };

  const handleDeletePortfolio = async (id: number) => {
    if (!window.confirm('Delete this portfolio item?')) return;
    try {
      await api.deletePortfolioItem(id);
      await loadPortfolio();
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  if (!token) {
    return <Login onLogin={(t) => {
      localStorage.setItem('admin_token', t);
      setToken(t);
      window.location.reload();
    }} />;
  }

  // Find the currently selected submission based on ID to ensure we have the latest data
  const selectedSub = submissions.find(s => s.id === selectedId) || null;

  const filtered = (submissions || []).filter(s => {
    const name = s?.businessName || '';
    const phone = s?.phone || '';
    const search = searchTerm || '';

    return name.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search);
  });

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'Submitted': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateSubmission(selectedId, { logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedId) {
      onUpdateSubmission(selectedId, { specialNotes: e.target.value });
    }
  };

  const handleAboutUsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedId) {
      onUpdateSubmission(selectedId, { aboutUs: e.target.value });
    }
  };

  const handleMapsLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedId) {
      onUpdateSubmission(selectedId, { googleMapsLink: e.target.value });
    }
  };

  const handleServiceEdit = (index: number, value: string) => {
    if (selectedId && selectedSub) {
      const updatedServices = [...(selectedSub.services || [])];
      updatedServices[index] = value;
      onUpdateSubmission(selectedId, { services: updatedServices });
    }
  };

  const addService = () => {
    if (selectedId && selectedSub) {
      onUpdateSubmission(selectedId, { services: [...(selectedSub.services || []), ''] });
    }
  };

  const removeService = (index: number) => {
    if (selectedId && selectedSub) {
      const updatedServices = (selectedSub.services || []).filter((_, i) => i !== index);
      onUpdateSubmission(selectedId, { services: updatedServices });
    }
  };

  const renderSubmissions = () => (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Submissions List */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-4">Business</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((s) => (
              <tr
                key={s.id}
                className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedId === s.id ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedId(s.id)}
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{s.businessName || 'Unnamed Business'}</div>
                  <div className="text-xs text-slate-500 capitalize">{s.packageId} · {s.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(s.status)}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <button
                    className="text-blue-600 hover:text-blue-800 font-bold text-xs"
                    onClick={(e) => { e.stopPropagation(); setSelectedId(s.id); }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                  No matching requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Selected Detail View */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 h-fit sticky top-24 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {selectedSub ? (
          <div className="animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-800">Project Detail</h3>
              <button onClick={() => setSelectedId(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-6 text-sm">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Business Logo</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-16 h-16 bg-white border rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    {selectedSub.logoUrl ? (
                      <img src={selectedSub.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <svg className="w-8 h-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="admin-logo-upload"
                      onChange={handleLogoUpload}
                    />
                    <label
                      htmlFor="admin-logo-upload"
                      className="inline-block px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      {selectedSub.logoUrl ? 'Change Logo' : 'Upload Logo'}
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Project Media</label>
                {(() => {
                  let urls: string[] = [];
                  const rawUrls = selectedSub.imageUrls;

                  if (Array.isArray(rawUrls)) {
                    urls = rawUrls;
                  } else if (typeof rawUrls === 'string') {
                    try {
                      // Attempt to parse if it's a stringified JSON (common issue with some DB/Serializer setups)
                      const parsed = JSON.parse(rawUrls);
                      if (Array.isArray(parsed)) urls = parsed;
                    } catch (e) {
                      // validation that it is not a JSON, maybe a single URL?
                      if (rawUrls.startsWith('http')) urls = [rawUrls];
                    }
                  }

                  if (urls.length > 0) {
                    return (
                      <div className="grid grid-cols-3 gap-2">
                        {urls.map((url, idx) => (
                          <div
                            key={idx}
                            className="aspect-square bg-slate-50 border rounded-lg overflow-hidden relative group"
                          >
                            <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/90 rounded-full text-slate-700 hover:text-blue-600 hover:scale-110 transition-all shadow-sm"
                                title="View Fullsize"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return <p className="text-xs text-slate-400 italic">No additional media uploaded.</p>;
                })()}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Quick Actions</label>
                <div className="flex gap-2">
                  {['Submitted', 'In Progress', 'Completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => onUpdateSubmission(selectedSub.id, { status: status as ProjectStatus })}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${selectedSub.status === status
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                <p className="flex justify-between"><span className="text-slate-500">Package:</span> <span className="font-bold text-blue-600 uppercase">{selectedSub.packageId}</span></p>
                <p className="flex justify-between"><span className="text-slate-500">Type:</span> <span>{selectedSub.businessType}</span></p>
                <p className="flex justify-between"><span className="text-slate-500">Address:</span> <span className="text-right ml-4">{selectedSub.address}</span></p>
                <p className="flex justify-between"><span className="text-slate-500">Language:</span> <span>{selectedSub.language}</span></p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Google Maps Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste Google Maps URL here..."
                    className="flex-1 p-2 rounded-lg border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedSub.googleMapsLink || ''}
                    onChange={handleMapsLinkChange}
                  />
                  {selectedSub.googleMapsLink && (
                    <a
                      href={selectedSub.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                      title="Open in Maps"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">About Content / Description</label>
                <textarea
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-xs text-slate-700 italic leading-relaxed"
                  rows={4}
                  placeholder="Refine the 'About Us' description..."
                  value={selectedSub.aboutUs || ''}
                  onChange={handleAboutUsChange}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Services</label>
                <div className="space-y-2">
                  {(selectedSub.services || []).map((svc, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 p-2 rounded-lg border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        value={svc}
                        onChange={(e) => handleServiceEdit(i, e.target.value)}
                      />
                      <button
                        onClick={() => removeService(i)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove Service"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addService}
                    className="w-full py-2 border border-dashed border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Service
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Internal Admin Notes / Special Instructions</label>
                <textarea
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-xs text-slate-700"
                  rows={4}
                  placeholder="Add special instructions, revision notes, or internal tracking details..."
                  value={selectedSub.specialNotes || ''}
                  onChange={handleNotesChange}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => {
                    const element = document.createElement("a");
                    const file = new Blob([JSON.stringify(selectedSub, null, 2)], { type: 'application/json' });
                    element.href = URL.createObjectURL(file);
                    element.download = `${selectedSub.businessName.replace(/\s+/g, '_')}_brief.json`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-blue-700 shadow-md shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download JSON Brief
                </button>
                <a
                  href={`tel:${selectedSub.phone}`}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-50 text-green-600 border border-green-100 hover:bg-green-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-400">
            <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-medium">Select a submission to see the full brief and take action</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-blue-50 p-6 rounded-2xl border border-blue-100">
        <div>
          <h3 className="text-xl font-bold text-blue-900">Portfolio Items</h3>
          <p className="text-sm text-blue-600">These will appear on the customer submission form.</p>
        </div>
        <button
          onClick={() => setIsAddingPortfolio(!isAddingPortfolio)}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors"
        >
          {isAddingPortfolio ? 'Cancel Adding' : '+ Add New Item'}
        </button>
      </div>

      {isAddingPortfolio && (
        <form onSubmit={handleAddPortfolio} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h4 className="font-bold text-slate-800">Add New Portfolio Project</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="p-3 border rounded-xl w-full"
              placeholder="Project Title (e.g. Kuriftu Resort)"
              value={newPortfolioItem.title}
              onChange={e => setNewPortfolioItem({ ...newPortfolioItem, title: e.target.value })}
              required
            />
            <input
              className="p-3 border rounded-xl w-full"
              placeholder="Category (e.g. Hotel & Tourism)"
              value={newPortfolioItem.category}
              onChange={e => setNewPortfolioItem({ ...newPortfolioItem, category: e.target.value })}
              required
            />
            <input
              className="p-3 border rounded-xl w-full md:col-span-2"
              placeholder="Website URL (https://...)"
              type="url"
              value={newPortfolioItem.url}
              onChange={e => setNewPortfolioItem({ ...newPortfolioItem, url: e.target.value })}
              required
            />
            <textarea
              className="p-3 border rounded-xl w-full md:col-span-2"
              placeholder="Short description of the project..."
              rows={2}
              value={newPortfolioItem.description}
              onChange={e => setNewPortfolioItem({ ...newPortfolioItem, description: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-green-700">Save Item</button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => item.id && handleDeletePortfolio(item.id)}
                className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100"
                title="Delete Item"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2 inline-block">{item.category}</span>
            <h4 className="font-bold text-lg text-slate-800">{item.title}</h4>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-blue-500 truncate block mb-2">{item.url}</a>
            <p className="text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Management Console</h2>
          <p className="text-slate-500">Manage incoming website requests</p>
        </div>

        <div className="flex gap-4 items-center">
          {/* Tab Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'submissions' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Submissions
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'portfolio' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Portfolio
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full md:w-60 pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {activeTab === 'submissions' ? renderSubmissions() : renderPortfolio()}
    </div>
  );
};

export default AdminDashboard;
