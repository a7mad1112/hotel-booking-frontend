// Enums
export enum BookingStatus {
  Pending = 0,
  Confirmed = 1,
  Cancelled = 2,
  Completed = 3,
}

export enum PaymentStatus {
  Pending = 0,
  Success = 1,
  Failed = 2,
  Refunded = 3,
}

export type UserRole = 'Customer' | 'Owner' | 'Admin'

// Pagination
export interface PagedResult<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

// Auth
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  expiresAt: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface RegisterResponse {
  id: number
  email: string
}

export interface CurrentUser {
  id: string
  email: string
  role: UserRole
}

// City
export interface City {
  id: number
  name: string
  country: string
  postalCode: string | null
}

export interface TrendingCity extends City {
  bookingCount: number
}

export interface CreateCityRequest {
  name: string
  country: string
  postalCode?: string
}

export interface UpdateCityRequest {
  name: string
  country: string
  postalCode?: string
}

// Hotel
export interface HotelImage {
  id: number
  imageUrl: string
}

export interface RoomImage {
  id: number
  imageUrl: string
}

export interface HotelReview {
  id: number
  rating: number
  comment: string | null
  userId: number
}

export interface HotelRoom {
  id: number
  roomNumber: string
  roomTypeId: number
  roomTypeName: string
  roomTypeDescription: string | null
  pricePerNight: number
  adultsCapacity: number
  childrenCapacity: number
  availability: boolean
  images: RoomImage[]
}

export interface HotelListItem {
  id: number
  name: string
  description: string | null
  starRating: number
  location: string
  cityId: number
  cityName: string
  ownerId: number
  ownerEmail: string
}

export interface HotelDetail extends HotelListItem {
  country: string
  images: HotelImage[]
  rooms: HotelRoom[]
  reviews: HotelReview[]
}

export interface CreateHotelRequest {
  cityId: number
  ownerId: number
  name: string
  description?: string
  starRating: number
  location: string
}

export interface UpdateHotelRequest {
  cityId: number
  name: string
  description?: string
  starRating: number
  location: string
}

// Search
export interface SearchFilters {
  cityId?: number
  checkInDate?: string
  checkOutDate?: string
  adults?: number
  children?: number
  rooms?: number
  minPrice?: number
  maxPrice?: number
  minStarRating?: number
  maxStarRating?: number
  amenityIds?: number[]
  roomTypeId?: number
  page?: number
  pageSize?: number
}

export interface SearchHotelResult {
  id: number
  name: string
  description: string | null
  starRating: number
  location: string
  cityId: number
  cityName: string
  thumbnailUrl: string | null
  pricePerNight: number | null
}

// Room
export interface RoomListItem {
  id: number
  hotelId: number
  hotelName: string
  roomNumber: string
  roomTypeId: number
  roomTypeName: string
  pricePerNight: number
  adultsCapacity: number
  childrenCapacity: number
  availability: boolean
}

export interface CreateRoomRequest {
  hotelId: number
  roomNumber: string
  roomTypeId: number
  pricePerNight: number
  adultsCapacity: number
  childrenCapacity: number
  availability: boolean
}

export interface UpdateRoomRequest {
  roomNumber: string
  roomTypeId: number
  pricePerNight: number
  adultsCapacity: number
  childrenCapacity: number
  availability: boolean
}

// Room Type
export interface RoomType {
  id: number
  name: string
  description: string | null
}

export interface CreateRoomTypeRequest {
  name: string
  description?: string
}

export interface UpdateRoomTypeRequest {
  name: string
  description?: string
}

// Deal
export interface Deal {
  id: number
  hotelId: number
  hotelName: string
  discountPercentage: number
  startDate: string
  endDate: string
}

export interface FeaturedDeal {
  hotelId: number
  hotelImageUrl: string | null
  hotelName: string
  location: string
  originalPrice: number
  discountedPrice: number
  rating: number
}

export interface CreateDealRequest {
  hotelId: number
  discountPercentage: number
  startDate: string
  endDate: string
}

export interface UpdateDealRequest {
  hotelId: number
  discountPercentage: number
  startDate: string
  endDate: string
}

// Booking
export interface CreateBookingRequest {
  roomId: number
  checkInDate: string
  checkOutDate: string
}

export interface CreateBookingResponse {
  id: number
  roomId: number
  hotelId: number
  checkInDate: string
  checkOutDate: string
  nights: number
  pricePerNight: number
  subtotal: number
  discountPercentage: number | null
  discountAmount: number
  totalPrice: number
  status: BookingStatus
}

export interface CheckoutResponse {
  bookingId: number
  customer: {
    userId: number
    email: string
  }
  summary: {
    hotelName: string
    cityName: string
    roomId: number
    roomNumber: string
    checkInDate: string
    checkOutDate: string
    nights: number
    status: BookingStatus
  }
  calculation: {
    pricePerNight: number
    nights: number
    totalPrice: number
  }
}

// Payment
export interface CreatePaymentResponse {
  bookingId: number
  provider: string
  transactionId: string
  paymentIntentId: string | null
  amount: number
  status: PaymentStatus
  checkoutUrl: string
}

// User / History
export interface BookingHistoryItem {
  hotelId: number
  hotelName: string
  cityName: string
  starRating: number
  imageUrl: string | null
  pricePerNight: number
}

// API Error
export interface ApiError {
  message: string
  statusCode?: number
  errors?: Record<string, string[]>
}
