import apiClient from './client'
import type {
  City,
  TrendingCity,
  PagedResult,
  PaginationParams,
  CreateCityRequest,
  UpdateCityRequest,
} from '@/types/api'

export const citiesApi = {
  getCities: async (params?: PaginationParams): Promise<PagedResult<City>> => {
    const res = await apiClient.get<PagedResult<City>>('/api/cities', { params })
    return res.data
  },

  getCityById: async (id: number): Promise<City> => {
    const res = await apiClient.get<City>(`/api/cities/${id}`)
    return res.data
  },

  getTrendingCities: async (): Promise<TrendingCity[]> => {
    const res = await apiClient.get<TrendingCity[]>('/api/cities/trending')
    return res.data
  },

  createCity: async (data: CreateCityRequest): Promise<City> => {
    const res = await apiClient.post<City>('/api/cities', data)
    return res.data
  },

  updateCity: async (id: number, data: UpdateCityRequest): Promise<City> => {
    const res = await apiClient.put<City>(`/api/cities/${id}`, data)
    return res.data
  },

  deleteCity: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/cities/${id}`)
  },
}
