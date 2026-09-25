import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, MapPin, Edit2, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PaginationControls } from '@/components/shared/PaginationControls'
import { createCitySchema, type CreateCityFormData } from '@/lib/schemas'
import { useCities, useCreateCity, useUpdateCity, useDeleteCity } from '@/hooks/useCities'
import { parseApiError } from '@/lib/apiError'
import { TableRowSkeleton } from '@/components/shared/LoadingSkeleton'
import type { City } from '@/types/api'

export function AdminCitiesPage() {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: citiesData, isLoading, refetch } = useCities({ page, pageSize })
  const createCityMutation = useCreateCity()
  const updateCityMutation = useUpdateCity()
  const deleteCityMutation = useDeleteCity()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCity, setEditingCity] = useState<City | null>(null)
  const [cityToDelete, setCityToDelete] = useState<City | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCityFormData>({
    resolver: zodResolver(createCitySchema),
  })

  const openAddModal = () => {
    reset({ name: '', country: '', postalCode: '' })
    setEditingCity(null)
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (city: City) => {
    setEditingCity(city)
    reset({
      name: city.name,
      country: city.country,
      postalCode: city.postalCode || '',
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  const onSubmit = async (data: CreateCityFormData) => {
    setFormError(null)
    try {
      if (editingCity) {
        await updateCityMutation.mutateAsync({ id: editingCity.id, data })
      } else {
        await createCityMutation.mutateAsync(data)
      }
      setIsModalOpen(false)
      refetch()
    } catch (err: any) {
      setFormError(parseApiError(err))
    }
  }

  const handleDelete = async () => {
    if (!cityToDelete) return
    try {
      await deleteCityMutation.mutateAsync(cityToDelete.id)
      setCityToDelete(null)
      refetch()
    } catch (err) {
      console.error('Failed to delete city:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Manage Cities</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure destinations available for hotel listings and search.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={openAddModal}>
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Add City
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8">
            <TableRowSkeleton columns={4} />
          </div>
        ) : !citiesData?.items || citiesData.items.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">No destinations found</p>
            <div className="mt-4">
              <Button variant="gold" size="sm" onClick={openAddModal}>
                Add First City
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">City Name</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">Postal Code</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {citiesData.items.map((city) => (
                  <tr key={city.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-mono text-xs text-slate-400">#{city.id}</td>
                    <td className="p-4 font-bold text-slate-900">{city.name}</td>
                    <td className="p-4">{city.country}</td>
                    <td className="p-4 font-mono text-xs">{city.postalCode || '—'}</td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(city)}
                          className="h-8 px-2.5 text-xs"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCityToDelete(city)}
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

        {citiesData && citiesData.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100">
            <PaginationControls
              currentPage={citiesData.page}
              totalPages={citiesData.totalPages}
              totalCount={citiesData.totalCount}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCity ? `Edit Destination: ${editingCity.name}` : 'Add Destination'}
        maxWidth="md"
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
              City Name *
            </label>
            <Input placeholder="e.g. Paris" error={errors.name?.message} {...register('name')} />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Country *
            </label>
            <Input
              placeholder="e.g. France"
              error={errors.country?.message}
              {...register('country')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Postal Code (Optional)
            </label>
            <Input
              placeholder="e.g. 75008"
              error={errors.postalCode?.message}
              {...register('postalCode')}
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm" isLoading={isSubmitting}>
              {editingCity ? 'Save Changes' : 'Create City'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={cityToDelete !== null}
        onClose={() => setCityToDelete(null)}
        onConfirm={handleDelete}
        title="Delete City"
        message={`Are you sure you want to delete "${cityToDelete?.name}"? Deletion will fail if hotels are linked to this city.`}
        isLoading={deleteCityMutation.isPending}
      />
    </div>
  )
}
