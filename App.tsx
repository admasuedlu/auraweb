
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
            <Route path="/admin" element={
              <AdminDashboard
                submissions={submissions}
                onUpdateSubmission={updateSubmission}
              />
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
