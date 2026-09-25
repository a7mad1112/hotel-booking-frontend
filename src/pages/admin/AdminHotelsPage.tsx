import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  PlusCircle,
  Building,
  Edit2,
  Trash2,
  Images,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { ImageUploader } from '@/components/shared/ImageUploader'
import { PaginationControls } from '@/components/shared/PaginationControls'
import { createHotelSchema, type CreateHotelFormData } from '@/lib/schemas'
import {
  useHotels,
  useCreateHotel,
  useUpdateHotel,
  useDeleteHotel,
  useHotel,
  useUploadHotelImage,
  useDeleteHotelImage,
} from '@/hooks/useHotels'
import { useCities } from '@/hooks/useCities'
import { parseApiError } from '@/lib/apiError'
import { TableRowSkeleton } from '@/components/shared/LoadingSkeleton'
import type { HotelListItem } from '@/types/api'

export function AdminHotelsPage() {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: hotelsData, isLoading, refetch } = useHotels({ page, pageSize })
  const { data: citiesData } = useCities({ pageSize: 100 })

  const createHotelMutation = useCreateHotel()
  const updateHotelMutation = useUpdateHotel()
  const deleteHotelMutation = useDeleteHotel()
  const uploadImageMutation = useUploadHotelImage()
  const deleteImageMutation = useDeleteHotelImage()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState<HotelListItem | null>(null)
  const [hotelToDelete, setHotelToDelete] = useState<HotelListItem | null>(null)
  const [galleryHotelId, setGalleryHotelId] = useState<number | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  // When managing images, load detailed hotel with images
  const { data: galleryHotel, refetch: refetchGallery } = useHotel(galleryHotelId || 0)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateHotelFormData>({
    resolver: zodResolver(createHotelSchema),
  })

  const openAddModal = () => {
    reset({
      name: '',
      cityId: citiesData?.items?.[0]?.id || 1,
      ownerId: 1,
      starRating: 5,
      location: '',
      description: '',
    })
    setEditingHotel(null)
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (hotel: HotelListItem) => {
    setEditingHotel(hotel)
    reset({
      name: hotel.name,
      cityId: hotel.cityId,
      ownerId: hotel.ownerId,
      starRating: hotel.starRating,
      location: hotel.location,
      description: hotel.description || '',
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  const onSubmit = async (data: CreateHotelFormData) => {
    setFormError(null)
    try {
      if (editingHotel) {
        await updateHotelMutation.mutateAsync({
          id: editingHotel.id,
          data: {
            name: data.name,
            cityId: data.cityId,
            starRating: data.starRating,
            location: data.location,
            description: data.description,
          },
        })
      } else {
        await createHotelMutation.mutateAsync(data)
      }
      setIsModalOpen(false)
      refetch()
    } catch (err: any) {
      setFormError(parseApiError(err))
    }
  }

  const handleDelete = async () => {
    if (!hotelToDelete) return
    try {
      await deleteHotelMutation.mutateAsync(hotelToDelete.id)
      setHotelToDelete(null)
      refetch()
    } catch (err) {
      console.error('Failed to delete hotel:', err)
    }
  }

  const handleUploadImage = async (file: File) => {
    if (!galleryHotelId) return
    await uploadImageMutation.mutateAsync({ hotelId: galleryHotelId, file })
    await refetchGallery()
  }

  const handleDeleteImage = async (imageId: number) => {
    if (!galleryHotelId) return
    await deleteImageMutation.mutateAsync({ hotelId: galleryHotelId, imageId })
    await refetchGallery()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Manage Hotels</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full administrative inventory of hotels, owners, and photos.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={openAddModal}>
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Add Hotel
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8">
            <TableRowSkeleton columns={5} />
          </div>
        ) : !hotelsData?.items || hotelsData.items.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <Building className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">No hotels found</p>
            <div className="mt-4">
              <Button variant="gold" size="sm" onClick={openAddModal}>
                Add First Hotel
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Hotel Name</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Stars</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hotelsData.items.map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-mono text-xs text-slate-400">#{hotel.id}</td>
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{hotel.name}</span>
                        <Link to={`/hotels/${hotel.id}`} target="_blank" className="text-slate-400 hover:text-amber-600">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                    <td className="p-4">{hotel.cityName}</td>
                    <td className="p-4 text-xs font-mono">{hotel.ownerEmail}</td>
                    <td className="p-4 font-bold text-amber-600">{hotel.starRating} ★</td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setGalleryHotelId(hotel.id)}
                          className="h-8 px-2 text-xs"
                          title="Manage Photos"
                        >
                          <Images className="w-3.5 h-3.5 mr-1 text-amber-600" />
                          Images
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(hotel)}
                          className="h-8 px-2 text-xs"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setHotelToDelete(hotel)}
                          className="h-8 w-8 text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {hotelsData && hotelsData.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100">
            <PaginationControls
              currentPage={hotelsData.page}
              totalPages={hotelsData.totalPages}
              totalCount={hotelsData.totalCount}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHotel ? `Edit Hotel: ${editingHotel.name}` : 'Add Hotel'}
        maxWidth="lg"
      >
        {formError && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Hotel Name *
            </label>
            <Input error={errors.name?.message} {...register('name')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                City *
              </label>
              <Select error={errors.cityId?.message} {...register('cityId')}>
                {citiesData?.items?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}, {c.country}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Owner ID *
              </label>
              <Input
                type="number"
                placeholder="1"
                disabled={!!editingHotel}
                error={errors.ownerId?.message}
                {...register('ownerId')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Star Rating (0 - 5) *
              </label>
              <Input
                type="number"
                step="0.5"
                min="0"
                max="5"
                error={errors.starRating?.message}
                {...register('starRating')}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Location *
              </label>
              <Input error={errors.location?.message} {...register('location')} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              {...register('description')}
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm" isLoading={isSubmitting}>
              {editingHotel ? 'Save Changes' : 'Create Hotel'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Gallery Modal */}
      <Modal
        isOpen={galleryHotelId !== null}
        onClose={() => setGalleryHotelId(null)}
        title={`Gallery: ${galleryHotel?.name || 'Hotel'}`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <ImageUploader
            onUpload={handleUploadImage}
            isLoading={uploadImageMutation.isPending}
          />

          <div className="pt-4 border-t border-slate-100">
            {galleryHotel?.images && galleryHotel.images.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {galleryHotel.images.map((img) => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-video bg-slate-100 border">
                    <img src={img.imageUrl} alt="Hotel" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No images currently uploaded.</p>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={hotelToDelete !== null}
        onClose={() => setHotelToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Hotel"
        message={`Delete "${hotelToDelete?.name}"? This action cannot be undone.`}
        isLoading={deleteHotelMutation.isPending}
      />
    </div>
  )
}
