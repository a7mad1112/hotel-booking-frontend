import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, RotateCcw, Star, DollarSign, BedDouble, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCities } from '@/hooks/useCities'
import { useRoomTypes } from '@/hooks/useRoomTypes'

interface FilterSidebarProps {
  className?: string
}

export function FilterSidebar({ className }: FilterSidebarProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const { data: citiesData } = useCities({ pageSize: 100 })
  const { data: roomTypesData } = useRoomTypes({ pageSize: 50 })

  // Read current filter values from URL search params
  const cityId = searchParams.get('cityId') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const minStarRating = searchParams.get('minStarRating') || ''
  const roomTypeId = searchParams.get('roomTypeId') || ''
  const adults = searchParams.get('adults') || ''
  const children = searchParams.get('children') || ''
  const rooms = searchParams.get('rooms') || ''

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value && value !== '0') {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    next.set('page', '1') // Reset to page 1 on filter change
    setSearchParams(next)
  }

  const handleReset = () => {
    const next = new URLSearchParams()
    // preserve check-in/check-out if set
    const checkIn = searchParams.get('checkInDate')
    const checkOut = searchParams.get('checkOutDate')
    if (checkIn) next.set('checkInDate', checkIn)
    if (checkOut) next.set('checkOutDate', checkOut)
    setSearchParams(next)
  }

  const hasActiveFilters = Boolean(
    cityId || minPrice || maxPrice || minStarRating || roomTypeId || adults || children || rooms
  )

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-slate-900 font-display text-lg">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* City Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          City / Destination
        </label>
        <select
          value={cityId}
          onChange={(e) => updateParam('cityId', e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
        >
          <option value="">All Destinations</option>
          {citiesData?.items?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}, {c.country}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5" /> Price Range (Per Night)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Min ($)</span>
            <input
              type="number"
              placeholder="0"
              min="0"
              value={minPrice}
              onChange={(e) => updateParam('minPrice', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Max ($)</span>
            <input
              type="number"
              placeholder="1000"
              min="0"
              value={maxPrice}
              onChange={(e) => updateParam('maxPrice', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Minimum Star Rating */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
          <Star className="w-3.5 h-3.5" /> Minimum Rating
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((stars) => {
            const isSelected = minStarRating === String(stars)
            return (
              <button
                key={stars}
                type="button"
                onClick={() => updateParam('minStarRating', isSelected ? '' : String(stars))}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{stars}★</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Room Type */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
          <BedDouble className="w-3.5 h-3.5" /> Room Type
        </label>
        <select
          value={roomTypeId}
          onChange={(e) => updateParam('roomTypeId', e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
        >
          <option value="">All Room Types</option>
          {roomTypesData?.items?.map((rt) => (
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          ))}
        </select>
      </div>

      {/* Guests / Rooms Breakdown */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
          <Users className="w-3.5 h-3.5" /> Guests & Rooms
        </label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Adults</span>
            <input
              type="number"
              min="1"
              max="20"
              placeholder="1"
              value={adults}
              onChange={(e) => updateParam('adults', e.target.value)}
              className="w-full h-9 px-2 text-center rounded-xl border border-slate-200 text-sm text-slate-800"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Children</span>
            <input
              type="number"
              min="0"
              max="10"
              placeholder="0"
              value={children}
              onChange={(e) => updateParam('children', e.target.value)}
              className="w-full h-9 px-2 text-center rounded-xl border border-slate-200 text-sm text-slate-800"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Rooms</span>
            <input
              type="number"
              min="1"
              max="10"
              placeholder="1"
              value={rooms}
              onChange={(e) => updateParam('rooms', e.target.value)}
              className="w-full h-9 px-2 text-center rounded-xl border border-slate-200 text-sm text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
