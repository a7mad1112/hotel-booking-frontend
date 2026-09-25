import apiClient from './client'
import type { SearchFilters, SearchHotelResult, PagedResult } from '@/types/api'

export const searchApi = {
  searchHotels: async (filters: SearchFilters): Promise<PagedResult<SearchHotelResult>> => {
    // Clean undefined/empty string filters before sending
    const cleanedParams: Record<string, unknown> = {}
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleanedParams[key] = value
      }
    })

    const res = await apiClient.get<PagedResult<SearchHotelResult>>('/api/search/hotels', {
      params: cleanedParams,
      paramsSerializer: {
        indexes: null, // serializes array amenityIds as amenityIds=1&amenityIds=2 for ASP.NET Core
      },
    })
    return res.data
  },
}
