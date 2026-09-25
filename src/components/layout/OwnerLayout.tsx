import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building,
  PlusCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'
import { Navbar } from './Navbar'

export function OwnerLayout() {
  const location = useLocation()

  const navItems = [
    { label: 'Overview', path: '/owner', icon: LayoutDashboard, exact: true },
    { label: 'My Hotels', path: '/owner/hotels', icon: Building },
    { label: 'Add New Hotel', path: '/owner/hotels/create', icon: PlusCircle },
  ]

  const isCurrent = (path: string, exact = false) => {
    if (exact) return location.pathname === path
    return location.pathname === path || (path !== '/owner' && location.pathname.startsWith(path))
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm sticky top-28 space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Owner Portal</h3>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Property Host
                </span>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = isCurrent(item.path, item.exact)
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-amber-50 text-amber-800 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="pt-4 border-t border-slate-100">
              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Guest Site</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
