import React from 'react'
import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-slate-200/80', className)}
      {...props}
    />
  )
}

export function HotelCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white overflow-hidden shadow-sm flex flex-col h-full">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  )
}

export function HotelDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-5 w-1/4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[420px]">
        <Skeleton className="md:col-span-2 h-full rounded-2xl" />
        <div className="md:col-span-2 grid grid-cols-2 gap-4 h-full">
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-6 w-48 mt-8" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div>
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
