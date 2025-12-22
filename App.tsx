
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WebsiteSubmission } from './types';
import CustomerFlow from './components/CustomerFlow';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import { api } from './api';

const App: React.FC = () => {
  const [submissions, setSubmissions] = useState<WebsiteSubmission[]>([]);

  // Fetch submissions from backend
  useEffect(() => {
    // Also try to load from local storage as backup or immediate display
    const stored = localStorage.getItem('ethiobuild_submissions');
    if (stored) setSubmissions(JSON.parse(stored));

    // Fetch from real API
    api.fetchSubmissions()
      .then(data => {
        setSubmissions(data);
        localStorage.setItem('ethiobuild_submissions', JSON.stringify(data));
      })
      .catch(err => console.error("Failed to load submissions:", err));
  }, []);

  const handleNewSubmission = (newSub: WebsiteSubmission) => {
    // Prepend new submission to list
    const updated = [newSub, ...submissions];
    setSubmissions(updated);
    localStorage.setItem('ethiobuild_submissions', JSON.stringify(updated));
  };

  const updateSubmission = async (id: string, updates: Partial<WebsiteSubmission>) => {
    // Optimistic update
    const updated = submissions.map(s => s.id === id ? { ...s, ...updates } : s);
    setSubmissions(updated);
    localStorage.setItem('ethiobuild_submissions', JSON.stringify(updated));

    // Send to backend
    try {
      await api.updateSubmission(id, updates);
    } catch (err) {
      console.error("Failed to update submission on server:", err);
      // fallback?
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 font-sans">
        <Navbar />

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <Routes>
            <Route path="/" element={<CustomerFlow onComplete={handleNewSubmission} />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/payment-success" element={
              <div className="max-w-xl mx-auto text-center py-16 bg-white rounded-3xl shadow-xl p-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Payment Successful! 🎉</h2>
                <p className="text-slate-600 mb-8">
                  Thank you for your payment. Our team will begin working on your website immediately.
                  You will receive updates via email.
                </p>
                <a
                  href="/"
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 inline-block"
                >
                  Return to Home
                </a>
              </div>
            } />
          </Routes>
        </main>

        <footer className="bg-white border-t py-8 mt-12 bg-opacity-60 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Aurarise Tech Solution PLC. Empowering Ethiopian Businesses.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
