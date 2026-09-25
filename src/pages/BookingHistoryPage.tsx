import React from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, MapPin, Star, ArrowRight, Compass, ShieldCheck } from 'lucide-react'
import { useBookingHistory } from '@/hooks/useUsers'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/shared/StarRating'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { EmptyState } from '@/components/shared/EmptyState'
import { Skeleton } from '@/components/shared/LoadingSkeleton'
import { getHotelImageUrl } from '@/lib/utils'

export function BookingHistoryPage() {
  const { data: history, isLoading, isError } = useBookingHistory()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-bold mb-2">
            <CalendarCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Travel Ledger</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-display">My Bookings & Stays</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your past reservations and booked luxury accommodations.
          </p>
        </div>

        <Link to="/search">
          <Button variant="gold" size="sm">
            <Compass className="w-4 h-4 mr-1.5" />
            <span>Discover New Destinations</span>
          </Button>
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-3xl overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-600">
          Unable to retrieve your booking history at this time.
        </div>
      ) : !history || history.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No Past Bookings Found"
          description="You haven't completed any hotel reservations yet. Explore our portfolio of handpicked stays!"
          actionLabel="Find Hotels"
          onAction={() => (window.location.href = '/search')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, idx) => (
            <div
              key={`${item.hotelId}-${idx}`}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col"
            >
              {/* Image Header */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={getHotelImageUrl(item.imageUrl, item.hotelId)}
                  alt={item.hotelName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-slate-900/80 backdrop-blur-md">
                  <StarRating rating={item.starRating} size="sm" showNumber />
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-semibold text-slate-800 shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>{item.cityName}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {item.hotelName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Completed Stay</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Rate
                    </span>
                    <PriceDisplay price={item.pricePerNight} size="sm" />
                  </div>

                  <Link to={`/hotels/${item.hotelId}`}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <span>Book Again</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
