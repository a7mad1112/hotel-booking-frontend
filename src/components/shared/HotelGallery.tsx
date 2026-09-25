import React, { useState } from 'react'
import { Images, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { getHotelImageUrl } from '@/lib/utils'
import type { HotelImage } from '@/types/api'

interface HotelGalleryProps {
  images: HotelImage[]
  hotelName: string
  hotelId: number
}

export function HotelGallery({ images, hotelName, hotelId }: HotelGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  // If no images returned from API, provide fallback
  const galleryImages =
    images && images.length > 0
      ? images.map((img) => img.imageUrl)
      : [
          getHotelImageUrl(null, hotelId),
          getHotelImageUrl(null, hotelId + 1),
          getHotelImageUrl(null, hotelId + 2),
        ]

  const openLightbox = (index: number) => setSelectedIdx(index)
  const closeLightbox = () => setSelectedIdx(null)

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % galleryImages.length)
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + galleryImages.length) % galleryImages.length)
    }
  }

  return (
    <div>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[360px] md:h-[460px] rounded-3xl overflow-hidden">
        {/* Main Cover Image */}
        <div
          onClick={() => openLightbox(0)}
          className="md:col-span-2 h-full relative cursor-pointer group overflow-hidden bg-slate-100"
        >
          <img
            src={galleryImages[0]}
            alt={`${hotelName} main`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
        </div>

        {/* Side Thumbnails */}
        <div className="md:col-span-2 grid grid-cols-2 gap-3 h-full">
          {galleryImages.slice(1, 5).map((img, i) => {
            const actualIndex = i + 1
            const isLast = i === 3 && galleryImages.length > 5

            return (
              <div
                key={actualIndex}
                onClick={() => openLightbox(actualIndex)}
                className="relative cursor-pointer group overflow-hidden bg-slate-100 h-full rounded-xl md:rounded-none"
              >
                <img
                  src={img}
                  alt={`${hotelName} photo ${actualIndex}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />

                {isLast && (
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center text-white font-semibold text-sm gap-1.5">
                    <Images className="w-5 h-5" />
                    <span>+{galleryImages.length - 4} photos</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedIdx !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" />
          </button>

          {galleryImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl"
          >
            <img
              src={galleryImages[selectedIdx]}
              alt={`${hotelName} preview`}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
            {selectedIdx + 1} of {galleryImages.length}
          </div>
        </div>
      )}
    </div>
  )
}
