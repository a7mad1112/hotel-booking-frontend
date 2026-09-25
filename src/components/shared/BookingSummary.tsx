import React from 'react'
import { Hotel, MapPin, Calendar, Clock, Bed } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { BookingStatus } from '@/types/api'

interface BookingSummaryProps {
  hotelName: string
  cityName?: string
  roomNumber?: string
  roomTypeName?: string
  checkInDate: string
  checkOutDate: string
  nights: number
  status?: BookingStatus
}

export function BookingSummary({
  hotelName,
  cityName,
  roomNumber,
  roomTypeName,
  checkInDate,
  checkOutDate,
  nights,
  status,
}: BookingSummaryProps) {
  const getStatusBadge = (s: BookingStatus | undefined) => {
    switch (s) {
      case BookingStatus.Pending:
        return <Badge variant="warning">Pending Payment</Badge>
      case BookingStatus.Confirmed:
        return <Badge variant="success">Confirmed</Badge>
      case BookingStatus.Cancelled:
        return <Badge variant="destructive">Cancelled</Badge>
      case BookingStatus.Completed:
        return <Badge variant="default">Completed</Badge>
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Booking Summary
          </span>
          <h3 className="text-2xl font-bold text-slate-900 font-display mt-1 flex items-center gap-2">
            <Hotel className="w-6 h-6 text-amber-600 shrink-0" />
            {hotelName}
          </h3>
          {cityName && (
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              {cityName}
            </p>
          )}
        </div>
        {status !== undefined && getStatusBadge(status)}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Check-In
            </p>
            <p className="text-sm font-bold text-slate-800">{formatDate(checkInDate)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100/70 text-indigo-700 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Check-Out
            </p>
            <p className="text-sm font-bold text-slate-800">{formatDate(checkOutDate)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Duration
            </p>
            <p className="text-sm font-bold text-slate-800">{nights} {nights === 1 ? 'Night' : 'Nights'}</p>
          </div>
        </div>

        {(roomNumber || roomTypeName) && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
              <Bed className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Room
              </p>
              <p className="text-sm font-bold text-slate-800">
                {roomTypeName || `Room #${roomNumber}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
