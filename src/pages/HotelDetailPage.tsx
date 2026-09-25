import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  MapPin,
  Star,
  Sparkles,
  ArrowLeft,
  Building,
  User,
  ShieldCheck,
  MessageSquareQuote,
  Bed,
} from 'lucide-react'
import { useHotel } from '@/hooks/useHotels'
import { useDeals } from '@/hooks/useDeals'
import { HotelGallery } from '@/components/shared/HotelGallery'
import { StarRating } from '@/components/shared/StarRating'
import { RoomCard } from '@/components/shared/RoomCard'
import { BookingModal } from '@/features/hotels/BookingModal'
import { HotelDetailSkeleton } from '@/components/shared/LoadingSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { Badge } from '@/components/ui/Badge'
import type { HotelRoom } from '@/types/api'

export function HotelDetailPage() {
  const { id } = useParams<{ id: string }>()
  const hotelId = Number(id)

  const { data: hotel, isLoading, isError, refetch } = useHotel(hotelId)
  const { data: dealsData } = useDeals({ pageSize: 50 })

  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)

  if (isLoading) return <HotelDetailSkeleton />
  if (isError || !hotel) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState
          title="Hotel Not Found"
          message="We could not load details for this property. It may have been removed or is temporarily unavailable."
          onRetry={refetch}
        />
      </div>
    )
  }

  // Find active deal for this hotel
  const activeDeal = dealsData?.items?.find((d) => d.hotelId === hotelId)

  // Compute average review rating if reviews exist
  const averageReviewRating =
    hotel.reviews && hotel.reviews.length > 0
      ? hotel.reviews.reduce((acc, r) => acc + r.rating, 0) / hotel.reviews.length
      : null

  const handleSelectRoom = (room: HotelRoom) => {
    setSelectedRoom(room)
    setBookingModalOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/search" className="flex items-center gap-1 hover:text-amber-600 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Hotels</span>
        </Link>
        <span>/</span>
        <span className="text-slate-400">{hotel.cityName}</span>
        <span>/</span>
        <span className="text-slate-900 truncate max-w-[200px]">{hotel.name}</span>
      </div>

      {/* Hotel Title & Location */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={hotel.starRating} showNumber />
            <Badge variant="gold" className="text-[11px]">
              {hotel.starRating >= 4.5 ? 'Luxury Tier' : 'Premium Stay'}
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            {hotel.name}
          </h1>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1.5">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {hotel.location}, {hotel.cityName}, {hotel.country}
            </span>
          </p>
        </div>

        {/* Rating summary pill */}
        {averageReviewRating !== null && (
          <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200 p-3 rounded-2xl shrink-0">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
              {averageReviewRating.toFixed(1)}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Guest Rating</span>
              <span className="text-[11px] text-slate-500">
                Based on {hotel.reviews.length} verified {hotel.reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Photo Gallery */}
      <HotelGallery images={hotel.images} hotelName={hotel.name} hotelId={hotel.id} />

      {/* Active Deal Alert (if exists) */}
      {activeDeal && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-amber-500/10 border border-amber-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Special Promotion: {activeDeal.discountPercentage}% Discount Available
              </h4>
              <p className="text-xs text-slate-600">
                Automatic discount applied to room rates booked during this promotional period!
              </p>
            </div>
          </div>
          <Badge variant="gold" className="text-xs py-1 px-3">
            Active Deal
          </Badge>
        </div>
      )}

      {/* Hotel Description & Amenities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900 font-display">
              About {hotel.name}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {hotel.description ||
                'Welcome to an exemplary luxury destination providing world-class hospitality, unparalleled architectural elegance, and exquisite guest accommodations in the heart of the city.'}
            </p>

            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Property</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-600 shrink-0" />
                <span>City: {hotel.cityName}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Managed by Host</span>
              </div>
            </div>
          </div>

          {/* Rooms Section */}
          <div className="space-y-4" id="rooms">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
                  <Bed className="w-6 h-6 text-amber-600" />
                  Available Rooms & Suites
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Choose your preferred accommodation style and reserve instantly.
                </p>
              </div>
            </div>

            {hotel.rooms && hotel.rooms.length > 0 ? (
              <div className="space-y-4">
                {hotel.rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onSelect={handleSelectRoom}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                No rooms are currently listed for this hotel. Please check back later.
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-amber-600" />
                Verified Guest Reviews ({hotel.reviews?.length || 0})
              </h3>
            </div>

            {hotel.reviews && hotel.reviews.length > 0 ? (
              <div className="space-y-4 divide-y divide-slate-100">
                {hotel.reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                          VG
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">
                            Verified Guest
                          </span>
                          <span className="text-[10px] text-slate-400">Authentic Stay</span>
                        </div>
                      </div>
                      <StarRating rating={rev.rating} size="sm" showNumber />
                    </div>
                    {rev.comment && (
                      <p className="text-xs text-slate-600 italic leading-relaxed pl-10">
                        "{rev.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No reviews yet. Be the first guest to share your experience after staying!
              </p>
            )}
          </div>
        </div>

        {/* Right Sticky Sidebar */}
        <aside className="sticky top-28 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-5">
            <h4 className="text-lg font-bold text-slate-900 font-display">Book Your Stay</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select any of the luxury suites to preview your dates and lock in current availability.
            </p>

            <a
              href="#rooms"
              className="w-full inline-flex items-center justify-center h-11 px-4 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
            >
              Browse Rooms & Rates
            </a>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Price Match Promise</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Instant confirmation via email</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        room={selectedRoom}
        hotelName={hotel.name}
      />
    </div>
  )
}
