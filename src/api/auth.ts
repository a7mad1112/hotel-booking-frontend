import apiClient from './client'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  CurrentUser,
} from '@/types/api'

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>('/api/auth/login', data)
    return res.data
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const res = await apiClient.post<RegisterResponse>('/api/auth/register', data)
    return res.data
  },

  getMe: async (): Promise<CurrentUser> => {
    const res = await apiClient.get<CurrentUser>('/api/auth/me')
    return res.data
  },
}
