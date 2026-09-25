import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, BedDouble, Edit2, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PaginationControls } from '@/components/shared/PaginationControls'
import { createRoomSchema, type CreateRoomFormData } from '@/lib/schemas'
import { useRooms, useCreateRoom, useUpdateRoom, useDeleteRoom } from '@/hooks/useRooms'
import { useHotels } from '@/hooks/useHotels'
import { useRoomTypes } from '@/hooks/useRoomTypes'
import { parseApiError } from '@/lib/apiError'
import { formatCurrency } from '@/lib/utils'
import { TableRowSkeleton } from '@/components/shared/LoadingSkeleton'
import type { RoomListItem } from '@/types/api'

export function AdminRoomsPage() {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: roomsData, isLoading, refetch } = useRooms({ page, pageSize })
  const { data: hotelsData } = useHotels({ pageSize: 100 })
  const { data: roomTypesData } = useRoomTypes({ pageSize: 50 })

  const createRoomMutation = useCreateRoom()
  const updateRoomMutation = useUpdateRoom()
  const deleteRoomMutation = useDeleteRoom()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<RoomListItem | null>(null)
  const [roomToDelete, setRoomToDelete] = useState<RoomListItem | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
  })

  const openAddModal = () => {
    reset({
      hotelId: hotelsData?.items?.[0]?.id || 1,
      roomNumber: '',
      roomTypeId: roomTypesData?.items?.[0]?.id || 1,
      pricePerNight: 150,
      adultsCapacity: 2,
      childrenCapacity: 0,
      availability: true,
    })
    setEditingRoom(null)
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (room: RoomListItem) => {
    setEditingRoom(room)
    reset({
      hotelId: room.hotelId,
      roomNumber: room.roomNumber,
      roomTypeId: room.roomTypeId,
      pricePerNight: room.pricePerNight,
      adultsCapacity: room.adultsCapacity,
      childrenCapacity: room.childrenCapacity,
      availability: room.availability,
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  const onSubmit = async (data: CreateRoomFormData) => {
    setFormError(null)
    try {
      if (editingRoom) {
        await updateRoomMutation.mutateAsync({
          id: editingRoom.id,
          data: {
            roomNumber: data.roomNumber,
            roomTypeId: data.roomTypeId,
            pricePerNight: data.pricePerNight,
            adultsCapacity: data.adultsCapacity,
            childrenCapacity: data.childrenCapacity,
            availability: data.availability,
          },
        })
      } else {
        await createRoomMutation.mutateAsync(data)
      }
      setIsModalOpen(false)
      refetch()
    } catch (err: any) {
      setFormError(parseApiError(err))
    }
  }

  const handleDelete = async () => {
    if (!roomToDelete) return
    try {
      await deleteRoomMutation.mutateAsync(roomToDelete.id)
      setRoomToDelete(null)
      refetch()
    } catch (err) {
      console.error('Failed to delete room:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Manage Rooms</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Global catalog of hotel rooms, capacity, and live availability flags.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={openAddModal}>
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Add Room
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8">
            <TableRowSkeleton columns={6} />
          </div>
        ) : !roomsData?.items || roomsData.items.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <BedDouble className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">No rooms found</p>
            <div className="mt-4">
              <Button variant="gold" size="sm" onClick={openAddModal}>
                Add First Room
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">Room #</th>
                  <th className="p-4">Hotel</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roomsData.items.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-900">#{room.roomNumber}</td>
                    <td className="p-4 font-medium text-slate-800">{room.hotelName}</td>
                    <td className="p-4 text-xs">{room.roomTypeName}</td>
                    <td className="p-4 font-bold text-slate-900">
                      {formatCurrency(room.pricePerNight)}
                    </td>
                    <td className="p-4 text-xs">
                      {room.adultsCapacity} Ad &bull; {room.childrenCapacity} Ch
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          room.availability
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {room.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(room)}
                          className="h-8 px-2.5 text-xs"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setRoomToDelete(room)}
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

        {roomsData && roomsData.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100">
            <PaginationControls
              currentPage={roomsData.page}
              totalPages={roomsData.totalPages}
              totalCount={roomsData.totalCount}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRoom ? `Edit Room #${editingRoom.roomNumber}` : 'Add Room'}
        maxWidth="md"
      >
        {formError && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!editingRoom && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Hotel *
              </label>
              <Select error={errors.hotelId?.message} {...register('hotelId')}>
                {hotelsData?.items?.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.cityName})
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Room Number *
              </label>
              <Input
                placeholder="e.g. 204"
                error={errors.roomNumber?.message}
                {...register('roomNumber')}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Room Type *
              </label>
              <Select error={errors.roomTypeId?.message} {...register('roomTypeId')}>
                {roomTypesData?.items?.map((rt) => (
                  <option key={rt.id} value={rt.id}>
                    {rt.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Price Per Night ($) *
            </label>
            <Input
              type="number"
              min="1"
              step="1"
              placeholder="150"
              error={errors.pricePerNight?.message}
              {...register('pricePerNight')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Adults Capacity *
              </label>
              <Input
                type="number"
                min="1"
                placeholder="2"
                error={errors.adultsCapacity?.message}
                {...register('adultsCapacity')}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Children Capacity *
              </label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                error={errors.childrenCapacity?.message}
                {...register('childrenCapacity')}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="admin-room-availability"
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              {...register('availability')}
            />
            <label
              htmlFor="admin-room-availability"
              className="text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Room is available for booking
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm" isLoading={isSubmitting}>
              {editingRoom ? 'Save Changes' : 'Create Room'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={roomToDelete !== null}
        onClose={() => setRoomToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Room"
        message={`Delete Room #${roomToDelete?.roomNumber}?`}
        isLoading={deleteRoomMutation.isPending}
      />
    </div>
  )
}
