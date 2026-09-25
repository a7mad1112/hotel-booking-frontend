import React from 'react'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

interface PriceBreakdownProps {
  pricePerNight: number
  nights: number
  subtotal?: number
  discountPercentage?: number | null
  discountAmount?: number
  totalPrice: number
  className?: string
}

export function PriceBreakdown({
  pricePerNight,
  nights,
  subtotal = pricePerNight * nights,
  discountPercentage,
  discountAmount = 0,
  totalPrice,
  className,
}: PriceBreakdownProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
      <h4 className="text-lg font-bold text-slate-900 font-display">Price Details</h4>

      <div className="space-y-3 text-sm text-slate-600">
        <div className="flex justify-between items-center">
          <span>
            {formatCurrency(pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}
          </span>
          <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-emerald-600 font-medium">
            <span className="flex items-center gap-1.5">
              Discount
              {discountPercentage && (
                <Badge variant="gold" className="text-[10px] py-0 px-1.5">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Taxes & Service Fees</span>
          <span>Included</span>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
          <div>
            <span className="text-base font-bold text-slate-900">Total Price</span>
            <span className="block text-xs text-slate-400">USD</span>
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {formatCurrency(totalPrice)}
          </span>
        </div>
      </div>
    </div>
  )
}
