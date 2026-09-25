import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'
import { StarRating } from './StarRating'
import { PriceDisplay } from './PriceDisplay'
import { getHotelImageUrl } from '@/lib/utils'
import type { SearchHotelResult, FeaturedDeal, HotelListItem } from '@/types/api'

interface HotelCardProps {
  hotel: SearchHotelResult | FeaturedDeal | HotelListItem
  featured?: boolean
}

export function HotelCard({ hotel, featured = false }: HotelCardProps) {
  // Normalize fields across SearchHotelResult, FeaturedDeal, and HotelListItem
  const id = 'hotelId' in hotel ? hotel.hotelId : hotel.id
  const name = 'hotelName' in hotel ? hotel.hotelName : hotel.name
  const location = hotel.location
  const cityName = 'cityName' in hotel ? hotel.cityName : undefined
  const rating = 'rating' in hotel ? hotel.rating : hotel.starRating

  const imageUrl =
    'hotelImageUrl' in hotel
      ? hotel.hotelImageUrl
      : 'thumbnailUrl' in hotel
      ? hotel.thumbnailUrl
      : null

  const price =
    'discountedPrice' in hotel
      ? hotel.discountedPrice
      : 'pricePerNight' in hotel
      ? hotel.pricePerNight
      : null

  const originalPrice = 'originalPrice' in hotel ? hotel.originalPrice : null

  return (
    <div className="group relative rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Hotel Image with Overlay */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={getHotelImageUrl(imageUrl, id)}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Location pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-semibold text-slate-800 shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          <span>{cityName || location}</span>
        </div>

        {/* Star rating pill */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-slate-900/80 backdrop-blur-md shadow-sm">
          <StarRating rating={rating} size="sm" showNumber />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/hotels/${id}`} className="group-hover:text-amber-600 transition-colors">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 font-display">{name}</h3>
        </Link>
        <p className="text-xs text-slate-500 line-clamp-1 mt-1 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
          {location}
        </p>

        {'description' in hotel && hotel.description && (
          <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
            {hotel.description}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <PriceDisplay price={price} originalPrice={originalPrice} size="sm" />

          <Link
            to={`/hotels/${id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors group/link"
          >
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}
