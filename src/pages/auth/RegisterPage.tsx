import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, Compass, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { registerSchema, type RegisterFormData } from '@/lib/schemas'
import { parseApiError, parseFieldErrors } from '@/lib/apiError'
import { useAuth } from '@/hooks/useAuth'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setFormError(null)
    setSuccessMessage(null)
    try {
      await registerUser(data)
      setSuccessMessage('Registration successful! Redirecting to sign in...')
      setTimeout(() => {
        navigate('/login', { state: { registeredEmail: data.email } })
      }, 1500)
    } catch (err: any) {
      const fieldErrors = parseFieldErrors(err)
      Object.entries(fieldErrors).forEach(([field, msg]) => {
        setError(field as keyof RegisterFormData, { message: msg })
      })

      if (Object.keys(fieldErrors).length === 0) {
        setFormError(parseApiError(err))
      }
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <Compass className="w-7 h-7" />
            </div>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">Create Account</h1>
          <p className="text-sm text-slate-500 mt-2">
            Join GrandVibe to unlock bespoke hotel deals and seamless reservations
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 backdrop-blur-md">
          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="name@example.com"
                icon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Password
              </label>
              <Input
                type="password"
                placeholder="At least 8 characters"
                icon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                {...register('password')}
              />
              <p className="text-[11px] text-slate-400 mt-1">Must be at least 8 characters long</p>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full mt-6"
              isLoading={isSubmitting}
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
