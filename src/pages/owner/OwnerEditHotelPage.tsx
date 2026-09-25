import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save, Trash2, Images, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ImageUploader } from '@/components/shared/ImageUploader'
import { updateHotelSchema, type UpdateHotelFormData } from '@/lib/schemas'
import { useHotel, useUpdateHotel, useUploadHotelImage, useDeleteHotelImage } from '@/hooks/useHotels'
import { useCities } from '@/hooks/useCities'
import { parseApiError } from '@/lib/apiError'
import { Skeleton } from '@/components/shared/LoadingSkeleton'

export function OwnerEditHotelPage() {
  const { id } = useParams<{ id: string }>()
  const hotelId = Number(id)
  const navigate = useNavigate()

  const { data: hotel, isLoading } = useHotel(hotelId)
  const { data: citiesData } = useCities({ pageSize: 100 })
  const updateHotelMutation = useUpdateHotel()
  const uploadImageMutation = useUploadHotelImage()
  const deleteImageMutation = useDeleteHotelImage()

  const [formError, setFormError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateHotelFormData>({
    resolver: zodResolver(updateHotelSchema),
  })

  useEffect(() => {
    if (hotel) {
      reset({
        name: hotel.name,
        cityId: hotel.cityId,
        starRating: hotel.starRating,
        location: hotel.location,
        description: hotel.description || '',
      })
    }
  }, [hotel, reset])

  const onSubmit = async (data: UpdateHotelFormData) => {
    setFormError(null)
    setSuccessMsg(null)
    try {
      await updateHotelMutation.mutateAsync({ id: hotelId, data })
      setSuccessMsg('Hotel details updated successfully.')
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err: any) {
      setFormError(parseApiError(err))
    }
  }

  const handleUploadImage = async (file: File) => {
    await uploadImageMutation.mutateAsync({ hotelId, file })
  }

  const handleDeleteImage = async (imageId: number) => {
    await deleteImageMutation.mutateAsync({ hotelId, imageId })
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Edit Hotel: {hotel?.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Modify hotel profile, location, and manage high-resolution gallery images.
          </p>
        </div>
        <Link to="/owner/hotels">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Hotels
          </Button>
        </Link>
      </div>

      {formError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Hotel Details Form */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 font-display mb-4">
          Property Details
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Hotel Name *
            </label>
            <Input error={errors.name?.message} {...register('name')} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Destination City *
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
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
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Specific Address / Location *
            </label>
            <Input error={errors.location?.message} {...register('location')} />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              {...register('description')}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="gold" isLoading={isSubmitting}>
              <Save className="w-4 h-4 mr-1.5" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Image Gallery Management */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            <Images className="w-5 h-5 text-amber-600" />
            Photo Gallery Management
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Upload pictures to showcase your rooms and facilities on Cloudinary.
          </p>
        </div>

        {/* Upload Box */}
        <ImageUploader
          onUpload={handleUploadImage}
          isLoading={uploadImageMutation.isPending}
        />

        {/* Existing Images */}
        {hotel?.images && hotel.images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            {hotel.images.map((img) => (
              <div
                key={img.id}
                className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-50"
              >
                <img
                  src={img.imageUrl}
                  alt="Hotel photo"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  disabled={deleteImageMutation.isPending}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
                  title="Delete image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No photos uploaded yet for this hotel.</p>
        )}
      </div>
    </div>
  )
}
