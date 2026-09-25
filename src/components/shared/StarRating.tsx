import React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  isEditable?: boolean
  onChange?: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  className?: string
}

export function StarRating({
  rating,
  maxRating = 5,
  isEditable = false,
  onChange,
  size = 'md',
  showNumber = false,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1
          const isFilled = rating >= starValue
          const isHalf = !isFilled && rating >= starValue - 0.5

          return (
            <button
              type="button"
              key={index}
              disabled={!isEditable}
              onClick={() => isEditable && onChange?.(starValue)}
              className={cn(
                'transition-transform',
                isEditable ? 'cursor-pointer hover:scale-110 p-0.5' : 'cursor-default pointer-events-none'
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'fill-slate-100 text-slate-300'
                )}
              />
            </button>
          )
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-slate-700 ml-1">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  )
}
