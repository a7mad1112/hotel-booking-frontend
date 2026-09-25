import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, Users, Hotel } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCities } from '@/hooks/useCities'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  initialCityId?: number
  initialCheckIn?: string
  initialCheckOut?: string
  initialAdults?: number
  initialChildren?: number
  initialRooms?: number
  variant?: 'hero' | 'compact'
  className?: string
}

export function SearchBar({
  initialCityId,
  initialCheckIn,
  initialCheckOut,
  initialAdults = 2,
  initialChildren = 0,
  initialRooms = 1,
  variant = 'hero',
  className,
}: SearchBarProps) {
  const navigate = useNavigate()
  const { data: citiesData } = useCities({ pageSize: 100 })

  // Tomorrow & day after tomorrow defaults if not provided
  const getTodayISO = () => new Date().toISOString().split('T')[0]
  const getTomorrowISO = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  }

  const [cityId, setCityId] = useState<string>(initialCityId ? String(initialCityId) : '')
  const [checkInDate, setCheckInDate] = useState<string>(initialCheckIn || getTodayISO())
  const [checkOutDate, setCheckOutDate] = useState<string>(initialCheckOut || getTomorrowISO())
  const [adults, setAdults] = useState<number>(initialAdults)
  const [children, setChildren] = useState<number>(initialChildren)
  const [rooms, setRooms] = useState<number>(initialRooms)
  const [dateError, setDateError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (checkInDate && checkOutDate && new Date(checkOutDate) <= new Date(checkInDate)) {
      setDateError('Check-out must be after check-in')
      return
    }
    setDateError(null)

    const params = new URLSearchParams()
    if (cityId) params.set('cityId', cityId)
    if (checkInDate) params.set('checkInDate', checkInDate)
    if (checkOutDate) params.set('checkOutDate', checkOutDate)
    if (adults) params.set('adults', String(adults))
    if (children) params.set('children', String(children))
    if (rooms) params.set('rooms', String(rooms))

    navigate(`/search?${params.toString()}`)
  }

  const isHero = variant === 'hero'

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'w-full bg-white shadow-xl border border-slate-200/80 rounded-3xl p-3 transition-all',
        isHero ? 'p-4 sm:p-5' : 'p-3',
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
        {/* Destination / City */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Destination
            </label>
            <select
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer truncate"
            >
              <option value="">Any destination</option>
              {citiesData?.items?.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}, {city.country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Check In Date */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Check-in
            </label>
            <input
              type="date"
              min={getTodayISO()}
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Check Out Date */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Check-out
            </label>
            <input
              type="date"
              min={checkInDate || getTodayISO()}
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Guests & Search Button */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Guests
              </label>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <span>{adults} Ad</span>
                <span>•</span>
                <span>{children} Ch</span>
                <span>•</span>
                <span>{rooms} Rm</span>
              </div>
            </div>
          </div>

          <Button type="submit" variant="gold" size={isHero ? 'lg' : 'md'} className="shrink-0 px-6">
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
      </div>

      {dateError && (
        <p className="mt-2 text-xs text-rose-600 font-semibold px-2">{dateError}</p>
      )}
    </form>
  )
}
