'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, Clock, Package, RefreshCw, Phone, AlertCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import { getPrivateBhandaras, getPublicBhandaras, getDonorBhandaras, getBookingsByNgo, updateBhandara, updateBooking, createBooking } from '@/lib/firestore';
import { Bhandara, Booking } from '@/types';
import { formatDateTime, getTimeRemaining } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [bhandaras, setBhandaras] = useState<Bhandara[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'booked' | 'my-posts'>('available');

  async function load() {
    if (!user) return;
    setLoading(true);
    try {
      if (user.role === 'ngo') {
        const [pub, priv, myBookings] = await Promise.all([
          getPublicBhandaras(user.city || undefined),
          getPrivateBhandaras(user.city || undefined),
          getBookingsByNgo(user.uid),
        ]);
        setBhandaras([...pub, ...priv]);
        setBookings(myBookings);
      } else if (user.role === 'donor') {
        const mine = await getDonorBhandaras(user.uid);
        setBhandaras(mine);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [user]);

  async function handleBook(bhandara: Bhandara) {
    if (!user) return;
    try {
      await updateBhandara(bhandara.id, {
        status: 'booked',
        bookedBy: user.uid,
        bookedByName: user.displayName,
        bookedAt: Date.now(),
      });
      await createBooking({
        bhandaraId: bhandara.id,
        ngoId: user.uid,
        ngoName: user.organizationName || user.displayName,
        status: 'confirmed',
        createdAt: Date.now(),
      });
      toast.success(`Booked: ${bhandara.title} 🙏`);
      load();
    } catch { toast.error('Booking failed'); }
  }

  async function handleCollected(booking: Booking) {
    try {
      await updateBooking(booking.id, { status: 'collected', collectedAt: Date.now() });
      await updateBhandara(booking.bhandaraId, { status: 'collected' });
      toast.success('Marked as collected! 🙏');
      load();
    } catch { toast.error('Update failed'); }
  }

  async function handleCancelBooking(booking: Booking, bhandaraId: string) {
    try {
      await updateBooking(booking.id, { status: 'cancelled' });
      await updateBhandara(bhandaraId, { status: 'available', bookedBy: undefined, bookedByName: undefined });
      toast.success('Booking cancelled');
      load();
    } catch { toast.error('Cancel failed'); }
  }

  async function handleExpireDonor(id: string) {
    try {
      await updateBhandara(id, { status: 'expired' });
      toast.success('Marked as expired');
      load();
    } catch { toast.error('Failed'); }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-orange-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="text-5xl mb-3">🔒</div>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">Please Login</h2>
            <Link href="/auth/login" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  const availableBhandaras = bhandaras.filter(b => b.status === 'available');
  const bookedBhandaras = bhandaras.filter(b => b.status === 'booked' && (user.role !== 'ngo' || b.bookedBy === user.uid));
  const myBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const collectedBookings = bookings.filter(b => b.status === 'collected');

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Welcome header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-6 text-white mb-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold mb-1">
                {user.role === 'ngo' ? '🤝' : '🍛'} Namaste, {user.displayName}!
              </h1>
              <p className="text-orange-100 text-sm">
                {user.role === 'ngo'
                  ? `${user.organizationName || 'Your NGO'} • Find & collect available food`
                  : 'Manage your Bhandara posts'}
              </p>
              {user.city && <p className="text-orange-200 text-xs mt-1">📍 {user.city}, Maharashtra</p>}
            </div>
            <button onClick={load} className="p-2.5 bg-orange-400 rounded-xl hover:bg-orange-300 transition-colors">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        {(() => {
          const stats = user.role === 'ngo'
            ? [
                { label: 'Available Food', value: availableBhandaras.length, emoji: '🍽️', color: 'bg-green-50 border-green-200 text-green-700' },
                { label: 'Active Bookings', value: myBookings.length, emoji: '📦', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                { label: 'Collected', value: collectedBookings.length, emoji: '✅', color: 'bg-orange-50 border-orange-200 text-orange-700' },
              ]
            : [
                { label: 'Active Posts', value: availableBhandaras.length, emoji: '🟢', color: 'bg-green-50 border-green-200 text-green-700' },
                { label: 'Booked by NGO', value: bookedBhandaras.length, emoji: '🤝', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                { label: 'Total Posts', value: bhandaras.length, emoji: '📋', color: 'bg-orange-50 border-orange-200 text-orange-700' },
              ];
          return (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {stats.map(s => (
                <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-2xl border p-4 text-center ${s.color}`}
                >
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className="text-2xl font-extrabold">{s.value}</div>
                  <div className="text-xs font-medium mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </div>
          );
        })()}

        {/* Tabs — NGO */}
        {user.role === 'ngo' && (
          <>
            <div className="flex gap-2 mb-5 bg-white rounded-2xl p-1.5 border border-orange-200 shadow-sm">
              {[
                { key: 'available', label: '🍽️ Available Food', count: availableBhandaras.length },
                { key: 'booked', label: '📦 My Bookings', count: myBookings.length },
              ].map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key as 'available' | 'booked')}
                  className={cn(
                    'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2',
                    activeTab === t.key ? 'bg-orange-500 text-white shadow-md' : 'text-stone-600 hover:bg-orange-50'
                  )}
                >
                  {t.label}
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-bold', activeTab === t.key ? 'bg-orange-400 text-white' : 'bg-stone-200 text-stone-600')}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>

            {activeTab === 'available' && (
              <div className="space-y-4">
                {loading && <div className="text-center py-10"><div className="text-4xl animate-float">🍛</div></div>}
                {!loading && availableBhandaras.length === 0 && (
                  <div className="text-center py-10 bg-white rounded-3xl border border-orange-100">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="text-stone-600 font-medium">No food available in {user.city || 'your area'} right now</p>
                    <p className="text-stone-400 text-sm mt-1">Check back soon or change your city in profile</p>
                  </div>
                )}
                {availableBhandaras.map((b, i) => (
                  <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-stone-800">{b.title}</h3>
                        <p className="text-xs text-stone-500 mt-0.5">by {b.donorName}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.isPublic ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {b.isPublic ? '✅ Public' : '🔒 NGO Only'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {b.foodItems.map(f => (
                        <span key={f.name} className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full border border-orange-100">
                          {f.isVeg ? '🟢' : '🔴'} {f.name} · {f.quantity}
                        </span>
                      ))}
                    </div>

                    <div className="text-xs text-stone-500 space-y-1 mb-4">
                      <div className="flex items-center gap-1.5"><MapPin size={12} className="text-orange-500" />{b.address}, {b.city}</div>
                      <div className="flex items-center gap-1.5"><Clock size={12} className="text-orange-500" />Till {formatDateTime(b.availableTill)} · <span className="text-green-600 font-medium">{getTimeRemaining(b.availableTill)}</span></div>
                      <div className="flex items-center gap-1.5"><Package size={12} className="text-orange-500" />{b.servings} servings</div>
                      {b.donorPhone && <div className="flex items-center gap-1.5"><Phone size={12} className="text-orange-500" />{b.donorPhone}</div>}
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/map?id=${b.id}`} className="flex-1 text-center py-2.5 rounded-xl bg-orange-50 text-orange-600 text-sm font-semibold hover:bg-orange-100 transition-colors">
                        📍 View on Map
                      </Link>
                      <button onClick={() => handleBook(b)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold hover:shadow-md hover:scale-[1.02] transition-all"
                      >
                        🤝 Book Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'booked' && (
              <div className="space-y-4">
                {myBookings.length === 0 && (
                  <div className="text-center py-10 bg-white rounded-3xl border border-orange-100">
                    <div className="text-4xl mb-2">📦</div>
                    <p className="text-stone-600 font-medium">No active bookings</p>
                    <p className="text-stone-400 text-sm mt-1">Book available food from the list above</p>
                  </div>
                )}
                {myBookings.map((booking, i) => {
                  const bhandara = bhandaras.find(b => b.id === booking.bhandaraId);
                  return (
                    <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl border border-green-200 shadow-sm p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-stone-800">{bhandara?.title || 'Bhandara'}</h3>
                          <p className="text-xs text-stone-500">{bhandara?.address}, {bhandara?.city}</p>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-semibold flex items-center gap-1">
                          <CheckCircle size={11} /> Confirmed
                        </span>
                      </div>
                      {bhandara && (
                        <div className="text-xs text-stone-500 mb-3 flex items-center gap-1">
                          <Clock size={11} className="text-orange-500" />
                          Till {formatDateTime(bhandara.availableTill)} · <span className="text-red-500 font-medium">{getTimeRemaining(bhandara.availableTill)}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {bhandara && (
                          <Link href={`/map?id=${bhandara.id}`} className="flex-1 text-center py-2.5 rounded-xl bg-orange-50 text-orange-600 text-sm font-semibold hover:bg-orange-100">
                            📍 Navigate
                          </Link>
                        )}
                        <button onClick={() => handleCollected(booking)}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold hover:shadow-md transition-all"
                        >
                          ✅ Mark Collected
                        </button>
                        <button onClick={() => bhandara && handleCancelBooking(booking, bhandara.id)}
                          className="px-3 py-2.5 rounded-xl bg-red-50 text-red-500 text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Donor dashboard */}
        {user.role === 'donor' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-stone-800">My Bhandara Posts</h2>
              <Link href="/post-bhandara" className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
                + New Post
              </Link>
            </div>

            {loading && <div className="text-center py-10"><div className="text-4xl animate-float">🍛</div></div>}
            {!loading && bhandaras.length === 0 && (
              <div className="text-center py-14 bg-white rounded-3xl border border-orange-100">
                <div className="text-5xl mb-3">🍽️</div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">No posts yet</h3>
                <p className="text-stone-500 text-sm mb-5">Share your Bhandara with the community</p>
                <Link href="/post-bhandara" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl">
                  Post First Bhandara
                </Link>
              </div>
            )}
            <div className="space-y-4">
              {bhandaras.map((b, i) => (
                <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className={cn('bg-white rounded-2xl border shadow-sm p-4', b.status === 'available' ? 'border-green-200' : b.status === 'booked' ? 'border-blue-200' : 'border-stone-200')}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-stone-800">{b.title}</h3>
                    <span className={cn('text-xs px-2.5 py-1 rounded-full font-semibold capitalize', {
                      'bg-green-100 text-green-700': b.status === 'available',
                      'bg-blue-100 text-blue-700': b.status === 'booked',
                      'bg-stone-100 text-stone-600': b.status === 'collected' || b.status === 'expired',
                    })}>
                      {b.status === 'booked' ? `🤝 Booked by ${b.bookedByName || 'NGO'}` : b.status}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 space-y-1 mb-3">
                    <div className="flex items-center gap-1"><MapPin size={11} className="text-orange-400" />{b.address}, {b.city}</div>
                    <div className="flex items-center gap-1"><Clock size={11} className="text-orange-400" />Till {formatDateTime(b.availableTill)}</div>
                    <div>{b.foodItems.length} food items · {b.servings} servings</div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/map?id=${b.id}`} className="flex-1 text-center py-2 rounded-xl bg-orange-50 text-orange-600 text-sm font-semibold hover:bg-orange-100">📍 View</Link>
                    {b.status === 'available' && (
                      <button onClick={() => handleExpireDonor(b.id)} className="px-3 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100">
                        Mark Expired
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* General user */}
        {user.role === 'general' && (
          <div className="text-center py-14 bg-white rounded-3xl border border-orange-100">
            <div className="text-5xl mb-3">🗺️</div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">Find Bhandaras Near You</h3>
            <p className="text-stone-500 text-sm mb-5">View public festival food & bhandaras on the live map</p>
            <Link href="/map" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl">
              Open Live Map
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
