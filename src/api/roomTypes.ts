import apiClient from './client'
import type {
  RoomType,
  CreateRoomTypeRequest,
  UpdateRoomTypeRequest,
  PagedResult,
  PaginationParams,
} from '@/types/api'

export const roomTypesApi = {
  getRoomTypes: async (params?: PaginationParams): Promise<PagedResult<RoomType>> => {
    const res = await apiClient.get<PagedResult<RoomType>>('/api/room-types', { params })
    return res.data
  },

  getRoomTypeById: async (id: number): Promise<RoomType> => {
    const res = await apiClient.get<RoomType>(`/api/room-types/${id}`)
    return res.data
  },

  createRoomType: async (data: CreateRoomTypeRequest): Promise<RoomType> => {
    const res = await apiClient.post<RoomType>('/api/room-types', data)
    return res.data
  },

  updateRoomType: async (id: number, data: UpdateRoomTypeRequest): Promise<RoomType> => {
    const res = await apiClient.put<RoomType>(`/api/room-types/${id}`, data)
    return res.data
  },

  deleteRoomType: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/room-types/${id}`)
  },
}
