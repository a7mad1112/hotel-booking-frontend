import React from 'react'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  price: number | null | undefined
  originalPrice?: number | null
  showPerNight?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function PriceDisplay({
  price,
  originalPrice,
  showPerNight = true,
  size = 'md',
  className,
}: PriceDisplayProps) {
  const hasDiscount = originalPrice != null && price != null && originalPrice > price
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null

  const sizeClasses = {
    sm: 'text-base font-semibold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-extrabold',
    xl: 'text-3xl font-black',
  }

  return (
    <div className={cn('flex items-baseline gap-2 flex-wrap', className)}>
      <div className="flex items-baseline gap-1.5">
        <span className={cn('text-slate-900 tracking-tight', sizeClasses[size])}>
          {formatCurrency(price)}
        </span>
        {showPerNight && (
          <span className="text-xs text-slate-500 font-normal">/ night</span>
        )}
      </div>

      {hasDiscount && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 line-through">
            {formatCurrency(originalPrice)}
          </span>
          <Badge variant="gold" className="text-[10px] px-1.5 py-0">
            {discountPercent}% OFF
          </Badge>
        </div>
      )}
    </div>
  )
}
