import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CreditCard, ArrowLeft, ShieldCheck, Mail, User, Lock } from 'lucide-react'
import { useCheckout } from '@/hooks/useBookings'
import { BookingSummary } from '@/components/shared/BookingSummary'
import { PriceBreakdown } from '@/components/shared/PriceBreakdown'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/shared/ErrorState'
import { Skeleton } from '@/components/shared/LoadingSkeleton'

export function CheckoutPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const id = Number(bookingId)
  const navigate = useNavigate()

  const { data: checkout, isLoading, isError, refetch } = useCheckout(id)

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
      </div>
    )
  }

  if (isError || !checkout) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <ErrorState
          title="Booking Not Found"
          message="We could not locate this reservation. It may belong to another user or has expired."
          onRetry={refetch}
        />
      </div>
    )
  }

  const { summary, calculation, customer } = checkout

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Reservation #{checkout.bookingId}
          </span>
          <h1 className="text-3xl font-black text-slate-900 font-display mt-0.5">
            Checkout & Confirmation
          </h1>
        </div>
        <Link
          to="/"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel & Back</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Summary and Guest Info */}
        <div className="lg:col-span-2 space-y-6">
          <BookingSummary
            hotelName={summary.hotelName}
            cityName={summary.cityName}
            roomNumber={summary.roomNumber}
            checkInDate={summary.checkInDate}
            checkOutDate={summary.checkOutDate}
            nights={summary.nights}
            status={summary.status}
          />

          {/* Guest Information */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-slate-900 font-display">Guest Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block font-medium">Notification Email</span>
                  <span className="font-bold text-slate-800">{customer.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <User className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block font-medium">Account ID</span>
                  <span className="font-bold text-slate-800">#{customer.userId}</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              * A complete PDF invoice and booking confirmation code will be sent to this email upon payment.
            </p>
          </div>
        </div>

        {/* Right Column: Pricing Breakdown & Payment CTA */}
        <div className="space-y-6 sticky top-28">
          <PriceBreakdown
            pricePerNight={calculation.pricePerNight}
            nights={calculation.nights}
            totalPrice={calculation.totalPrice}
          />

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Stripe 256-bit encrypted checkout</span>
            </div>

            <Button
              variant="gold"
              size="lg"
              onClick={() => navigate(`/payment/${checkout.bookingId}`)}
              className="w-full gap-2 text-base font-bold"
            >
              <CreditCard className="w-5 h-5" />
              <span>Proceed to Payment</span>
            </Button>

            <p className="text-[11px] text-center text-slate-400">
              By proceeding, you agree to the reservation terms & conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
