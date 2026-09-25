import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, PlusCircle, Percent, Edit2, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { createDealSchema, type CreateDealFormData } from '@/lib/schemas'
import { useHotel } from '@/hooks/useHotels'
import { useDeals, useCreateDeal, useUpdateDeal, useDeleteDeal } from '@/hooks/useDeals'
import { parseApiError } from '@/lib/apiError'
import { formatDate } from '@/lib/utils'
import type { Deal } from '@/types/api'

export function OwnerDealsPage() {
  const { id } = useParams<{ id: string }>()
  const hotelId = Number(id)

  const { data: hotel } = useHotel(hotelId)
  const { data: dealsData, refetch: refetchDeals } = useDeals({ pageSize: 100 })
  const createDealMutation = useCreateDeal()
  const updateDealMutation = useUpdateDeal()
  const deleteDealMutation = useDeleteDeal()

  const hotelDeals = dealsData?.items?.filter((d) => d.hotelId === hotelId) || []

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
    defaultValues: {
      hotelId,
      discountPercentage: 15,
      startDate: getTodayISO(),
      endDate: '',
    },
  })

  const openAddModal = () => {
    reset({
      hotelId,
      discountPercentage: 15,
      startDate: getTodayISO(),
      endDate: '',
    })
    setFormError(null)
    setEditingDeal(null)
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
        await updateDealMutation.mutateAsync({
          id: editingDeal.id,
          data: {
            hotelId: data.hotelId,
            discountPercentage: data.discountPercentage,
            startDate: data.startDate,
            endDate: data.endDate,
          },
        })
      } else {
        await createDealMutation.mutateAsync(data)
      }
      setIsModalOpen(false)
      refetchDeals()
    } catch (err: any) {
      setFormError(parseApiError(err))
    }
  }

  const handleDelete = async () => {
    if (!dealToDelete) return
    try {
      await deleteDealMutation.mutateAsync(dealToDelete.id)
      setDealToDelete(null)
      refetchDeals()
    } catch (err) {
      console.error('Failed to delete deal:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Promotional Deals: {hotel?.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure percentage discounts for limited-time seasonal campaigns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/owner/hotels">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Hotels
            </Button>
          </Link>
          <Button variant="gold" size="sm" onClick={openAddModal}>
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Create Deal
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {hotelDeals.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <Percent className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">No active deals running</p>
            <p className="text-xs mt-1">Create promotional discounts to attract more bookings.</p>
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
                  <th className="p-4 pl-6">Discount</th>
                  <th className="p-4">Start Date</th>
                  <th className="p-4">End Date</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hotelDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-amber-600 text-base">
                      {deal.discountPercentage}% OFF
                    </td>
                    <td className="p-4">{formatDate(deal.startDate)}</td>
                    <td className="p-4">{formatDate(deal.endDate)}</td>
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
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDeal ? 'Update Promotional Deal' : 'Launch New Promotional Deal'}
        maxWidth="md"
      >
        {formError && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" value={hotelId} {...register('hotelId')} />

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
              {editingDeal ? 'Update Deal' : 'Publish Deal'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={dealToDelete !== null}
        onClose={() => setDealToDelete(null)}
        onConfirm={handleDelete}
        title="Remove Promotion"
        message={`Delete this ${dealToDelete?.discountPercentage}% discount promotion?`}
        isLoading={deleteDealMutation.isPending}
      />
    </div>
  )
}
