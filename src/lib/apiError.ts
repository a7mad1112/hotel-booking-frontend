import axios from 'axios'

export function parseApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (data?.message) return data.message
    if (error.response?.status === 403) return 'You are not authorized to perform this action.'
    if (error.response?.status === 401) return 'You must be logged in.'
    if (error.response?.status === 404) return 'The requested resource was not found.'
    if (error.response?.status === 409) return data?.message || 'A conflict occurred.'
    if (error.response?.status === 500) return 'A server error occurred. Please try again.'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred.'
}

export function parseFieldErrors(error: unknown): Record<string, string> {
  if (axios.isAxiosError(error)) {
    const errors = error.response?.data?.errors as Record<string, string[]> | undefined
    if (errors) {
      return Object.fromEntries(
        Object.entries(errors).map(([k, v]) => [k.toLowerCase(), v[0]])
      )
    }
  }
  return {}
}
