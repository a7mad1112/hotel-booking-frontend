import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInCalendarDays, format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(dateString: string | null | undefined, formatStr = 'MMM dd, yyyy'): string {
  if (!dateString) return ''
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
    return format(date, formatStr)
  } catch {
    return dateString
  }
}

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1
  try {
    const diff = differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn))
    return Math.max(1, diff)
  } catch {
    return 1
  }
}

const FALLBACK_HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
]

const FALLBACK_ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
]

export function getHotelImageUrl(url: string | null | undefined, seedId = 0): string {
  if (url && url.trim().length > 0) return url
  const index = Math.abs(seedId) % FALLBACK_HOTEL_IMAGES.length
  return FALLBACK_HOTEL_IMAGES[index]
}

export function getRoomImageUrl(url: string | null | undefined, seedId = 0): string {
  if (url && url.trim().length > 0) return url
  const index = Math.abs(seedId) % FALLBACK_ROOM_IMAGES.length
  return FALLBACK_ROOM_IMAGES[index]
}
