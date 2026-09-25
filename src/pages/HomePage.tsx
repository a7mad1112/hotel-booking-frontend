import React from 'react'
import { Sparkles, Shield, Clock, Award, Star } from 'lucide-react'
import { SearchBar } from '@/components/shared/SearchBar'
import { FeaturedDealsSection } from '@/features/home/FeaturedDealsSection'
import { TrendingCitiesSection } from '@/features/home/TrendingCitiesSection'
import { RecentlyBookedSection } from '@/features/home/RecentlyBookedSection'

export function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative min-h-[580px] flex items-center justify-center pt-8 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-[40px]">
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 hero-overlay" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Discover Unmatched Luxury Across 50+ Cities</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight font-display leading-[1.1]">
            Experience Stays Designed <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
              Beyond Extraordinary
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
            Reserve premier boutique suites, iconic oceanfront resorts, and hidden architectural gems with guaranteed lowest rates.
          </p>

          {/* Search Bar Container */}
          <div className="pt-6 max-w-4xl mx-auto">
            <SearchBar variant="hero" />
          </div>

          {/* Stats Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-white/80 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>4.9 / 5 Guest Satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>100% Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Instant Digital Confirmation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Featured Deals */}
        <FeaturedDealsSection />

        {/* Trending Destinations */}
        <TrendingCitiesSection />

        {/* Recently Booked (Auth-Conditional) */}
        <RecentlyBookedSection />

        {/* Value Proposition Grid */}
        <section className="py-16 border-t border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              The GrandVibe Standard
            </span>
            <h2 className="text-3xl font-black text-slate-900 font-display mt-1">
              Elevating Hospitality to an Art
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Hand-Curated Portfolio</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Every listed property undergoes stringent evaluation for aesthetic excellence, comfort, and uncompromising service standards.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Best Rate Guarantee</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Direct integration with hotel owners and partners ensures no hidden booking charges or inflated third-party fees.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Seamless Reservation</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Book in seconds with Stripe checkout. Your reservation is immediately secured and automated email confirmations with invoices are sent.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
