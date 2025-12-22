
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WebsiteSubmission } from './types';
import CustomerFlow from './components/CustomerFlow';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';
import FAQSection from './components/FAQSection';
import TestimonialsSection from './components/TestimonialsSection';
import OrderTracking from './components/OrderTracking';
import { LanguageProvider } from './components/LanguageContext';
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
    }
  };

  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 font-sans">
          <Navbar />

          <main>
            <Routes>
              {/* Main customer flow page */}
              <Route path="/" element={
                <>
                  <div className="container mx-auto px-4 py-8 max-w-6xl">
                    <CustomerFlow onComplete={handleNewSubmission} />
                  </div>
                  <TestimonialsSection />
                  <FAQSection />
                </>
              } />

              {/* Order Tracking */}
              <Route path="/track" element={<OrderTracking />} />

              {/* FAQ Page (standalone) */}
              <Route path="/faq" element={
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                  <FAQSection />
                </div>
              } />

              {/* Testimonials Page (standalone) */}
              <Route path="/testimonials" element={
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                  <TestimonialsSection />
                </div>
              } />

              {/* Admin Dashboard */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Payment Success Page */}
              <Route path="/payment-success" element={
                <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href="/"
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 inline-block"
                      >
                        Return to Home
                      </a>
                      <a
                        href="/track"
                        className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all inline-block"
                      >
                        Track Your Order
                      </a>
                    </div>
                  </div>
                </div>
              } />
            </Routes>
          </main>

          {/* WhatsApp Floating Button */}
          <WhatsAppButton
            phoneNumber="+251911234567"
            message="Hello! I'm interested in getting a website built. Can you help me?"
          />

          <footer className="bg-white border-t py-8 mt-12 bg-opacity-60 backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-xl font-bold text-white">A</span>
                    </div>
                    <span className="font-bold text-slate-800">AuraWeb</span>
                  </div>
                  <p className="text-slate-500 text-sm">
                    Professional website development for Ethiopian businesses. Fast, affordable, and high quality.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="font-bold text-slate-800 mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/" className="text-slate-500 hover:text-blue-600">Home</a></li>
                    <li><a href="/track" className="text-slate-500 hover:text-blue-600">Track Order</a></li>
                    <li><a href="/faq" className="text-slate-500 hover:text-blue-600">FAQ</a></li>
                    <li><a href="/admin" className="text-slate-500 hover:text-blue-600">Admin</a></li>
                  </ul>
                </div>

                {/* Contact */}
                <div>
                  <h4 className="font-bold text-slate-800 mb-4">Contact Us</h4>
                  <ul className="space-y-2 text-sm text-slate-500">
                    <li>📞 +251 911 234 567</li>
                    <li>✉️ info@auraweb.com</li>
                    <li>📍 Addis Ababa, Ethiopia</li>
                  </ul>
                </div>

                {/* Social */}
                <div>
                  <h4 className="font-bold text-slate-800 mb-4">Follow Us</h4>
                  <div className="flex gap-3">
                    <a href="#" className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-blue-100 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t mt-8 pt-8 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Aurarise Tech Solution PLC. Empowering Ethiopian Businesses.</p>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
