import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: 'general', message: '' });
    }, 4000);
  };

  const faqs = [
    {
      q: 'Are your jute products 100% natural and free of synthetic plastics?',
      a: 'Yes! Every bag, rug, and planter is crafted from pure biodegradable golden jute fiber. We use azo-free vegetable dyes and plastic-free cotton/linen handles and bindings.'
    },
    {
      q: 'How do you pack and ship customer orders?',
      a: 'All orders are shipped in 100% compostable recycled kraft boxes and sealed with water-activated plant-based gum paper tape. Zero bubble wrap or single-use plastics are used.'
    },
    {
      q: 'Do you offer custom designs or bulk wholesale pricing?',
      a: 'Yes, we regularly collaborate with eco-conscious brands, corporate gifting partners, and boutique hotels for customized logo totes and bulk decor. Select "Wholesale & Custom Orders" in the contact form!'
    },
    {
      q: 'How long does delivery take?',
      a: 'Standard domestic delivery takes 3 to 5 business days. Free shipping is automatically applied to orders over $50.'
    }
  ];

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="pb-24 text-left">
      {/* Banner */}
      <div className="bg-gradient-to-b from-[#f7efe4] to-brand-bg py-14 border-b border-brand-border/60 text-center mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[11px] font-extrabold tracking-widest uppercase px-3.5 py-1 rounded-full mb-3">
            <Sparkles size={13} /> WE ARE HERE TO HELP
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-dark mb-4">
            Get in Touch With Our Team
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Whether you have questions regarding our artisan collections, custom corporate orders,
            or care advice, our team is delighted to connect.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Form Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-border/80 p-8 sm:p-10 shadow-xs">
            <h2 className="font-serif text-2xl text-brand-dark mb-1">Send Us A Message</h2>
            <p className="text-xs sm:text-sm text-stone-500 mb-6">
              We typically reply within 24 business hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-border/80 bg-brand-subtle/60 focus:bg-white focus:border-primary text-sm text-brand-dark outline-hidden transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. jane@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-border/80 bg-brand-subtle/60 focus:bg-white focus:border-primary text-sm text-brand-dark outline-hidden transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-border/80 bg-brand-subtle/60 focus:bg-white focus:border-primary text-sm text-brand-dark outline-hidden transition-colors cursor-pointer"
                >
                  <option value="general">Product Inquiry & Sizing</option>
                  <option value="wholesale">Wholesale & Custom Orders</option>
                  <option value="shipping">Order Tracking & Returns</option>
                  <option value="artisan">Artisan Collaboration / Press</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1.5">
                  Message *
                </label>
                <textarea
                  rows="5"
                  placeholder="Tell us how we can help..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-border/80 bg-brand-subtle/60 focus:bg-white focus:border-primary text-sm text-brand-dark outline-hidden transition-colors"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 transition-all cursor-pointer mt-2"
              >
                <Send size={15} /> Send Message
              </button>

              {submitted && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-accent-sage-light text-accent-sage text-xs font-semibold mt-3">
                  <Check size={16} />
                  <span>Thank you! Your message has been sent successfully. We'll be in touch soon.</span>
                </div>
              )}
            </form>
          </div>

          {/* Right Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-brand-border/80 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-brand-dark">Email Us</h4>
                  <p className="text-xs text-stone-600">support@jutecraftnaturals.com</p>
                  <span className="text-[11px] text-stone-400">24/7 online inquiries</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-brand-dark">Phone & WhatsApp</h4>
                  <p className="text-xs text-stone-600">+1 (800) 588-3326</p>
                  <span className="text-[11px] text-stone-400">Mon - Fri, 9am - 6pm EST</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-brand-dark">Artisan Craft Center</h4>
                  <p className="text-xs text-stone-600">Golden Fiber Lane, Hooghly Artisans Hub</p>
                  <span className="text-[11px] text-stone-400">West Bengal, India</span>
                </div>
              </div>
            </div>

            {/* Quick FAQ Box */}
            <div className="bg-white rounded-3xl border border-brand-border/80 p-6 sm:p-8 shadow-xs">
              <h3 className="font-serif text-lg text-brand-dark mb-4">Frequently Asked Questions</h3>
              <div className="space-y-2.5">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-brand-border/60 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-3.5 flex items-center justify-between text-xs sm:text-sm font-bold text-brand-dark bg-brand-subtle/60 hover:bg-brand-subtle transition-colors cursor-pointer text-left"
                    >
                      <span>{faq.q}</span>
                      {openFaq === idx ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    {openFaq === idx && (
                      <p className="p-3.5 text-xs text-stone-600 leading-relaxed bg-white border-t border-brand-border/50">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
