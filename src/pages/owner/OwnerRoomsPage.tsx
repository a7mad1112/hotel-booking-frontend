import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  PlusCircle,
  BedDouble,
  Edit2,
  Trash2,
  Images,
  AlertCircle,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { ImageUploader } from '@/components/shared/ImageUploader'
import { createRoomSchema, type CreateRoomFormData } from '@/lib/schemas'
import { useHotel } from '@/hooks/useHotels'
import {
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
  useUploadRoomImage,
  useDeleteRoomImage,
} from '@/hooks/useRooms'
import { useRoomTypes } from '@/hooks/useRoomTypes'
import { parseApiError } from '@/lib/apiError'
import { formatCurrency } from '@/lib/utils'
import type { HotelRoom } from '@/types/api'

export function OwnerRoomsPage() {
  const { id } = useParams<{ id: string }>()
  const hotelId = Number(id)

  const { data: hotel, refetch: refetchHotel } = useHotel(hotelId)
  const { data: roomTypesData } = useRoomTypes({ pageSize: 50 })

  const createRoomMutation = useCreateRoom()
  const updateRoomMutation = useUpdateRoom()
  const deleteRoomMutation = useDeleteRoom()
  const uploadImageMutation = useUploadRoomImage()
  const deleteImageMutation = useDeleteRoomImage()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<HotelRoom | null>(null)
  const [roomToDelete, setRoomToDelete] = useState<HotelRoom | null>(null)
  const [managingImagesRoom, setManagingImagesRoom] = useState<HotelRoom | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      hotelId,
      availability: true,
      adultsCapacity: 2,
      childrenCapacity: 0,
      pricePerNight: 150,
    },
  })

  const openAddModal = () => {
    reset({
      hotelId,
      roomNumber: '',
      roomTypeId: roomTypesData?.items?.[0]?.id || 1,
      pricePerNight: 150,
      adultsCapacity: 2,
      childrenCapacity: 0,
      availability: true,
    })
    setFormError(null)
    setEditingRoom(null)
    setIsAddModalOpen(true)
  }

  const openEditModal = (room: HotelRoom) => {
    setEditingRoom(room)
    reset({
      hotelId,
      roomNumber: room.roomNumber,
      roomTypeId: room.roomTypeId,
      pricePerNight: room.pricePerNight,
      adultsCapacity: room.adultsCapacity,
      childrenCapacity: room.childrenCapacity,
      availability: room.availability,
    })
    setFormError(null)
    setIsAddModalOpen(true)
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
      setIsAddModalOpen(false)
      refetchHotel()
    } catch (err: any) {
      setFormError(parseApiError(err))
    }
  }

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return
    try {
      await deleteRoomMutation.mutateAsync(roomToDelete.id)
      setRoomToDelete(null)
      refetchHotel()
    } catch (err) {
      console.error('Failed to delete room:', err)
    }
  }

  const handleUploadRoomImage = async (file: File) => {
    if (!managingImagesRoom) return
    await uploadImageMutation.mutateAsync({ roomId: managingImagesRoom.id, file })
    await refetchHotel()
  }

  const handleDeleteRoomImage = async (imageId: number) => {
    if (!managingImagesRoom) return
    await deleteImageMutation.mutateAsync({ roomId: managingImagesRoom.id, imageId })
    await refetchHotel()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Manage Rooms: {hotel?.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure room types, pricing, capacity, and upload room interior photos.
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
            Add Room
          </Button>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {!hotel?.rooms || hotel.rooms.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <BedDouble className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">No rooms configured yet</p>
            <p className="text-xs mt-1">Add your hotel rooms to make them available for reservation.</p>
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
                  <th className="p-4">Type</th>
                  <th className="p-4">Price / Night</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hotel.rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-900">#{room.roomNumber}</td>
                    <td className="p-4 font-semibold text-slate-800">{room.roomTypeName}</td>
                    <td className="p-4 font-bold text-slate-900">
                      {formatCurrency(room.pricePerNight)}
                    </td>
                    <td className="p-4 text-xs">
                      {room.adultsCapacity} Adults &bull; {room.childrenCapacity} Children
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
                          onClick={() => setManagingImagesRoom(room)}
                          className="h-8 px-2.5 text-xs"
                          title="Manage Photos"
                        >
                          <Images className="w-3.5 h-3.5 mr-1 text-amber-600" />
                          Photos ({room.images?.length || 0})
                        </Button>
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
      </div>

      {/* Add / Edit Room Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingRoom ? `Edit Room #${editingRoom.roomNumber}` : 'Add New Room'}
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Room Number *
              </label>
              <Input
                placeholder="e.g. 101"
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
              id="availability"
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              {...register('availability')}
            />
            <label htmlFor="availability" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Room is currently available for guest bookings
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm" isLoading={isSubmitting}>
              {editingRoom ? 'Update Room' : 'Create Room'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Room Photo Gallery Modal */}
      <Modal
        isOpen={managingImagesRoom !== null}
        onClose={() => setManagingImagesRoom(null)}
        title={`Photos: Room #${managingImagesRoom?.roomNumber}`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <ImageUploader
            onUpload={handleUploadRoomImage}
            isLoading={uploadImageMutation.isPending}
          />

          <div className="pt-4 border-t border-slate-100">
            {managingImagesRoom?.images && managingImagesRoom.images.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {managingImagesRoom.images.map((img) => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-video bg-slate-100 border">
                    <img src={img.imageUrl} alt="Room" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDeleteRoomImage(img.id)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No images uploaded for this room.</p>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={roomToDelete !== null}
        onClose={() => setRoomToDelete(null)}
        onConfirm={handleDeleteRoom}
        title="Delete Room"
        message={`Are you sure you want to delete Room #${roomToDelete?.roomNumber}?`}
        isLoading={deleteRoomMutation.isPending}
      />
    </div>
  )
}
