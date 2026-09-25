import React from 'react'
import { FolderSearch, LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon = FolderSearch,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-12 rounded-3xl border border-slate-200/80 bg-white shadow-sm my-6',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4 border border-amber-100">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 font-display mb-1.5">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="gold">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
