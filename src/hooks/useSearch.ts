import { useQuery } from '@tanstack/react-query'
import { searchApi } from '@/api/search'
import { queryKeys } from '@/lib/queryKeys'
import type { SearchFilters } from '@/types/api'

export function useSearchHotels(filters: SearchFilters, enabled = true) {
  return useQuery({
    queryKey: queryKeys.search.hotels(filters),
    queryFn: () => searchApi.searchHotels(filters),
    enabled,
  })
}
