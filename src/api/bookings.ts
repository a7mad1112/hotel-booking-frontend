import apiClient from './client'
import type {
  CreateBookingRequest,
  CreateBookingResponse,
  CheckoutResponse,
  CreatePaymentResponse,
} from '@/types/api'

export const bookingsApi = {
  createBooking: async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
    const res = await apiClient.post<CreateBookingResponse>('/api/bookings', data)
    return res.data
  },

  getCheckout: async (bookingId: number): Promise<CheckoutResponse> => {
    const res = await apiClient.get<CheckoutResponse>(`/api/bookings/${bookingId}/checkout`)
    return res.data
  },

  createPayment: async (bookingId: number, idempotencyKey: string): Promise<CreatePaymentResponse> => {
    const res = await apiClient.post<CreatePaymentResponse>(
      `/api/bookings/${bookingId}/payment`,
      {},
      {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      }
    )
    return res.data
  },
}
