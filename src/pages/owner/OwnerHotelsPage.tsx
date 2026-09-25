import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Building, BedDouble, Percent, Edit2, Trash2, ExternalLink } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useHotels, useDeleteHotel } from '@/hooks/useHotels'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { TableRowSkeleton } from '@/components/shared/LoadingSkeleton'
import { EmptyState } from '@/components/shared/EmptyState'

export function OwnerHotelsPage() {
  const { user } = useAuthStore()
  const { data: hotelsData, isLoading } = useHotels({ pageSize: 100 })
  const deleteHotelMutation = useDeleteHotel()

  const [hotelToDelete, setHotelToDelete] = useState<{ id: number; name: string } | null>(null)

  const myHotels = hotelsData?.items?.filter((h) => h.ownerId === user?.id) || []

  const handleDelete = async () => {
    if (!hotelToDelete) return
    try {
      await deleteHotelMutation.mutateAsync(hotelToDelete.id)
      setHotelToDelete(null)
    } catch (err) {
      console.error('Failed to delete hotel:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">My Hotels</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your hotel listings, room inventories, and deals.
          </p>
        </div>

        <Link to="/owner/hotels/create">
          <Button variant="gold" size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Add New Hotel
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8">
            <TableRowSkeleton columns={4} />
          </div>
        ) : myHotels.length === 0 ? (
          <EmptyState
            icon={Building}
            title="No Hotels Listed"
            description="You haven't listed any hotels yet. Create your first property to start accepting reservations."
            actionLabel="Add New Hotel"
            onAction={() => (window.location.href = '/owner/hotels/create')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">Hotel Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myHotels.map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{hotel.name}</span>
                        <Link to={`/hotels/${hotel.id}`} target="_blank" className="text-slate-400 hover:text-amber-600">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                    <td className="p-4 text-xs">
                      {hotel.cityName} &bull; {hotel.location}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-amber-600">{hotel.starRating} ★</span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link to={`/owner/hotels/${hotel.id}/edit`}>
                          <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                            <Edit2 className="w-3.5 h-3.5 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Link to={`/owner/hotels/${hotel.id}/rooms`}>
                          <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                            <BedDouble className="w-3.5 h-3.5 mr-1" />
                            Rooms
                          </Button>
                        </Link>
                        <Link to={`/owner/hotels/${hotel.id}/deals`}>
                          <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                            <Percent className="w-3.5 h-3.5 mr-1" />
                            Deals
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setHotelToDelete({ id: hotel.id, name: hotel.name })}
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

      <ConfirmDialog
        isOpen={hotelToDelete !== null}
        onClose={() => setHotelToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Hotel"
        message={`Are you sure you want to remove "${hotelToDelete?.name}"? All associated rooms and deals will also be affected.`}
        confirmText="Delete Property"
        isLoading={deleteHotelMutation.isPending}
      />
    </div>
  )
}
