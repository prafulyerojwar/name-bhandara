'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, PlusCircle, Search } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function HeroSection() {
  const { user } = useAuthStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 mandala-bg">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-200 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-semibold mb-6"
            >
              <span className="animate-flicker">🪔</span>
              Maharashtra Pilot • Now Live!
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-tight mb-6">
              <span className="gradient-text">भंडारा</span>{' '}
              <span className="text-stone-800">for</span>
              <br />
              <span className="text-stone-800">Every Soul 🙏</span>
            </h1>

            <p className="text-lg text-stone-600 leading-relaxed mb-4">
              Connect festival food, temple prasadam, wedding feasts &amp; private donations
              with NGOs and people in need across Maharashtra.
            </p>
            <p className="text-base text-orange-600 font-semibold italic mb-8">
              "अन्नदान महादान" — Food donation is the greatest charity
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/map"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <MapPin size={20} />
                Find Bhandara Near Me
              </Link>

              {(!user || user.role === 'donor') && (
                <Link
                  href={user ? '/post-bhandara' : '/auth/register'}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-orange-400 text-orange-600 font-bold rounded-2xl hover:bg-orange-50 transition-all"
                >
                  <PlusCircle size={20} />
                  Post a Bhandara
                </Link>
              )}

              {user?.role === 'ngo' && (
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-green-400 text-green-600 font-bold rounded-2xl hover:bg-green-50 transition-all"
                >
                  <Search size={20} />
                  Find Available Food
                </Link>
              )}
            </div>

            {/* Role badges */}
            <div className="flex flex-wrap gap-2 mt-8">
              {[
                { emoji: '👤', label: 'General Users', desc: 'View public bhandaras' },
                { emoji: '🍛', label: 'Food Donors', desc: 'Post & share food' },
                { emoji: '🤝', label: 'NGOs', desc: 'Book & collect food' },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-stone-200 shadow-sm">
                  <span>{r.emoji}</span>
                  <div>
                    <div className="text-xs font-bold text-stone-700">{r.label}</div>
                    <div className="text-xs text-stone-500">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Main card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-orange-100">
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-7xl mb-4"
                  >
                    🐘
                  </motion.div>
                  <h3 className="text-xl font-bold text-stone-800">Ganesh Chaturthi Bhandara</h3>
                  <p className="text-orange-600 text-sm font-medium mt-1">Shree Ganesh Mandal, Pune</p>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: '🍛', item: 'Modak Prasadam', qty: '500 servings' },
                    { icon: '🥗', item: 'Sabudana Khichdi', qty: '200 servings' },
                    { icon: '🍮', item: 'Puran Poli', qty: '300 pieces' },
                  ].map((food) => (
                    <div key={food.item} className="flex items-center justify-between bg-orange-50 rounded-xl px-4 py-2.5">
                      <span className="flex items-center gap-2 text-sm font-medium text-stone-700">
                        <span>{food.icon}</span> {food.item}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">{food.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-stone-500">
                  <MapPin size={14} className="text-orange-500" />
                  <span>Kasba Peth, Pune • Available till 8 PM</span>
                </div>

                <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center">
                  <p className="text-green-700 text-sm font-semibold">✅ Open to All — Come &amp; Eat!</p>
                </div>
              </div>

              {/* Floating mini cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 border border-orange-100"
              >
                <p className="text-xs font-bold text-stone-700">🍽️ Live Bhandaras</p>
                <p className="text-2xl font-extrabold text-orange-500">24</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 border border-green-100"
              >
                <p className="text-xs font-bold text-stone-700">🤝 NGOs Active</p>
                <p className="text-2xl font-extrabold text-green-500">12</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
