import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, Tag, Edit2, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PaginationControls } from '@/components/shared/PaginationControls'
import { createRoomTypeSchema, type CreateRoomTypeFormData } from '@/lib/schemas'
import {
  useRoomTypes,
  useCreateRoomType,
  useUpdateRoomType,
  useDeleteRoomType,
} from '@/hooks/useRoomTypes'
import { parseApiError } from '@/lib/apiError'
import { TableRowSkeleton } from '@/components/shared/LoadingSkeleton'
import type { RoomType } from '@/types/api'

export function AdminRoomTypesPage() {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: roomTypesData, isLoading, refetch } = useRoomTypes({ page, pageSize })
  const createMutation = useCreateRoomType()
  const updateMutation = useUpdateRoomType()
  const deleteMutation = useDeleteRoomType()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingType, setEditingType] = useState<RoomType | null>(null)
  const [typeToDelete, setTypeToDelete] = useState<RoomType | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoomTypeFormData>({
    resolver: zodResolver(createRoomTypeSchema),
  })

  const openAddModal = () => {
    reset({ name: '', description: '' })
    setEditingType(null)
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (rt: RoomType) => {
    setEditingType(rt)
    reset({
      name: rt.name,
      description: rt.description || '',
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  const onSubmit = async (data: CreateRoomTypeFormData) => {
    setFormError(null)
    try {
      if (editingType) {
        await updateMutation.mutateAsync({ id: editingType.id, data })
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
    if (!typeToDelete) return
    try {
      await deleteMutation.mutateAsync(typeToDelete.id)
      setTypeToDelete(null)
      refetch()
    } catch (err) {
      console.error('Failed to delete room type:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Manage Room Types</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure room classification taxonomy (Standard, Deluxe Suite, Penthouse, etc.).
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={openAddModal}>
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Add Room Type
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8">
            <TableRowSkeleton columns={3} />
          </div>
        ) : !roomTypesData?.items || roomTypesData.items.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">No room types defined</p>
            <div className="mt-4">
              <Button variant="gold" size="sm" onClick={openAddModal}>
                Add First Room Type
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roomTypesData.items.map((rt) => (
                  <tr key={rt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-mono text-xs text-slate-400">#{rt.id}</td>
                    <td className="p-4 font-bold text-slate-900">{rt.name}</td>
                    <td className="p-4 text-xs text-slate-500 max-w-md truncate">
                      {rt.description || '—'}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(rt)}
                          className="h-8 px-2.5 text-xs"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setTypeToDelete(rt)}
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

        {roomTypesData && roomTypesData.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100">
            <PaginationControls
              currentPage={roomTypesData.page}
              totalPages={roomTypesData.totalPages}
              totalCount={roomTypesData.totalCount}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingType ? `Edit Room Type: ${editingType.name}` : 'Add Room Type'}
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
              Type Name *
            </label>
            <Input
              placeholder="e.g. Presidential Suite"
              error={errors.name?.message}
              {...register('name')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Spacious corner suite featuring panoramic city views, marble bathroom, and private terrace."
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              {...register('description')}
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm" isLoading={isSubmitting}>
              {editingType ? 'Save Changes' : 'Create Room Type'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={typeToDelete !== null}
        onClose={() => setTypeToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Room Type"
        message={`Delete "${typeToDelete?.name}"?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
