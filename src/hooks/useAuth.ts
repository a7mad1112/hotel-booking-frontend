import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import type { LoginRequest, RegisterRequest } from '@/types/api'

export function useAuth() {
  const queryClient = useQueryClient()
  const { user, accessToken, isAuthenticated, setAuth, clearAuth } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.expiresAt)
      queryClient.invalidateQueries({ queryKey: ['users', 'history'] })
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  })

  const logout = () => {
    clearAuth()
    queryClient.clear()
    window.location.href = '/login'
  }

  const { data: me, isLoading: isLoadingMe } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.getMe(),
    enabled: isAuthenticated(),
  })

  return {
    user,
    accessToken,
    isAuthenticated: isAuthenticated(),
    isCustomer: user?.role === 'Customer',
    isOwner: user?.role === 'Owner',
    isAdmin: user?.role === 'Admin',
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout,
    me,
    isLoadingMe,
  }
}
