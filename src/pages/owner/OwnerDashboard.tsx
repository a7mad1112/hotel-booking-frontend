import React from 'react'
import { Link } from 'react-router-dom'
import { Building, PlusCircle, Sparkles, BedDouble, Percent, ExternalLink } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useHotels } from '@/hooks/useHotels'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/shared/LoadingSkeleton'

export function OwnerDashboard() {
  const { user } = useAuthStore()
  const { data: hotelsData, isLoading } = useHotels({ pageSize: 100 })

  // Filter hotels owned by current user
  const myHotels = hotelsData?.items?.filter((h) => h.ownerId === user?.id) || []

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 rounded-3xl p-8 text-white shadow-lg space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-200">
          Host Dashboard
        </span>
        <h1 className="text-3xl font-black font-display">
          Welcome back, {user?.email}
        </h1>
        <p className="text-sm text-amber-100 max-w-xl leading-relaxed">
          Manage your luxury properties, configure guest rooms and pricing, upload high-resolution media, and run promotional deals.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <Link to="/owner/hotels/create">
            <Button variant="secondary" size="sm" className="font-bold">
              <PlusCircle className="w-4 h-4 mr-1.5 text-amber-600" />
              List New Hotel
            </Button>
          </Link>
          <Link to="/owner/hotels">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Building className="w-4 h-4 mr-1.5" />
              View My Properties ({myHotels.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Properties
            </span>
            <Building className="w-5 h-5 text-amber-600" />
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="text-3xl font-black text-slate-900">{myHotels.length}</p>
          )}
          <p className="text-xs text-slate-500">Live on the booking network</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Account Role
            </span>
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-amber-600">{user?.role}</p>
          <p className="text-xs text-slate-500">Verified Property Partner</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Action
            </span>
            <Percent className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-sm font-bold text-slate-900">Run Discounts</p>
          <p className="text-xs text-slate-500">Boost occupancy with seasonal deals</p>
        </div>
      </div>

      {/* Recent Properties Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 font-display">My Listed Properties</h3>
          <Link to="/owner/hotels" className="text-xs font-bold text-amber-600 hover:text-amber-700">
            View All &rarr;
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        ) : myHotels.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 text-sm">
            You have not registered any hotels under your account yet.
            <div className="mt-3">
              <Link to="/owner/hotels/create">
                <Button variant="gold" size="sm">
                  Add Your First Hotel
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myHotels.slice(0, 5).map((hotel) => (
              <div
                key={hotel.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-base font-bold text-slate-900">{hotel.name}</h4>
                  <p className="text-xs text-slate-500">
                    {hotel.cityName} &bull; {hotel.starRating} Stars &bull; {hotel.location}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/owner/hotels/${hotel.id}/edit`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Edit
                    </Button>
                  </Link>
                  <Link to={`/owner/hotels/${hotel.id}/rooms`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      <BedDouble className="w-3.5 h-3.5 mr-1" />
                      Rooms
                    </Button>
                  </Link>
                  <Link to={`/owner/hotels/${hotel.id}/deals`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Percent className="w-3.5 h-3.5 mr-1" />
                      Deals
                    </Button>
                  </Link>
                  <Link to={`/hotels/${hotel.id}`} target="_blank">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
