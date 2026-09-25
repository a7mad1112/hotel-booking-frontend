import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { PriceBreakdown } from '@/components/shared/PriceBreakdown'
import { useCreateBooking } from '@/hooks/useBookings'
import { useAuthStore } from '@/store/authStore'
import { calculateNights } from '@/lib/utils'
import { parseApiError } from '@/lib/apiError'
import type { HotelRoom } from '@/types/api'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  room: HotelRoom | null
  hotelName: string
  initialCheckIn?: string
  initialCheckOut?: string
}

export function BookingModal({
  isOpen,
  onClose,
  room,
  hotelName,
  initialCheckIn,
  initialCheckOut,
}: BookingModalProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const createBookingMutation = useCreateBooking()

  const getTodayISO = () => new Date().toISOString().split('T')[0]
  const getTomorrowISO = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  }

  const [checkInDate, setCheckInDate] = useState<string>(initialCheckIn || getTodayISO())
  const [checkOutDate, setCheckOutDate] = useState<string>(initialCheckOut || getTomorrowISO())
  const [error, setError] = useState<string | null>(null)

  if (!room) return null

  const nights = calculateNights(checkInDate, checkOutDate)
  const subtotal = room.pricePerNight * nights
  const totalPrice = subtotal // Server calculates deals/discounts

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isAuthenticated()) {
      navigate('/login', { state: { from: window.location.pathname } })
      return
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError('Check-out date must be strictly after check-in date.')
      return
    }

    try {
      const response = await createBookingMutation.mutateAsync({
        roomId: room.id,
        checkInDate,
        checkOutDate,
      })
      onClose()
      navigate(`/checkout/${response.id}`)
    } catch (err: any) {
      setError(parseApiError(err))
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reserve Room"
      description={`Step 1: Confirm reservation dates for ${hotelName}`}
      maxWidth="lg"
    >
      <form onSubmit={handleConfirmBooking} className="space-y-6 mt-4">
        {/* Room Header Info */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Selected Room
            </span>
            <h4 className="text-base font-bold text-slate-900 font-display">
              {room.roomTypeName} (Room #{room.roomNumber})
            </h4>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-slate-900">
              ${room.pricePerNight}
            </span>
            <span className="text-[10px] text-slate-500 block">per night</span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Date Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              Check-In Date
            </label>
            <input
              type="date"
              required
              min={getTodayISO()}
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              Check-Out Date
            </label>
            <input
              type="date"
              required
              min={checkInDate || getTodayISO()}
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Estimated Pricing */}
        <PriceBreakdown
          pricePerNight={room.pricePerNight}
          nights={nights}
          totalPrice={totalPrice}
        />

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>No charge yet. You will review full invoice on next step before payment.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={createBookingMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gold"
            isLoading={createBookingMutation.isPending}
            className="px-6"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </form>
    </Modal>
  )
}
