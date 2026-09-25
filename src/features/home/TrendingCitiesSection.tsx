import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, ArrowRight, MapPin } from 'lucide-react'
import { useTrendingCities } from '@/hooks/useCities'
import { Skeleton } from '@/components/shared/LoadingSkeleton'

const CITY_IMAGES: Record<string, string> = {
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
  tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
}

function getCityImage(cityName: string, index: number): string {
  const normalized = cityName.toLowerCase().trim()
  if (CITY_IMAGES[normalized]) return CITY_IMAGES[normalized]
  const defaults = [
    'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80',
  ]
  return defaults[index % defaults.length]
}

export function TrendingCitiesSection() {
  const { data: cities, isLoading, isError } = useTrendingCities()

  if (isError) return null
  if (!isLoading && (!cities || cities.length === 0)) return null

  return (
    <section className="py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Popular Destinations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            Trending Travel Hotspots
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            See where fellow travelers are booking their most memorable stays.
          </p>
        </div>

        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors group self-start sm:self-auto"
        >
          <span>View All Cities</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-64 rounded-3xl overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
            ))
          : cities?.slice(0, 5).map((city, index) => (
              <Link
                key={city.id}
                to={`/search?cityId=${city.id}`}
                className="group relative h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
              >
                <img
                  src={getCityImage(city.name, index)}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs">
                  <TrendingUp className="w-3 h-3 text-amber-400" />
                  <span>{city.bookingCount} bookings</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold mb-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{city.country}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display group-hover:text-amber-300 transition-colors">
                    {city.name}
                  </h3>
                </div>
              </Link>
            ))}
      </div>
    </section>
  )
}
