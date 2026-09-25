import { useQuery, useMutation } from '@tanstack/react-query'
import { bookingsApi } from '@/api/bookings'
import { queryKeys } from '@/lib/queryKeys'
import { useBookingStore } from '@/store/bookingStore'
import type { CreateBookingRequest } from '@/types/api'

export function useCreateBooking() {
  const { setBooking } = useBookingStore()

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingsApi.createBooking(data),
    onSuccess: (res) => {
      setBooking(res)
    },
  })
}

export function useCheckout(bookingId: number) {
  return useQuery({
    queryKey: queryKeys.bookings.checkout(bookingId),
    queryFn: () => bookingsApi.getCheckout(bookingId),
    enabled: !!bookingId && !isNaN(bookingId),
  })
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: async (bookingId: number) => {
      const storageKey = `idempotency_${bookingId}`
      let idempotencyKey = sessionStorage.getItem(storageKey)
      if (!idempotencyKey) {
        idempotencyKey = crypto.randomUUID()
        sessionStorage.setItem(storageKey, idempotencyKey)
      }
      return bookingsApi.createPayment(bookingId, idempotencyKey)
    },
  })
}
