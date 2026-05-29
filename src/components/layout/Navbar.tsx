'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, LogOut, User, PlusCircle, Home, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { logoutUser } from '@/lib/auth';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await logoutUser();
    toast.success('Logged out successfully');
    router.push('/');
  }

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/map', label: 'Live Map', icon: MapPin },
  ];

  if (user?.role === 'donor') {
    links.push({ href: '/post-bhandara', label: 'Post Bhandara', icon: PlusCircle });
  }
  if (user?.role === 'ngo') {
    links.push({ href: '/dashboard', label: 'NGO Dashboard', icon: Bell });
  }
  if (user?.role === 'general') {
    links.push({ href: '/dashboard', label: 'Dashboard', icon: Home });
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b border-orange-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl animate-flicker">🪔</span>
            <div>
              <span className="text-xl font-bold gradient-text">Nam Bhandara</span>
              <span className="hidden sm:block text-xs text-orange-500 font-medium -mt-1">भंडारा | Food for All</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all',
                  pathname === href
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-stone-700 hover:bg-orange-100 hover:text-orange-600'
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-orange-50 hover:bg-orange-100 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.displayName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-stone-700 max-w-[100px] truncate">
                    {user.displayName}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-200 text-orange-700 capitalize">
                    {user.role}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-stone-500 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all"
                >
                  Join Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-orange-100 transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} className="text-orange-600" /> : <Menu size={22} className="text-orange-600" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-orange-200 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    pathname === href
                      ? 'bg-orange-500 text-white'
                      : 'text-stone-700 hover:bg-orange-50 hover:text-orange-600'
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
              <div className="pt-2 border-t border-orange-100">
                {user ? (
                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-stone-700 hover:bg-orange-50"
                    >
                      <User size={18} />
                      Profile ({user.displayName})
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setOpen(false)}
                      className="flex-1 text-center px-4 py-3 rounded-xl text-sm font-medium text-orange-600 border border-orange-300 hover:bg-orange-50"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setOpen(false)}
                      className="flex-1 text-center px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-red-500"
                    >
                      Join Free
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
