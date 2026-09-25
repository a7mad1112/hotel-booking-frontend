import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { citiesApi } from '@/api/cities'
import { queryKeys } from '@/lib/queryKeys'
import type { PaginationParams, CreateCityRequest, UpdateCityRequest } from '@/types/api'

export function useCities(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.cities.list(params || {}),
    queryFn: () => citiesApi.getCities(params),
  })
}

export function useCity(id: number) {
  return useQuery({
    queryKey: queryKeys.cities.detail(id),
    queryFn: () => citiesApi.getCityById(id),
    enabled: !!id && !isNaN(id),
  })
}

export function useTrendingCities() {
  return useQuery({
    queryKey: queryKeys.cities.trending,
    queryFn: () => citiesApi.getTrendingCities(),
  })
}

export function useCreateCity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCityRequest) => citiesApi.createCity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] })
    },
  })
}

export function useUpdateCity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCityRequest }) =>
      citiesApi.updateCity(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cities'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.cities.detail(variables.id) })
    },
  })
}

export function useDeleteCity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => citiesApi.deleteCity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] })
    },
  })
}
