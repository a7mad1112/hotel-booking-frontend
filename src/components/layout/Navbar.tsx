import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Compass,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Building,
  ShieldAlert,
  CalendarCheck,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'

export function Navbar() {
  const { user, isAuthenticated, logout, isAdmin, isOwner } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
              Grand<span className="text-amber-600">Vibe</span>
            </span>
            <span className="block text-[9px] uppercase tracking-widest font-semibold text-slate-400 -mt-1">
              Luxury Hotels
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-semibold transition-colors ${
              isActive('/') ? 'text-amber-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Explore
          </Link>
          <Link
            to="/search"
            className={`text-sm font-semibold transition-colors ${
              isActive('/search') ? 'text-amber-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Find Hotels
          </Link>

          {isAuthenticated && (
            <Link
              to="/bookings"
              className={`text-sm font-semibold transition-colors ${
                isActive('/bookings') ? 'text-amber-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Bookings
            </Link>
          )}

          {isOwner && (
            <Link
              to="/owner"
              className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                location.pathname.startsWith('/owner')
                  ? 'text-amber-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-4 h-4 text-amber-600" />
              Owner Portal
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                location.pathname.startsWith('/admin')
                  ? 'text-amber-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Admin
            </Link>
          )}
        </nav>

        {/* User Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 pr-2 rounded-full border border-slate-200 hover:border-slate-300 bg-white text-slate-800 transition-all cursor-pointer shadow-xs"
              >
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold max-w-[120px] truncate">{user.email}</span>
                <Badge variant={user.role === 'Admin' ? 'destructive' : user.role === 'Owner' ? 'gold' : 'default'} className="text-[10px] py-0 px-1.5">
                  {user.role}
                </Badge>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/bookings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <CalendarCheck className="w-4 h-4 text-slate-400" />
                    My Bookings
                  </Link>

                  {isOwner && (
                    <Link
                      to="/owner"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Building className="w-4 h-4 text-amber-600" />
                      Owner Dashboard
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      Admin Control Panel
                    </Link>
                  )}

                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false)
                        logout()
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="gold" size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-amber-600"
          >
            Explore
          </Link>
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-amber-600"
          >
            Find Hotels
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-700 hover:text-amber-600"
              >
                My Bookings
              </Link>
              {isOwner && (
                <Link
                  to="/owner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-amber-600"
                >
                  Owner Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-rose-600"
                >
                  Admin Control Panel
                </Link>
              )}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 truncate max-w-[200px]">{user?.email}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                  }}
                  className="text-rose-600 border-rose-200"
                >
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="gold" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
