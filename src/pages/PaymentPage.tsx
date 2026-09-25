import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Lock, CreditCard, AlertCircle, ArrowLeft, RefreshCw, Loader2 } from 'lucide-react'
import { useCreatePayment } from '@/hooks/useBookings'
import { Button } from '@/components/ui/Button'
import { parseApiError } from '@/lib/apiError'

export function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const id = Number(bookingId)
  const navigate = useNavigate()

  const createPaymentMutation = useCreatePayment()
  const [error, setError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const initiatePayment = async () => {
    setError(null)
    setIsRedirecting(true)
    try {
      const response = await createPaymentMutation.mutateAsync(id)
      if (response?.checkoutUrl) {
        window.location.href = response.checkoutUrl
      } else {
        setError('No checkout URL returned from payment service.')
        setIsRedirecting(false)
      }
    } catch (err: any) {
      setError(parseApiError(err))
      setIsRedirecting(false)
    }
  }

  useEffect(() => {
    if (id && !isNaN(id)) {
      initiatePayment()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 text-center space-y-6">
        {isRedirecting && !error ? (
          <div className="space-y-4 py-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              Connecting to Stripe
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Securing your reservation payment gateway... You will be redirected shortly to complete the transaction.
            </p>
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-4">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS 1.3 End-to-End Encryption</span>
            </div>
          </div>
        ) : error ? (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Payment Gateway Notice
            </h2>
            <p className="text-xs text-rose-600 font-medium px-4 leading-relaxed">{error}</p>
            <div className="pt-4 flex flex-col gap-2">
              <Button
                variant="gold"
                onClick={initiatePayment}
                isLoading={createPaymentMutation.isPending}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Payment
              </Button>
              <Link to={`/checkout/${id}`}>
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Checkout
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <CreditCard className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">Pay for Booking #{id}</h2>
            <Button variant="gold" onClick={initiatePayment} className="w-full">
              Proceed to Stripe Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
