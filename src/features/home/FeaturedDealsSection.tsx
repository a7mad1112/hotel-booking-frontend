import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useFeaturedDeals } from '@/hooks/useHotels'
import { HotelCard } from '@/components/shared/HotelCard'
import { HotelCardSkeleton } from '@/components/shared/LoadingSkeleton'

export function FeaturedDealsSection() {
  const { data: deals, isLoading, isError } = useFeaturedDeals()

  if (isError) return null // Silent fail as per specification (Section 23)
  if (!isLoading && (!deals || deals.length === 0)) return null

  return (
    <section className="py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-300 text-amber-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Limited-Time Offers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            Featured Deals & Escapes
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Exclusive discounted pricing on top-rated boutique hotels and luxury resorts.
          </p>
        </div>

        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors group self-start sm:self-auto"
        >
          <span>Explore All Hotels</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <HotelCardSkeleton key={i} />)
          : deals?.slice(0, 5).map((deal) => (
              <HotelCard key={deal.hotelId} hotel={deal} featured />
            ))}
      </div>
    </section>
  )
}
