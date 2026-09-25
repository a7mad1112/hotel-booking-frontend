import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { roomsApi } from '@/api/rooms'
import { queryKeys } from '@/lib/queryKeys'
import type { PaginationParams, CreateRoomRequest, UpdateRoomRequest } from '@/types/api'

export function useRooms(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.rooms.list(params || {}),
    queryFn: () => roomsApi.getRooms(params),
  })
}

export function useRoom(id: number) {
  return useQuery({
    queryKey: queryKeys.rooms.detail(id),
    queryFn: () => roomsApi.getRoomById(id),
    enabled: !!id && !isNaN(id),
  })
}

export function useCreateRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRoomRequest) => roomsApi.createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
    },
  })
}

export function useUpdateRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRoomRequest }) =>
      roomsApi.updateRoom(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
    },
  })
}

export function useDeleteRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => roomsApi.deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
    },
  })
}

export function useUploadRoomImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ roomId, file }: { roomId: number; file: File }) =>
      roomsApi.uploadRoomImage(roomId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.detail(variables.roomId) })
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
    },
  })
}

export function useDeleteRoomImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ roomId, imageId }: { roomId: number; imageId: number }) =>
      roomsApi.deleteRoomImage(roomId, imageId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.detail(variables.roomId) })
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
    },
  })
}
