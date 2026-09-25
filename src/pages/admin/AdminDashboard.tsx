import React from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Building,
  BedDouble,
  Tag,
  Percent,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react'
import { useCities } from '@/hooks/useCities'
import { useHotels } from '@/hooks/useHotels'
import { useRooms } from '@/hooks/useRooms'
import { useRoomTypes } from '@/hooks/useRoomTypes'
import { useDeals } from '@/hooks/useDeals'
import { Skeleton } from '@/components/shared/LoadingSkeleton'

export function AdminDashboard() {
  const { data: cities, isLoading: loadingCities } = useCities({ pageSize: 1 })
  const { data: hotels, isLoading: loadingHotels } = useHotels({ pageSize: 1 })
  const { data: rooms, isLoading: loadingRooms } = useRooms({ pageSize: 1 })
  const { data: roomTypes, isLoading: loadingTypes } = useRoomTypes({ pageSize: 1 })
  const { data: deals, isLoading: loadingDeals } = useDeals({ pageSize: 1 })

  const stats = [
    {
      title: 'Destinations',
      count: cities?.totalCount,
      loading: loadingCities,
      icon: MapPin,
      path: '/admin/cities',
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Hotels',
      count: hotels?.totalCount,
      loading: loadingHotels,
      icon: Building,
      path: '/admin/hotels',
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      title: 'Rooms',
      count: rooms?.totalCount,
      loading: loadingRooms,
      icon: BedDouble,
      path: '/admin/rooms',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Room Types',
      count: roomTypes?.totalCount,
      loading: loadingTypes,
      icon: Tag,
      path: '/admin/room-types',
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      title: 'Active Deals',
      count: deals?.totalCount,
      loading: loadingDeals,
      icon: Percent,
      path: '/admin/deals',
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-black font-display tracking-tight">System Management</h1>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
            Direct operational access to manage cities, hotel catalogs, room inventories, classification taxonomies, and global promotional campaigns.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Link
              key={s.title}
              to={s.path}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {s.title}
                  </span>
                  {s.loading ? (
                    <Skeleton className="h-8 w-16 mt-2" />
                  ) : (
                    <p className="text-3xl font-black text-slate-900 mt-1">{s.count ?? 0}</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${s.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-amber-600 transition-colors">
                <span>Manage {s.title}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
