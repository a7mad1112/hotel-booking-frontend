export const queryKeys = {
  hotels: {
    list: (params?: object) => ['hotels', 'list', params] as const,
    detail: (id: number) => ['hotels', id] as const,
    featured: ['hotels', 'featured'] as const,
  },
  cities: {
    list: (params?: object) => ['cities', 'list', params] as const,
    trending: ['cities', 'trending'] as const,
    detail: (id: number) => ['cities', id] as const,
  },
  search: {
    hotels: (filters: object) => ['search', 'hotels', filters] as const,
  },
  rooms: {
    list: (params?: object) => ['rooms', 'list', params] as const,
    detail: (id: number) => ['rooms', id] as const,
  },
  roomTypes: {
    list: (params?: object) => ['room-types', 'list', params] as const,
  },
  deals: {
    list: (params?: object) => ['deals', 'list', params] as const,
    detail: (id: number) => ['deals', id] as const,
  },
  bookings: {
    checkout: (id: number) => ['bookings', id, 'checkout'] as const,
  },
  users: {
    history: ['users', 'history'] as const,
  },
}
