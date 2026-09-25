import apiClient from './client'
import type {
  Deal,
  CreateDealRequest,
  UpdateDealRequest,
  PagedResult,
  PaginationParams,
} from '@/types/api'

export const dealsApi = {
  getDeals: async (params?: PaginationParams): Promise<PagedResult<Deal>> => {
    const res = await apiClient.get<PagedResult<Deal>>('/api/deals', { params })
    return res.data
  },

  getDealById: async (id: number): Promise<Deal> => {
    const res = await apiClient.get<Deal>(`/api/deals/${id}`)
    return res.data
  },

  createDeal: async (data: CreateDealRequest): Promise<Deal> => {
    const res = await apiClient.post<Deal>('/api/deals', data)
    return res.data
  },

  updateDeal: async (id: number, data: UpdateDealRequest): Promise<Deal> => {
    const res = await apiClient.put<Deal>(`/api/deals/${id}`, data)
    return res.data
  },

  deleteDeal: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/deals/${id}`)
  },
}
