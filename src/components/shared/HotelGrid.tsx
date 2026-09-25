import React from 'react'
import { HotelCard } from './HotelCard'
import { HotelCardSkeleton } from './LoadingSkeleton'
import { EmptyState } from './EmptyState'
import { cn } from '@/lib/utils'
import type { SearchHotelResult, FeaturedDeal, HotelListItem } from '@/types/api'

interface HotelGridProps {
  hotels: (SearchHotelResult | FeaturedDeal | HotelListItem)[]
  isLoading?: boolean
  skeletonCount?: number
  emptyTitle?: string
  emptyMessage?: string
  className?: string
}

export function HotelGrid({
  hotels,
  isLoading = false,
  skeletonCount = 6,
  emptyTitle = 'No hotels found',
  emptyMessage = 'Try adjusting your search criteria or filters.',
  className,
}: HotelGridProps) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <HotelCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (!hotels || hotels.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyMessage} />
  }

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {hotels.map((hotel) => {
        const key = 'hotelId' in hotel ? `featured-${hotel.hotelId}` : `hotel-${hotel.id}`
        return <HotelCard key={key} hotel={hotel} />
      })}
    </div>
  )
}
