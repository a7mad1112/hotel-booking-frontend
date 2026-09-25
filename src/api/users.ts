import apiClient from './client'
import type { BookingHistoryItem } from '@/types/api'

export const usersApi = {
  getBookingHistory: async (): Promise<BookingHistoryItem[]> => {
    const res = await apiClient.get<BookingHistoryItem[]>('/api/users/history')
    return res.data
  },
}
