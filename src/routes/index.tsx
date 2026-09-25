import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { ProtectedRoute } from './ProtectedRoute'

// Public Pages
import { HomePage } from '@/pages/HomePage'
import { SearchPage } from '@/pages/SearchPage'
import { HotelDetailPage } from '@/pages/HotelDetailPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { UnauthorizedPage } from '@/pages/UnauthorizedPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// Customer / Authenticated Pages
import { CheckoutPage } from '@/pages/CheckoutPage'
import { PaymentPage } from '@/pages/PaymentPage'
import { PaymentSuccessPage } from '@/pages/PaymentSuccessPage'
import { PaymentCancelPage } from '@/pages/PaymentCancelPage'
import { BookingHistoryPage } from '@/pages/BookingHistoryPage'

// Owner Pages
import { OwnerDashboard } from '@/pages/owner/OwnerDashboard'
import { OwnerHotelsPage } from '@/pages/owner/OwnerHotelsPage'
import { OwnerCreateHotelPage } from '@/pages/owner/OwnerCreateHotelPage'
import { OwnerEditHotelPage } from '@/pages/owner/OwnerEditHotelPage'
import { OwnerRoomsPage } from '@/pages/owner/OwnerRoomsPage'
import { OwnerDealsPage } from '@/pages/owner/OwnerDealsPage'

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminCitiesPage } from '@/pages/admin/AdminCitiesPage'
import { AdminHotelsPage } from '@/pages/admin/AdminHotelsPage'
import { AdminRoomsPage } from '@/pages/admin/AdminRoomsPage'
import { AdminRoomTypesPage } from '@/pages/admin/AdminRoomTypesPage'
import { AdminDealsPage } from '@/pages/admin/AdminDealsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'hotels/:id', element: <HotelDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'unauthorized', element: <UnauthorizedPage /> },

      // Customer & Authenticated Routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'checkout/:bookingId', element: <CheckoutPage /> },
          { path: 'payment/:bookingId', element: <PaymentPage /> },
          { path: 'payment/success', element: <PaymentSuccessPage /> },
          { path: 'payment/cancel', element: <PaymentCancelPage /> },
          { path: 'bookings', element: <BookingHistoryPage /> },
        ],
      },
    ],
  },

  // Owner Routes
  {
    path: '/owner',
    element: <ProtectedRoute roles={['Owner', 'Admin']} />,
    children: [
      {
        element: <OwnerLayout />,
        children: [
          { index: true, element: <OwnerDashboard /> },
          { path: 'hotels', element: <OwnerHotelsPage /> },
          { path: 'hotels/create', element: <OwnerCreateHotelPage /> },
          { path: 'hotels/:id/edit', element: <OwnerEditHotelPage /> },
          { path: 'hotels/:id/rooms', element: <OwnerRoomsPage /> },
          { path: 'hotels/:id/deals', element: <OwnerDealsPage /> },
        ],
      },
    ],
  },

  // Admin Routes
  {
    path: '/admin',
    element: <ProtectedRoute roles={['Admin']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'cities', element: <AdminCitiesPage /> },
          { path: 'hotels', element: <AdminHotelsPage /> },
          { path: 'rooms', element: <AdminRoomsPage /> },
          { path: 'room-types', element: <AdminRoomTypesPage /> },
          { path: 'deals', element: <AdminDealsPage /> },
        ],
      },
    ],
  },

  // 404 Catch-All
  {
    path: '*',
    element: (
      <RootLayout />
    ),
    children: [
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
