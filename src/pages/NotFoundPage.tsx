import React from 'react'
import { Link } from 'react-router-dom'
import { Compass, Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 border border-amber-100 shadow-sm">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>
      <span className="text-4xl font-extrabold text-amber-600 font-display">404</span>
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display mt-2">
        Destination Not Found
      </h1>
      <p className="text-sm text-slate-500 max-w-md mt-3 leading-relaxed">
        The retreat or page you are looking for might have been moved, renamed, or is temporarily unavailable.
      </p>
      <div className="flex items-center gap-3 mt-8">
        <Link to="/">
          <Button variant="primary">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
        <Link to="/search">
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Search Hotels
          </Button>
        </Link>
      </div>
    </div>
  )
}
