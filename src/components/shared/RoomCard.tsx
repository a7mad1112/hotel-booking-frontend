import React from 'react'
import { Users, Baby, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PriceDisplay } from './PriceDisplay'
import { getRoomImageUrl } from '@/lib/utils'
import type { HotelRoom } from '@/types/api'

interface RoomCardProps {
  room: HotelRoom
  onSelect: (room: HotelRoom) => void
  disabled?: boolean
}

export function RoomCard({ room, onSelect, disabled = false }: RoomCardProps) {
  const imageUrl = room.images?.[0]?.imageUrl

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row">
      {/* Room Image */}
      <div className="relative md:w-64 h-48 md:h-auto overflow-hidden bg-slate-100 shrink-0">
        <img
          src={getRoomImageUrl(imageUrl, room.id)}
          alt={room.roomTypeName}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge
            variant={room.availability ? 'success' : 'destructive'}
            className="backdrop-blur-md bg-white/90"
          >
            {room.availability ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Available
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 text-rose-600" />
                Unavailable
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                Room #{room.roomNumber}
              </span>
              <h4 className="text-xl font-bold text-slate-900 font-display mt-0.5">
                {room.roomTypeName}
              </h4>
            </div>
            <PriceDisplay price={room.pricePerNight} size="md" />
          </div>

          {room.roomTypeDescription && (
            <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
              {room.roomTypeDescription}
            </p>
          )}

          {/* Capacities */}
          <div className="flex items-center gap-4 mt-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{room.adultsCapacity} Adults</span>
            </div>
            {room.childrenCapacity > 0 && (
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <Baby className="w-4 h-4 text-slate-400" />
                <span>{room.childrenCapacity} Children</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
          <Button
            variant="gold"
            disabled={!room.availability || disabled}
            onClick={() => onSelect(room)}
            className="w-full sm:w-auto"
          >
            <span>Book This Room</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
