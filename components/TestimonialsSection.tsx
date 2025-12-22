
import React, { useState, useEffect } from 'react';

interface Testimonial {
    id: number;
    name: string;
    business: string;
    businessType: string;
    image?: string;
    rating: number;
    review: string;
    websiteUrl?: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Alemayehu Tadesse",
        business: "Habesha Coffee House",
        businessType: "Restaurant",
        rating: 5,
        review: "AuraWeb transformed our restaurant's online presence. The website is beautiful and brings us new customers every week. Very professional team!",
        websiteUrl: "#"
    },
    {
        id: 2,
        name: "Sara Mulugeta",
        business: "Sara's Beauty Salon",
        businessType: "Beauty Salon",
        rating: 5,
        review: "I couldn't believe how fast they delivered my website - just 2 days! It looks amazing on phones and my clients love booking online. Best investment for my business!",
        websiteUrl: "#"
    },
    {
        id: 3,
        name: "Daniel Bekele",
        business: "Addis Car Parts",
        businessType: "Shop",
        rating: 5,
        review: "Professional, fast, and affordable. They understood exactly what my auto parts shop needed. The payment integration works perfectly!",
        websiteUrl: "#"
    },
    {
        id: 4,
        name: "Tigist Haile",
        business: "Tigist Law Office",
        businessType: "Company",
        rating: 5,
        review: "Our law firm needed a professional website that reflects our expertise. AuraWeb delivered beyond expectations. Highly recommend for any business!",
        websiteUrl: "#"
    },
    {
        id: 5,
        name: "Yohannes Gebre",
        business: "Shola Hotel",
        businessType: "Hotel",
        rating: 5,
        review: "The booking system they built for our hotel is fantastic. Guests can easily check availability and book rooms. Our reservations increased by 50%!",
        websiteUrl: "#"
    },
    {
        id: 6,
        name: "Meron Assefa",
        business: "Meron Fashion",
        businessType: "Shop",
        rating: 5,
        review: "Beautiful e-commerce website that showcases my clothes perfectly. The mobile experience is amazing and customers can easily shop from their phones.",
        websiteUrl: "#"
    }
];

const TestimonialsSection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <svg
                key={i}
                className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-slate-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    return (
        <section className="py-20 bg-gradient-to-b from-white to-blue-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
                        ⭐ Testimonials
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                        What Our Clients Say
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Join hundreds of Ethiopian businesses that trust AuraWeb for their online presence.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                        <p className="text-3xl md:text-4xl font-bold text-blue-600">150+</p>
                        <p className="text-sm text-slate-500">Websites Built</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                        <p className="text-3xl md:text-4xl font-bold text-green-600">100%</p>
                        <p className="text-sm text-slate-500">Satisfaction Rate</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                        <p className="text-3xl md:text-4xl font-bold text-purple-600">3 Days</p>
                        <p className="text-sm text-slate-500">Avg. Delivery</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                        <p className="text-3xl md:text-4xl font-bold text-yellow-600">4.9⭐</p>
                        <p className="text-sm text-slate-500">Average Rating</p>
                    </div>
                </div>

                {/* Featured Testimonial */}
                <div
                    className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    <div className="max-w-4xl mx-auto">
                        {/* Quote Icon */}
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-8 mx-auto">
                            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                        </div>

                        {/* Review Text */}
                        <p className="text-xl md:text-2xl text-slate-700 text-center leading-relaxed mb-8">
                            "{testimonials[activeIndex].review}"
                        </p>

                        {/* Rating */}
                        <div className="flex justify-center gap-1 mb-6">
                            {renderStars(testimonials[activeIndex].rating)}
                        </div>

                        {/* Author */}
                        <div className="text-center">
                            <p className="font-bold text-lg text-slate-800">{testimonials[activeIndex].name}</p>
                            <p className="text-blue-600 font-medium">{testimonials[activeIndex].business}</p>
                            <p className="text-sm text-slate-500">{testimonials[activeIndex].businessType}</p>
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === activeIndex
                                        ? 'bg-blue-600 w-8'
                                        : 'bg-slate-200 hover:bg-slate-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* All Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                        >
                            <div className="flex gap-1 mb-4">
                                {renderStars(testimonial.rating)}
                            </div>
                            <p className="text-slate-600 mb-6 line-clamp-3">"{testimonial.review}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">{testimonial.name}</p>
                                    <p className="text-sm text-slate-500">{testimonial.business}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                        Join Our Happy Clients
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
