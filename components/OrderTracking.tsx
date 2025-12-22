
import React, { useState } from 'react';
import { api } from '../api';

interface TrackingStep {
    id: number;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'upcoming';
    date?: string;
}

const statusToSteps = (status: string): TrackingStep[] => {
    const allSteps = [
        { id: 1, title: 'Submitted', description: 'Your request has been received' },
        { id: 2, title: 'Under Review', description: 'Our team is reviewing your requirements' },
        { id: 3, title: 'Payment Pending', description: 'Waiting for 50% deposit payment' },
        { id: 4, title: 'Payment Received', description: 'Payment confirmed, development starting' },
        { id: 5, title: 'In Progress', description: 'Your website is being built' },
        { id: 6, title: 'Completed', description: 'Your website is ready!' },
    ];

    const statusMap: Record<string, number> = {
        'Submitted': 1,
        'Reviewed': 2,
        'Payment Pending': 3,
        'Payment Received': 4,
        'In Progress': 5,
        'Completed': 6,
    };

    const currentStep = statusMap[status] || 1;

    return allSteps.map((step) => ({
        ...step,
        status: step.id < currentStep ? 'completed' : step.id === currentStep ? 'current' : 'upcoming',
        date: step.id <= currentStep ? new Date().toLocaleDateString() : undefined,
    }));
};

const OrderTracking: React.FC = () => {
    const [orderId, setOrderId] = useState('');
    const [phone, setPhone] = useState('');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [steps, setSteps] = useState<TrackingStep[]>([]);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Try to fetch by phone number
            const API_URL = window.location.hostname === 'localhost'
                ? 'http://localhost:8000/api'
                : `${window.location.origin}/api`;

            const res = await fetch(`${API_URL}/submissions/track/?phone=${encodeURIComponent(phone)}&order_id=${encodeURIComponent(orderId)}`);

            if (res.ok) {
                const data = await res.json();
                setOrder(data);
                setSteps(statusToSteps(data.status));
            } else {
                setError('Order not found. Please check your details and try again.');
            }
        } catch (err) {
            setError('Unable to track order. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                        Track Your Order
                    </h1>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Enter your phone number or order ID to check the status of your website development project.
                    </p>
                </div>

                {/* Search Form */}
                {!order && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <form onSubmit={handleTrack} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+251 9..."
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Order ID (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., abc123xyz"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !phone}
                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        Track Order
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Order Details */}
                {order && (
                    <div className="space-y-8">
                        {/* Order Info Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">{order.businessName}</h2>
                                    <p className="text-slate-500">Order ID: {order.id}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                    order.status === 'In Progress' ? 'bg-purple-100 text-purple-700' :
                                        order.status === 'Payment Received' ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-slate-500">Package</p>
                                    <p className="font-bold text-slate-800">{order.packageId?.toUpperCase()}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-slate-500">Business Type</p>
                                    <p className="font-bold text-slate-800">{order.businessType}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-slate-500">Submitted</p>
                                    <p className="font-bold text-slate-800">{new Date(order.submittedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Tracker */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h3 className="text-xl font-bold text-slate-800 mb-8">Progress Timeline</h3>

                            <div className="relative">
                                {/* Progress Line */}
                                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                                <div
                                    className="absolute left-6 top-0 w-0.5 bg-blue-600 transition-all duration-500"
                                    style={{ height: `${(steps.filter(s => s.status === 'completed').length / (steps.length - 1)) * 100}%` }}
                                ></div>

                                {/* Steps */}
                                <div className="space-y-8">
                                    {steps.map((step) => (
                                        <div key={step.id} className="flex gap-6 relative">
                                            {/* Step Icon */}
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${step.status === 'completed' ? 'bg-blue-600 text-white' :
                                                step.status === 'current' ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                                                    'bg-slate-100 text-slate-400'
                                                }`}>
                                                {step.status === 'completed' ? (
                                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : step.status === 'current' ? (
                                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                                ) : (
                                                    <span className="text-sm font-bold">{step.id}</span>
                                                )}
                                            </div>

                                            {/* Step Content */}
                                            <div className="flex-1 pb-8">
                                                <h4 className={`font-bold ${step.status === 'upcoming' ? 'text-slate-400' : 'text-slate-800'
                                                    }`}>
                                                    {step.title}
                                                </h4>
                                                <p className={`text-sm ${step.status === 'upcoming' ? 'text-slate-300' : 'text-slate-500'
                                                    }`}>
                                                    {step.description}
                                                </p>
                                                {step.date && (
                                                    <p className="text-xs text-slate-400 mt-1">{step.date}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Back Button */}
                        <button
                            onClick={() => { setOrder(null); setSteps([]); }}
                            className="w-full bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
                        >
                            Track Another Order
                        </button>
                    </div>
                )}

                {/* Help Section */}
                <div className="mt-12 text-center">
                    <p className="text-slate-500 mb-4">Need help with your order?</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://wa.me/251939447263?text=Hello! I need help with my order."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-all"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp Support
                        </a>
                        <a
                            href="mailto:support@auraweb.com"
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
