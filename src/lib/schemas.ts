import { z } from 'zod'

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(256),
  password: z.string().min(1, 'Password is required'),
})
export type LoginFormData = z.infer<typeof loginSchema>

// Register Schema
export const registerSchema = z.object({
  email: z.string().email('Invalid email address').max(256),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type RegisterFormData = z.infer<typeof registerSchema>

// Search Schema
export const searchSchema = z
  .object({
    cityId: z.number().positive().optional(),
    checkInDate: z.string().optional(),
    checkOutDate: z.string().optional(),
    adults: z.number().positive().optional(),
    children: z.number().min(0).optional(),
    rooms: z.number().positive().optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
    minStarRating: z.number().min(0).max(5).optional(),
    maxStarRating: z.number().min(0).max(5).optional(),
  })
  .refine(
    (d) =>
      !d.checkInDate || !d.checkOutDate || new Date(d.checkOutDate) > new Date(d.checkInDate),
    {
      message: 'Check-out date must be after check-in date',
      path: ['checkOutDate'],
    }
  )
export type SearchFormData = z.infer<typeof searchSchema>

// Create Booking Schema
export const createBookingSchema = z
  .object({
    roomId: z.number().positive(),
    checkInDate: z.string().min(1, 'Check-in date is required'),
    checkOutDate: z.string().min(1, 'Check-out date is required'),
  })
  .refine((d) => new Date(d.checkOutDate) > new Date(d.checkInDate), {
    message: 'Check-out must be after check-in',
    path: ['checkOutDate'],
  })
export type CreateBookingFormData = z.infer<typeof createBookingSchema>

// City Schema
export const createCitySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Max 100 characters'),
  country: z.string().min(1, 'Country is required').max(100, 'Max 100 characters'),
  postalCode: z.string().max(20).optional().or(z.literal('')),
})
export type CreateCityFormData = z.infer<typeof createCitySchema>

// Hotel Schema
export const createHotelSchema = z.object({
  cityId: z.coerce.number().positive('City is required'),
  ownerId: z.coerce.number().positive('Owner ID is required'),
  name: z.string().min(1, 'Name is required').max(50, 'Max 50 characters'),
  description: z.string().optional(),
  starRating: z.coerce.number().min(0, 'Min 0').max(5, 'Max 5'),
  location: z.string().min(1, 'Location is required').max(500, 'Max 500 characters'),
})
export type CreateHotelFormData = z.infer<typeof createHotelSchema>

export const updateHotelSchema = createHotelSchema.omit({ ownerId: true })
export type UpdateHotelFormData = z.infer<typeof updateHotelSchema>

// Room Schema
export const createRoomSchema = z.object({
  hotelId: z.coerce.number().positive('Hotel is required'),
  roomNumber: z.string().min(1, 'Room number is required').max(20, 'Max 20 characters'),
  roomTypeId: z.coerce.number().positive('Room type is required'),
  pricePerNight: z.coerce.number().positive('Must be greater than 0'),
  adultsCapacity: z.coerce.number().positive('Must be at least 1'),
  childrenCapacity: z.coerce.number().min(0, 'Must be 0 or more'),
  availability: z.boolean().default(true),
})
export type CreateRoomFormData = z.infer<typeof createRoomSchema>

export const updateRoomSchema = createRoomSchema.omit({ hotelId: true })
export type UpdateRoomFormData = z.infer<typeof updateRoomSchema>

// Room Type Schema
export const createRoomTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})
export type CreateRoomTypeFormData = z.infer<typeof createRoomTypeSchema>

// Deal Schema
export const createDealSchema = z
  .object({
    hotelId: z.coerce.number().positive('Hotel is required'),
    discountPercentage: z.coerce
      .number()
      .gt(0, 'Must be greater than 0')
      .lte(100, 'Cannot exceed 100%'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })
  .refine((d) => new Date(d.endDate) > new Date(d.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
export type CreateDealFormData = z.infer<typeof createDealSchema>

// Image Validation helper
export const validateImageFile = (file: File): string | null => {
  const maxSize = 5 * 1024 * 1024
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  if (!file) return 'Image file is required'
  if (file.size > maxSize) return 'File must be 5 MB or less'
  if (!allowedTypes.includes(file.type)) return 'Only JPEG, PNG, and WebP are allowed'
  return null
}
