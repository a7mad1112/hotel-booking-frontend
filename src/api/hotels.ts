import apiClient from './client'
import type {
  HotelListItem,
  HotelDetail,
  FeaturedDeal,
  PagedResult,
  PaginationParams,
  CreateHotelRequest,
  UpdateHotelRequest,
  HotelImage,
} from '@/types/api'

export const hotelsApi = {
  getHotels: async (params?: PaginationParams): Promise<PagedResult<HotelListItem>> => {
    const res = await apiClient.get<PagedResult<HotelListItem>>('/api/hotels', { params })
    return res.data
  },

  getHotelById: async (id: number): Promise<HotelDetail> => {
    const res = await apiClient.get<HotelDetail>(`/api/hotels/${id}`)
    return res.data
  },

  getFeaturedDeals: async (): Promise<FeaturedDeal[]> => {
    const res = await apiClient.get<FeaturedDeal[]>('/api/hotels/featured')
    return res.data
  },

  createHotel: async (data: CreateHotelRequest): Promise<HotelListItem> => {
    const res = await apiClient.post<HotelListItem>('/api/hotels', data)
    return res.data
  },

  updateHotel: async (id: number, data: UpdateHotelRequest): Promise<HotelListItem> => {
    const res = await apiClient.put<HotelListItem>(`/api/hotels/${id}`, data)
    return res.data
  },

  deleteHotel: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/hotels/${id}`)
  },

  uploadHotelImage: async (hotelId: number, file: File): Promise<HotelImage> => {
    const formData = new FormData()
    formData.append('image', file)
    const res = await apiClient.post<HotelImage>(`/api/hotels/${hotelId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data
  },

  deleteHotelImage: async (hotelId: number, imageId: number): Promise<void> => {
    await apiClient.delete(`/api/hotels/${hotelId}/images/${imageId}`)
  },
}
