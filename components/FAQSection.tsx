
import React, { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "How long does it take to build my website?",
        answer: "Our standard delivery time is 3 days for all packages. Starter packages may be delivered in 2 days, while Dynamic websites with complex features might take up to 5 days. We'll keep you updated throughout the process."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept Telebirr, CBE Birr, bank transfers, and credit/debit cards through our secure Chapa payment gateway. You pay a 50% deposit upfront, and the remaining 50% upon completion."
    },
    {
        question: "Can I provide my own content and images?",
        answer: "Absolutely! We encourage you to provide your own images, text content, and branding materials. If you don't have professional images, we can use high-quality stock photos at no extra cost."
    },
    {
        question: "Will my website be mobile-friendly?",
        answer: "Yes! All our websites are fully responsive and look great on all devices - phones, tablets, laptops, and desktops. Mobile optimization is included in every package."
    },
    {
        question: "Do you provide website hosting?",
        answer: "Hosting setup is included in our packages. We can help you set up hosting on your preferred provider, or recommend reliable hosting services suitable for your needs and budget."
    },
    {
        question: "Can I make changes after the website is completed?",
        answer: "Yes! Each package includes revision rounds (2-10 depending on your package). After completion, we provide training on how to update your content, or you can hire us for ongoing maintenance."
    },
    {
        question: "Do you offer SEO services?",
        answer: "Basic SEO optimization is included in our Business and Dynamic packages. This includes meta tags, site structure, speed optimization, and Google Search Console setup. Advanced SEO can be added as an extra service."
    },
    {
        question: "What if I'm not satisfied with the design?",
        answer: "We work closely with you during the design process. Each package includes revision rounds to ensure you're happy with the result. We don't consider a project complete until you're satisfied."
    },
    {
        question: "Can I track my project progress?",
        answer: "Yes! You'll have access to our order tracking system where you can see your project status, view updates, and communicate with our team throughout the development process."
    },
    {
        question: "Do you provide ongoing support?",
        answer: "Yes! All packages include support (1-3 months depending on package). After the support period, you can purchase extended support packages or pay for individual support requests."
    }
];

const FAQSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
                        FAQ
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Got questions? We've got answers. If you can't find what you're looking for,
                        feel free to contact us via WhatsApp or email.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left"
                            >
                                <span className="font-semibold text-slate-800 pr-4">{faq.question}</span>
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-transform duration-300 ${openIndex === index ? 'rotate-180 bg-blue-100' : ''
                                    }`}>
                                    <svg
                                        className={`w-4 h-4 ${openIndex === index ? 'text-blue-600' : 'text-slate-500'}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>
                            <div
                                className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 pb-5' : 'max-h-0'
                                    }`}
                            >
                                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <p className="text-slate-500 mb-4">Still have questions?</p>
                    <a
                        href="https://wa.me/251939447263?text=Hello! I have a question about your services."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-all"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Chat on WhatsApp
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
