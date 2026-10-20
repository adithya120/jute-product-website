import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Globe, Heart, ShieldCheck, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="pb-24">
      {/* Banner */}
      <div className="bg-gradient-to-b from-[#f7efe4] to-brand-bg py-14 border-b border-brand-border/60 text-center mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 bg-accent-sage-light text-accent-sage text-[11px] font-extrabold tracking-widest uppercase px-3.5 py-1 rounded-full mb-3">
            <Leaf size={13} /> SUSTAINABILITY AT HEART
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-dark mb-4">
            Weaving A Zero-Waste Future
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            JuteCraft was founded on a simple revelation: the antidote to single-use plastics has
            thrived naturally in Bengal's golden delta fields for thousands of years.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20 text-left">
          <div className="lg:col-span-6">
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
              alt="Artisan weaving jute by hand"
              className="w-full h-[440px] sm:h-[480px] object-cover rounded-3xl shadow-xl"
            />
          </div>
          <div className="lg:col-span-6 flex flex-col">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary block mb-1">
              OUR ORIGINS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark mb-5 leading-snug">
              Honoring Ancient Craft & Modern Conscious Design
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-4">
              Growing up near the fertile riverbanks where golden jute grows tall during the monsoon,
              we witnessed how local communities hand-harvested, retted, and spun natural fibers into
              durable cords without relying on single-use chemical plastics.
            </p>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Today, JuteCraft partners directly with over 450 certified craftswomen and hereditary
              master weavers across West Bengal and Assam, guaranteeing fair ethical wages, safe studio
              working conditions, and a global platform for their breathtaking craftsmanship.
            </p>
          </div>
        </div>

        {/* Impact Numbers */}
        <div className="bg-[#f4ede2] rounded-3xl p-10 sm:p-14 text-center mb-20">
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-dark mb-10">
            Our Collective Footprint So Far
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-primary block mb-1">
                120K+
              </span>
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Plastic Bags Replaced
              </span>
            </div>
            <div>
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-primary block mb-1">
                450+
              </span>
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Artisan Families Empowered
              </span>
            </div>
            <div>
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-primary block mb-1">
                18 Tonnes
              </span>
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                CO2 Sequestered Annually
              </span>
            </div>
            <div>
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-primary block mb-1">
                100%
              </span>
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Plastic-Free Packaging
              </span>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-left">
          <div className="bg-white rounded-3xl border border-brand-border/80 p-8 shadow-xs flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              <Globe size={24} />
            </div>
            <h3 className="font-bold text-lg text-brand-dark">Carbon-Negative Cultivation</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Jute crops absorb more CO2 per hectare than Amazon rainforest trees and release
              elevated oxygen back into the atmosphere in just 120 growing days.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-brand-border/80 p-8 shadow-xs flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              <Heart size={24} />
            </div>
            <h3 className="font-bold text-lg text-brand-dark">Fair Trade & Women Artisans</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              85% of our weaving teams are rural women who achieve financial independence and lead
              community education initiatives through our cooperative fund.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-brand-border/80 p-8 shadow-xs flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-lg text-brand-dark">Soil-Enriching Biodegradability</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Unlike synthetic polyester fabrics that shed microplastics into water systems for
              centuries, pure jute decomposes back into organic compost within 3 months.
            </p>
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-[#241c15] text-white rounded-3xl p-10 sm:p-14 text-center flex flex-col items-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-white mb-3">
            Ready to Make the Switch to Conscious Living?
          </h2>
          <p className="text-sm text-stone-300 max-w-lg mb-6 leading-relaxed">
            Explore our handcrafted bags, organic floor rugs, planters, and accessories today.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-lg shadow-black/20 transition-all"
          >
            Explore The Collection <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
