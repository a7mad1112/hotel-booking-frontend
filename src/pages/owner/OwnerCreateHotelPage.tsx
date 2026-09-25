import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Building, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { createHotelSchema, type CreateHotelFormData } from '@/lib/schemas'
import { useCreateHotel } from '@/hooks/useHotels'
import { useCities } from '@/hooks/useCities'
import { useAuthStore } from '@/store/authStore'
import { parseApiError, parseFieldErrors } from '@/lib/apiError'

export function OwnerCreateHotelPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data: citiesData } = useCities({ pageSize: 100 })
  const createHotelMutation = useCreateHotel()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateHotelFormData>({
    resolver: zodResolver(createHotelSchema),
    defaultValues: {
      ownerId: user?.id || 1,
      starRating: 5,
    },
  })

  const onSubmit = async (data: CreateHotelFormData) => {
    setFormError(null)
    try {
      const newHotel = await createHotelMutation.mutateAsync({
        ...data,
        ownerId: user?.id || data.ownerId,
      })
      navigate(`/owner/hotels/${newHotel.id}/edit`)
    } catch (err: any) {
      const fieldErrors = parseFieldErrors(err)
      Object.entries(fieldErrors).forEach(([field, msg]) => {
        setError(field as keyof CreateHotelFormData, { message: msg })
      })

      if (Object.keys(fieldErrors).length === 0) {
        setFormError(parseApiError(err))
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">List New Hotel</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add a new property to your management portfolio.
          </p>
        </div>
        <Link to="/owner/hotels">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Hotels
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" value={user?.id} {...register('ownerId')} />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Hotel Name *
            </label>
            <Input
              placeholder="e.g. The Grand Ritz Luxury Palace"
              error={errors.name?.message}
              {...register('name')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Destination City *
              </label>
              <Select error={errors.cityId?.message} {...register('cityId')}>
                <option value="">Select a city</option>
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
                placeholder="5"
                error={errors.starRating?.message}
                {...register('starRating')}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Specific Address / Location *
            </label>
            <Input
              placeholder="e.g. 124 Avenue des Champs-Élysées"
              error={errors.location?.message}
              {...register('location')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Provide a compelling overview of property amenities, location advantages, and luxury services..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 placeholder:text-slate-400"
              {...register('description')}
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Link to="/owner/hotels">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="gold" isLoading={isSubmitting}>
              <Building className="w-4 h-4 mr-1.5" />
              Save & Manage Photos
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
