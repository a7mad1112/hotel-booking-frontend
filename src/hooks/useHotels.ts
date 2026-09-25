import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hotelsApi } from '@/api/hotels'
import { queryKeys } from '@/lib/queryKeys'
import type { PaginationParams, CreateHotelRequest, UpdateHotelRequest } from '@/types/api'

export function useHotels(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.hotels.list(params || {}),
    queryFn: () => hotelsApi.getHotels(params),
  })
}

export function useHotel(id: number) {
  return useQuery({
    queryKey: queryKeys.hotels.detail(id),
    queryFn: () => hotelsApi.getHotelById(id),
    enabled: !!id && !isNaN(id),
  })
}

export function useFeaturedDeals() {
  return useQuery({
    queryKey: queryKeys.hotels.featured,
    queryFn: () => hotelsApi.getFeaturedDeals(),
  })
}

export function useCreateHotel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateHotelRequest) => hotelsApi.createHotel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
    },
  })
}

export function useUpdateHotel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateHotelRequest }) =>
      hotelsApi.updateHotel(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.hotels.detail(variables.id) })
    },
  })
}

export function useDeleteHotel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => hotelsApi.deleteHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
    },
  })
}

export function useUploadHotelImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ hotelId, file }: { hotelId: number; file: File }) =>
      hotelsApi.uploadHotelImage(hotelId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.hotels.detail(variables.hotelId) })
    },
  })
}

export function useDeleteHotelImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ hotelId, imageId }: { hotelId: number; imageId: number }) =>
      hotelsApi.deleteHotelImage(hotelId, imageId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.hotels.detail(variables.hotelId) })
    },
  })
}
