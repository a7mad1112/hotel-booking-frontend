import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, Percent, Edit2, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PaginationControls } from '@/components/shared/PaginationControls'
import { createDealSchema, type CreateDealFormData } from '@/lib/schemas'
import { useDeals, useCreateDeal, useUpdateDeal, useDeleteDeal } from '@/hooks/useDeals'
import { useHotels } from '@/hooks/useHotels'
import { parseApiError } from '@/lib/apiError'
import { formatDate } from '@/lib/utils'
import { TableRowSkeleton } from '@/components/shared/LoadingSkeleton'
import type { Deal } from '@/types/api'

export function AdminDealsPage() {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: dealsData, isLoading, refetch } = useDeals({ page, pageSize })
  const { data: hotelsData } = useHotels({ pageSize: 100 })

  const createMutation = useCreateDeal()
  const updateMutation = useUpdateDeal()
  const deleteMutation = useDeleteDeal()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const getTodayISO = () => new Date().toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateDealFormData>({
    resolver: zodResolver(createDealSchema),
  })

  const openAddModal = () => {
    reset({
      hotelId: hotelsData?.items?.[0]?.id || 1,
      discountPercentage: 20,
      startDate: getTodayISO(),
      endDate: '',
    })
    setEditingDeal(null)
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (deal: Deal) => {
    setEditingDeal(deal)
    reset({
      hotelId: deal.hotelId,
      discountPercentage: deal.discountPercentage,
      startDate: deal.startDate.split('T')[0],
      endDate: deal.endDate.split('T')[0],
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  const onSubmit = async (data: CreateDealFormData) => {
    setFormError(null)
    try {
      if (editingDeal) {
        await updateMutation.mutateAsync({
          id: editingDeal.id,
          data: {
            hotelId: data.hotelId,
            discountPercentage: data.discountPercentage,
            startDate: data.startDate,
            endDate: data.endDate,
          },
        })
      } else {
        await createMutation.mutateAsync(data)
      }
      setIsModalOpen(false)
      refetch()
    } catch (err: any) {
      setFormError(parseApiError(err))
    }
  }

  const handleDelete = async () => {
    if (!dealToDelete) return
    try {
      await deleteMutation.mutateAsync(dealToDelete.id)
      setDealToDelete(null)
      refetch()
    } catch (err) {
      console.error('Failed to delete deal:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Manage Deals</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            System-wide promotional discounts and limited-time featured deals.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={openAddModal}>
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Create Deal
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8">
            <TableRowSkeleton columns={5} />
          </div>
        ) : !dealsData?.items || dealsData.items.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <Percent className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">No deals active</p>
            <div className="mt-4">
              <Button variant="gold" size="sm" onClick={openAddModal}>
                Create First Deal
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Hotel</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Start Date</th>
                  <th className="p-4">End Date</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dealsData.items.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-mono text-xs text-slate-400">#{deal.id}</td>
                    <td className="p-4 font-bold text-slate-900">{deal.hotelName}</td>
                    <td className="p-4 font-bold text-amber-600">{deal.discountPercentage}% OFF</td>
                    <td className="p-4 text-xs">{formatDate(deal.startDate)}</td>
                    <td className="p-4 text-xs">{formatDate(deal.endDate)}</td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(deal)}
                          className="h-8 px-2.5 text-xs"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDealToDelete(deal)}
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

        {dealsData && dealsData.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100">
            <PaginationControls
              currentPage={dealsData.page}
              totalPages={dealsData.totalPages}
              totalCount={dealsData.totalCount}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDeal ? 'Edit Promotional Deal' : 'Create Promotional Deal'}
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
              Select Hotel *
            </label>
            <Select error={errors.hotelId?.message} {...register('hotelId')}>
              {hotelsData?.items?.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.cityName})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Discount Percentage (1 - 100%) *
            </label>
            <Input
              type="number"
              min="1"
              max="100"
              placeholder="20"
              error={errors.discountPercentage?.message}
              {...register('discountPercentage')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Start Date *
              </label>
              <Input
                type="date"
                error={errors.startDate?.message}
                {...register('startDate')}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                End Date *
              </label>
              <Input
                type="date"
                error={errors.endDate?.message}
                {...register('endDate')}
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm" isLoading={isSubmitting}>
              {editingDeal ? 'Save Changes' : 'Create Deal'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={dealToDelete !== null}
        onClose={() => setDealToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Deal"
        message={`Delete deal on "${dealToDelete?.hotelName}" (${dealToDelete?.discountPercentage}%)?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
