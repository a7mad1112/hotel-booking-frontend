import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, MapPin, Building, ArrowLeft, RefreshCw } from 'lucide-react'
import { SearchBar } from '@/components/shared/SearchBar'
import { FilterSidebar } from '@/components/shared/FilterSidebar'
import { HotelGrid } from '@/components/shared/HotelGrid'
import { PaginationControls } from '@/components/shared/PaginationControls'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useSearchHotels } from '@/hooks/useSearch'
import { useCities } from '@/hooks/useCities'
import type { SearchFilters } from '@/types/api'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Parse filters from URL
  const cityId = searchParams.get('cityId') ? Number(searchParams.get('cityId')) : undefined
  const checkInDate = searchParams.get('checkInDate') || undefined
  const checkOutDate = searchParams.get('checkOutDate') || undefined
  const adults = searchParams.get('adults') ? Number(searchParams.get('adults')) : undefined
  const children = searchParams.get('children') ? Number(searchParams.get('children')) : undefined
  const rooms = searchParams.get('rooms') ? Number(searchParams.get('rooms')) : undefined
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  const minStarRating = searchParams.get('minStarRating')
    ? Number(searchParams.get('minStarRating'))
    : undefined
  const roomTypeId = searchParams.get('roomTypeId')
    ? Number(searchParams.get('roomTypeId'))
    : undefined
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1
  const pageSize = searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 9

  const filters: SearchFilters = {
    cityId,
    checkInDate,
    checkOutDate,
    adults,
    children,
    rooms,
    minPrice,
    maxPrice,
    minStarRating,
    roomTypeId,
    page,
    pageSize,
  }

  const { data, isLoading, isError, refetch } = useSearchHotels(filters)
  const { data: citiesData } = useCities({ pageSize: 100 })

  const selectedCity = citiesData?.items?.find((c) => c.id === cityId)

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(newPage))
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Search Bar */}
      <div className="bg-slate-100/70 p-3 sm:p-4 rounded-3xl border border-slate-200/80">
        <SearchBar
          variant="compact"
          initialCityId={cityId}
          initialCheckIn={checkInDate}
          initialCheckOut={checkOutDate}
          initialAdults={adults}
          initialChildren={children}
          initialRooms={rooms}
        />
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-28">
          <FilterSidebar />
        </aside>

        {/* Results Area */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                {selectedCity ? (
                  <span>
                    Hotels in {selectedCity.name}, {selectedCity.country}
                  </span>
                ) : (
                  <span>All Luxury Properties</span>
                )}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {data?.totalCount != null ? (
                  <span>Showing {data.items.length} of {data.totalCount} curated stays</span>
                ) : (
                  <span>Finding your perfect stay...</span>
                )}
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileFiltersOpen(true)}
                className="gap-2 w-full sm:w-auto"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                <span>Filters & Options</span>
              </Button>
            </div>
          </div>

          {/* Results Grid */}
          {isError ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-600 font-medium mb-4">
                Unable to load search results. Please check your connection or parameters.
              </p>
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Search
              </Button>
            </div>
          ) : (
            <HotelGrid
              hotels={data?.items || []}
              isLoading={isLoading}
              skeletonCount={6}
              emptyTitle="No hotels found matching criteria"
              emptyMessage="Try broadening your dates or clearing star rating/price filters."
            />
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="pt-6 border-t border-slate-200">
              <PaginationControls
                currentPage={data.page}
                totalPages={data.totalPages}
                totalCount={data.totalCount}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet / Modal */}
      <Modal
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Filter Hotels"
        maxWidth="lg"
      >
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <FilterSidebar />
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <Button variant="gold" onClick={() => setMobileFiltersOpen(false)} className="w-full">
            Apply Filters
          </Button>
        </div>
      </Modal>
    </div>
  )
}
