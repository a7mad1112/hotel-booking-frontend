import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { XCircle, ArrowLeft, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function PaymentCancelPage() {
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-md">
          <XCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Payment Incomplete
          </span>
          <h1 className="text-3xl font-black text-slate-900 font-display mt-1">
            Payment Cancelled
          </h1>
          {bookingId && (
            <p className="text-xs font-bold text-slate-500 mt-1">
              Reservation #{bookingId}
            </p>
          )}
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          The payment session was cancelled. No charges were made to your card. Your reservation remains in <strong>Pending</strong> status.
        </p>

        <div className="pt-2 flex flex-col gap-2">
          {bookingId && (
            <Link to={`/payment/${bookingId}`} className="w-full">
              <Button variant="gold" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Resume Payment
              </Button>
            </Link>
          )}
          <Link to="/bookings" className="w-full">
            <Button variant="outline" className="w-full">
              Go to My Bookings
            </Button>
          </Link>
          <Link to="/" className="w-full">
            <Button variant="ghost" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
