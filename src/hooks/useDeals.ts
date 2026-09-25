import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dealsApi } from '@/api/deals'
import { queryKeys } from '@/lib/queryKeys'
import type { PaginationParams, CreateDealRequest, UpdateDealRequest } from '@/types/api'

export function useDeals(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.deals.list(params || {}),
    queryFn: () => dealsApi.getDeals(params),
  })
}

export function useDeal(id: number) {
  return useQuery({
    queryKey: queryKeys.deals.detail(id),
    queryFn: () => dealsApi.getDealById(id),
    enabled: !!id && !isNaN(id),
  })
}

export function useCreateDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDealRequest) => dealsApi.createDeal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.hotels.featured })
    },
  })
}

export function useUpdateDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDealRequest }) =>
      dealsApi.updateDeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.hotels.featured })
    },
  })
}

export function useDeleteDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => dealsApi.deleteDeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.hotels.featured })
    },
  })
}
