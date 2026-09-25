import { create } from 'zustand'
import type { CreateBookingResponse } from '@/types/api'

interface BookingState {
  bookingId: number | null
  bookingResponse: CreateBookingResponse | null
  setBooking: (response: CreateBookingResponse) => void
  clearBooking: () => void
}

export const useBookingStore = create<BookingState>()((set) => ({
  bookingId: null,
  bookingResponse: null,
  setBooking: (response) => set({ bookingId: response.id, bookingResponse: response }),
  clearBooking: () => set({ bookingId: null, bookingResponse: null }),
}))
