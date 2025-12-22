import { WebsiteSubmission, PortfolioItem } from './types';

// Automatically detect API URL based on environment
const API_URL = import.meta.env.VITE_API_URL ||
    (window.location.hostname === 'localhost'
        ? 'http://localhost:8000/api'
        : `${window.location.origin}/api`);

const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { 'Authorization': `Token ${token}` } : {};
};

export interface DashboardStats {
    total_submissions: number;
    today_submissions: number;
    pending_review: number;
    in_progress: number;
    completed: number;
    total_revenue: number;
    pending_payments: number;
    by_package: { package_id: string; count: number }[];
}

export interface PaymentLink {
    checkout_url: string;
    tx_ref: string;
    amount: number;
    currency: string;
}

export const api = {
    async fetchSubmissions(): Promise<WebsiteSubmission[]> {
        const res = await fetch(`${API_URL}/submissions/`, {
            headers: { ...getAuthHeaders() }
        });
        if (res.status === 401 || res.status === 403) throw new Error('Unauthorized');
        if (!res.ok) throw new Error('Failed to fetch submissions');
        return res.json();
    },

    async submitWebsite(data: WebsiteSubmission, files: File[]): Promise<WebsiteSubmission> {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        files.forEach(f => formData.append('files', f));

        const res = await fetch(`${API_URL}/submissions/`, {
            method: 'POST',
            body: formData,
        });
        if (!res.ok) throw new Error('Failed to submit');
        return res.json();
    },

    async updateSubmission(id: string, updates: Partial<WebsiteSubmission>): Promise<void> {
        const res = await fetch(`${API_URL}/submissions/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error('Failed to update');
    },

    async uploadFile(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_URL}/upload/`, {
            method: 'POST',
            headers: { ...getAuthHeaders() },
            body: formData,
        });
        if (!res.ok) throw new Error('Failed to upload file');
        const data = await res.json();
        return data.url;
    },

    // Dashboard APIs
    async fetchDashboardStats(): Promise<DashboardStats> {
        const res = await fetch(`${API_URL}/submissions/dashboard_stats/`, {
            headers: { ...getAuthHeaders() }
        });
        if (res.status === 401 || res.status === 403) throw new Error('Unauthorized');
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
    },

    // Payment APIs
    async createPaymentLink(submissionId: string): Promise<PaymentLink> {
        const res = await fetch(`${API_URL}/submissions/${submissionId}/create_payment/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to create payment link');
        }
        return res.json();
    },

    async verifyPayment(txRef: string): Promise<{ status: string; business_name: string; package: string }> {
        const res = await fetch(`${API_URL}/submissions/verify_payment/?tx_ref=${txRef}`);
        if (!res.ok) throw new Error('Failed to verify payment');
        return res.json();
    },

    // Portfolio APIs
    async fetchPortfolioItems(): Promise<PortfolioItem[]> {
        const res = await fetch(`${API_URL}/portfolio/`);
        if (!res.ok) throw new Error('Failed to fetch portfolio items');
        return res.json();
    },

    async addPortfolioItem(item: PortfolioItem): Promise<PortfolioItem> {
        const res = await fetch(`${API_URL}/portfolio/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error('Failed to add portfolio item');
        return res.json();
    },

    async deletePortfolioItem(id: number): Promise<void> {
        const res = await fetch(`${API_URL}/portfolio/${id}/`, {
            method: 'DELETE',
            headers: { ...getAuthHeaders() },
        });
        if (!res.ok) throw new Error('Failed to delete portfolio item');
    }
};

