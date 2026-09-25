import apiClient from './client'
import type {
  RoomListItem,
  CreateRoomRequest,
  UpdateRoomRequest,
  PagedResult,
  PaginationParams,
  RoomImage,
} from '@/types/api'

export const roomsApi = {
  getRooms: async (params?: PaginationParams): Promise<PagedResult<RoomListItem>> => {
    const res = await apiClient.get<PagedResult<RoomListItem>>('/api/rooms', { params })
    return res.data
  },

  getRoomById: async (id: number): Promise<RoomListItem> => {
    const res = await apiClient.get<RoomListItem>(`/api/rooms/${id}`)
    return res.data
  },

  createRoom: async (data: CreateRoomRequest): Promise<RoomListItem> => {
    const res = await apiClient.post<RoomListItem>('/api/rooms', data)
    return res.data
  },

  updateRoom: async (id: number, data: UpdateRoomRequest): Promise<RoomListItem> => {
    const res = await apiClient.put<RoomListItem>(`/api/rooms/${id}`, data)
    return res.data
  },

  deleteRoom: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/rooms/${id}`)
  },

  uploadRoomImage: async (roomId: number, file: File): Promise<RoomImage> => {
    const formData = new FormData()
    formData.append('image', file)
    const res = await apiClient.post<RoomImage>(`/api/rooms/${roomId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data
  },

  deleteRoomImage: async (roomId: number, imageId: number): Promise<void> => {
    await apiClient.delete(`/api/rooms/${roomId}/images/${imageId}`)
  },
}
