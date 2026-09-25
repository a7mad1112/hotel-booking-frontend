import React from 'react'
import { Link } from 'react-router-dom'
import { History, ArrowRight, MapPin, Star } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useBookingHistory } from '@/hooks/useUsers'
import { getHotelImageUrl, formatCurrency } from '@/lib/utils'
import { Skeleton } from '@/components/shared/LoadingSkeleton'

export function RecentlyBookedSection() {
  const { isAuthenticated } = useAuthStore()
  const { data: history, isLoading } = useBookingHistory()

  if (!isAuthenticated()) return null
  if (!isLoading && (!history || history.length === 0)) return null

  return (
    <section className="py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-300 text-emerald-800 text-xs font-bold mb-2">
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>Past Travel Experience</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            Recently Visited Retreats
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Revisit properties you've booked in past journeys.
          </p>
        </div>

        <Link
          to="/bookings"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors group self-start sm:self-auto"
        >
          <span>All Past Bookings</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-44 rounded-2xl overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
            ))
          : history?.slice(0, 4).map((item, index) => (
              <Link
                key={`${item.hotelId}-${index}`}
                to={`/hotels/${item.hotelId}`}
                className="group flex items-center gap-4 p-3 rounded-2xl border border-slate-200/80 bg-white hover:border-amber-400 hover:shadow-lg transition-all"
              >
                <img
                  src={getHotelImageUrl(item.imageUrl, item.hotelId)}
                  alt={item.hotelName}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mb-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{Number(item.starRating).toFixed(1)}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-amber-600 transition-colors font-display">
                    {item.hotelName}
                  </h4>
                  <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {item.cityName}
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-2">
                    {formatCurrency(item.pricePerNight)}
                    <span className="text-[10px] text-slate-400 font-normal"> / night</span>
                  </p>
                </div>
              </Link>
            ))}
      </div>
    </section>
  )
}
