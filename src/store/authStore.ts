import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'
import type { UserRole } from '@/types/api'

export interface AuthUser {
  id: number
  email: string
  role: UserRole
}

interface DecodedJwt {
  nameid?: string
  sub?: string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string
  email?: string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string
  role?: UserRole
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: UserRole
  exp?: number
}

interface AuthState {
  accessToken: string | null
  user: AuthUser | null
  expiresAt: string | null
  setAuth: (token: string, expiresAt: string) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      expiresAt: null,
      setAuth: (token: string, expiresAt: string) => {
        try {
          const decoded = jwtDecode<DecodedJwt>(token)
          const rawId =
            decoded.nameid ||
            decoded.sub ||
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
            '0'
          const email =
            decoded.email ||
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
            ''
          const role =
            decoded.role ||
            decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
            'Customer'

          set({
            accessToken: token,
            expiresAt,
            user: {
              id: parseInt(rawId, 10) || 0,
              email,
              role: role as UserRole,
            },
          })
        } catch (err) {
          console.error('Failed to decode JWT token:', err)
          set({ accessToken: token, expiresAt, user: null })
        }
      },
      clearAuth: () => {
        set({ accessToken: null, user: null, expiresAt: null })
      },
      isAuthenticated: () => {
        const { accessToken, expiresAt } = get()
        if (!accessToken || !expiresAt) return false
        return new Date(expiresAt).getTime() > Date.now()
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
