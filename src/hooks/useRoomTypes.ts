import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { roomTypesApi } from '@/api/roomTypes'
import { queryKeys } from '@/lib/queryKeys'
import type { PaginationParams, CreateRoomTypeRequest, UpdateRoomTypeRequest } from '@/types/api'

export function useRoomTypes(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.roomTypes.list(params || {}),
    queryFn: () => roomTypesApi.getRoomTypes(params),
  })
}

export function useRoomType(id: number) {
  return useQuery({
    queryKey: ['room-types', id],
    queryFn: () => roomTypesApi.getRoomTypeById(id),
    enabled: !!id && !isNaN(id),
  })
}

export function useCreateRoomType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRoomTypeRequest) => roomTypesApi.createRoomType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-types'] })
    },
  })
}

export function useUpdateRoomType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRoomTypeRequest }) =>
      roomTypesApi.updateRoomType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-types'] })
    },
  })
}

export function useDeleteRoomType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => roomTypesApi.deleteRoomType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-types'] })
    },
  })
}
