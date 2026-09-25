import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
  isInline?: boolean
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error loading this information. Please try again.',
  onRetry,
  className,
  isInline = false,
}: ErrorStateProps) {
  if (isInline) {
    return (
      <div
        className={cn(
          'flex items-center justify-between p-4 rounded-xl border border-rose-200 bg-rose-50/70 text-rose-800 text-sm',
          className
        )}
      >
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{message}</span>
        </div>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry} className="bg-white border-rose-200 text-rose-700 hover:bg-rose-100">
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Retry
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-12 rounded-3xl border border-slate-200/80 bg-white shadow-sm my-6',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mb-4 border border-rose-100">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 font-display mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}
