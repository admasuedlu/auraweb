
import React, { useState, useEffect } from 'react';
import { WebsiteSubmission } from '../types';
import { api } from '../api';

interface DashboardStats {
  total_submissions: number;
  today_submissions: number;
  pending_review: number;
  in_progress: number;
  completed: number;
  total_revenue: number;
  pending_payments: number;
  by_package: { package_id: string; count: number }[];
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'portfolio'>('overview');
  const [submissions, setSubmissions] = useState<WebsiteSubmission[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<WebsiteSubmission | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('admin_token'));
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subs, statsData] = await Promise.all([
        api.fetchSubmissions(),
        api.fetchDashboardStats()
      ]);
      setSubmissions(subs);
      setStats(statsData);
      setError(null);
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        localStorage.removeItem('admin_token');
        setIsLoggedIn(false);
      } else {
        setError('Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${window.location.hostname === 'localhost' ? 'http://localhost:8000' : ''}/api/auth/login/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginForm),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('admin_token', data.token);
        setIsLoggedIn(true);
        setLoginError('');
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (err) {
      setLoginError('Connection error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateSubmission(id, { status: newStatus as any });
      setSubmissions(prev =>
        prev.map(s => s.id === id ? { ...s, status: newStatus as any } : s)
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleCreatePayment = async (submission: WebsiteSubmission) => {
    try {
      const result = await api.createPaymentLink(submission.id);
      if (result.checkout_url) {
        window.open(result.checkout_url, '_blank');
        loadData(); // Refresh data
      }
    } catch (err) {
      alert('Failed to create payment link');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">A</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-500">Sign in to manage submissions</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-sm text-center">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Submitted': 'bg-yellow-100 text-yellow-800',
      'Reviewed': 'bg-blue-100 text-blue-800',
      'Payment Pending': 'bg-orange-100 text-orange-800',
      'Payment Received': 'bg-green-100 text-green-800',
      'In Progress': 'bg-purple-100 text-purple-800',
      'Completed': 'bg-emerald-100 text-emerald-800',
      'Cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-white">A</span>
            </div>
            <div>
              <h1 className="font-bold text-slate-800">AuraWeb Admin</h1>
              <p className="text-xs text-slate-500">Manage your submissions</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-500 hover:text-red-500 text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-6">
            {(['overview', 'submissions', 'portfolio'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Submissions</p>
                    <p className="text-3xl font-bold text-slate-800">{stats.total_submissions}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📋</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Today</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.today_submissions}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Pending Review</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pending_review}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⏳</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.total_revenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💰</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-bold text-slate-800">Recent Submissions</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {submissions.slice(0, 5).map((sub) => (
                  <div key={sub.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{sub.businessName}</p>
                      <p className="text-sm text-slate-500">{sub.businessType} · {sub.packageId?.toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.status || 'Submitted')}`}>
                        {sub.status}
                      </span>
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-800">All Submissions</h2>
              <button
                onClick={loadData}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Refresh
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Business</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Package</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Contact</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Payment</th>
                    <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <p className="font-medium text-slate-800">{sub.businessName}</p>
                        <p className="text-xs text-slate-500">{sub.businessType}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold uppercase">
                          {sub.packageId}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-800">{sub.phone}</p>
                        <p className="text-xs text-slate-500">{sub.email || 'No email'}</p>
                      </td>
                      <td className="p-4">
                        <select
                          value={sub.status || 'Submitted'}
                          onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                          className={`text-xs font-medium rounded-full px-3 py-1 border-0 ${getStatusColor(sub.status || 'Submitted')}`}
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Payment Pending">Payment Pending</option>
                          <option value="Payment Received">Payment Received</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4">
                        {(sub as any).paymentStatus === 'paid' ? (
                          <span className="text-green-600 text-xs font-bold">✅ Paid</span>
                        ) : (
                          <button
                            onClick={() => handleCreatePayment(sub)}
                            className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                          >
                            Send Payment Link
                          </button>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold text-slate-800 mb-4">Portfolio Management</h2>
            <p className="text-slate-500">Portfolio management coming soon...</p>
          </div>
        )}
      </main>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="font-bold text-xl text-slate-800">{selectedSubmission.businessName}</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Business Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase">Business Type</p>
                  <p className="font-medium text-slate-800">{selectedSubmission.businessType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Package</p>
                  <p className="font-medium text-blue-600">{selectedSubmission.packageId?.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Phone</p>
                  <p className="font-medium text-slate-800">{selectedSubmission.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Email</p>
                  <p className="font-medium text-slate-800">{selectedSubmission.email || 'Not provided'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 uppercase">Address</p>
                  <p className="font-medium text-slate-800">{selectedSubmission.address}</p>
                </div>
              </div>

              {/* About & Services */}
              <div>
                <p className="text-xs text-slate-500 uppercase mb-2">About</p>
                <p className="text-slate-700">{selectedSubmission.aboutUs}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase mb-2">Services</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSubmission.services?.map((s, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Design Preferences */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase">Language</p>
                  <p className="font-medium text-slate-800">{selectedSubmission.language}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Style</p>
                  <p className="font-medium text-slate-800">{selectedSubmission.themeStyle}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Color</p>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: selectedSubmission.primaryColor }}
                    ></span>
                    <span className="text-sm text-slate-600">{selectedSubmission.primaryColor}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <a
                  href={`tel:${selectedSubmission.phone}`}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-center hover:bg-blue-700"
                >
                  📞 Call Customer
                </a>
                {selectedSubmission.email && (
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="flex-1 bg-slate-700 text-white py-3 rounded-xl font-bold text-center hover:bg-slate-800"
                  >
                    ✉️ Email Customer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
