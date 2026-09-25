import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldX, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 border border-rose-100 shadow-sm">
        <ShieldX className="w-10 h-10" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Access Denied</span>
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display mt-2">
        Unauthorized Area
      </h1>
      <p className="text-sm text-slate-500 max-w-md mt-3 leading-relaxed">
        Your current account role does not have the privileges required to access this page. If you believe this is an error, please contact your administrator.
      </p>
      <div className="flex items-center gap-3 mt-8">
        <Link to="/">
          <Button variant="primary">
            <Home className="w-4 h-4 mr-2" />
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  )
}
