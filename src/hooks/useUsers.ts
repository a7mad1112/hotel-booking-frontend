import { useQuery } from '@tanstack/react-query'
import { usersApi } from '@/api/users'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/store/authStore'

export function useBookingHistory() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.users.history,
    queryFn: () => usersApi.getBookingHistory(),
    enabled: isAuthenticated(),
  })
}
