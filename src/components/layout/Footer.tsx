import React from 'react'
import { Link } from 'react-router-dom'
import { Compass, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Grand<span className="text-amber-500">Vibe</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated luxury hotels, boutique resorts, and exclusive suites. Experience world-class hospitality tailored to your highest expectations.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <div className="flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Stays</span>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Best Deals</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white font-display uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/search" className="hover:text-amber-400 transition-colors">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link to="/search?minStarRating=5" className="hover:text-amber-400 transition-colors">
                  5-Star Luxury Resorts
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors">
                  Featured Deals
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-amber-400 transition-colors">
                  Boutique Suites
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Stays */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white font-display uppercase tracking-wider">
              My Travel
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/bookings" className="hover:text-amber-400 transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors">
                  Sign In / Register
                </Link>
              </li>
              <li>
                <Link to="/owner" className="hover:text-amber-400 transition-colors">
                  Hotel Owner Portal
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-amber-400 transition-colors">
                  Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust and Payment Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white font-display uppercase tracking-wider">
              Guaranteed Security
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every reservation is backed by enterprise-grade 256-bit SSL encryption and Stripe secure checkout.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <HeartHandshake className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-[11px]">
                <span className="font-semibold text-slate-200 block">Instant Confirmation</span>
                <span className="text-slate-400">PDF receipt sent to your inbox</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} GrandVibe HotelBooking System. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>&bull;</span>
            <span className="hover:text-slate-400 cursor-pointer">Support</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
