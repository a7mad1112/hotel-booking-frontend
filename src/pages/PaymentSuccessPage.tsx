import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, CalendarCheck, Home, Mail, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-md shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Payment Completed
          </span>
          <h1 className="text-3xl font-black text-slate-900 font-display mt-1">
            Reservation Confirmed!
          </h1>
          {bookingId && (
            <p className="text-xs font-bold text-amber-600 mt-1">
              Booking Reference #{bookingId}
            </p>
          )}
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Thank you for choosing GrandVibe. Your booking has been confirmed and locked into the property schedule.
        </p>

        {/* Email Invoice reassurance */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left flex items-start gap-3">
          <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Confirmation & PDF Invoice Dispatched</span>
            <p>
              An automated email with your official QuestPDF receipt and check-in voucher has been sent to your registered email.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Link to="/bookings" className="w-full">
            <Button variant="gold" className="w-full">
              <CalendarCheck className="w-4 h-4 mr-2" />
              View My Bookings
            </Button>
          </Link>
          <Link to="/" className="w-full">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
