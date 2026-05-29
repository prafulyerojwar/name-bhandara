'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Building2, Save, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import { updateUserProfile } from '@/lib/firestore';
import { MAHARASHTRA_CITIES } from '@/types';
import toast from 'react-hot-toast';
import Link from 'next/link';

const ROLE_INFO = {
  general: { emoji: '👤', label: 'General User', desc: 'View public bhandaras on the map', color: 'from-blue-400 to-cyan-400' },
  donor: { emoji: '🍛', label: 'Food Donor', desc: 'Post and share food for distribution', color: 'from-orange-400 to-red-400' },
  ngo: { emoji: '🤝', label: 'NGO / Social Org', desc: 'Book and collect food for needy people', color: 'from-green-400 to-emerald-400' },
};

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: user?.displayName || '',
    phone: user?.phone || '',
    city: user?.city || '',
    organizationName: user?.organizationName || '',
  });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, form);
      setUser({ ...user, ...form });
      toast.success('Profile updated 🙏');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  }

  if (!user) return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="text-5xl mb-3">🔒</div>
          <Link href="/auth/login" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl">Login</Link>
        </div>
      </div>
    </div>
  );

  const roleInfo = ROLE_INFO[user.role];

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-6 text-white mb-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">
                {user.displayName?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <h1 className="text-xl font-extrabold">{user.displayName}</h1>
                <p className="text-orange-100 text-sm">{user.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                    {roleInfo.emoji} {roleInfo.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Role info */}
          <div className={`bg-gradient-to-r ${roleInfo.color} rounded-2xl p-4 mb-6 text-white`}>
            <p className="text-sm font-medium">{roleInfo.desc}</p>
          </div>

          {/* Edit form */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-orange-100">
            <h2 className="text-lg font-bold text-stone-800 mb-5 border-b border-orange-100 pb-3">Edit Profile</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-stone-400" size={16} />
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                    className="w-full pl-9 pr-4 py-2.5 border-2 border-stone-200 rounded-2xl focus:border-orange-400 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-stone-400" size={16} />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 9999 999999"
                    className="w-full pl-9 pr-4 py-2.5 border-2 border-stone-200 rounded-2xl focus:border-orange-400 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1">
                  <MapPin size={14} /> City (Maharashtra)
                </label>
                <select
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="w-full px-4 py-2.5 border-2 border-stone-200 rounded-2xl focus:border-orange-400 focus:outline-none text-sm bg-white appearance-none"
                >
                  <option value="">Select your city</option>
                  {MAHARASHTRA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {(user.role === 'ngo' || user.role === 'donor') && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1">
                    <Building2 size={14} /> {user.role === 'ngo' ? 'Organization Name' : 'Mandal / Group Name'}
                  </label>
                  <input
                    type="text"
                    value={form.organizationName}
                    onChange={e => setForm(f => ({ ...f, organizationName: e.target.value }))}
                    className="w-full px-4 py-2.5 border-2 border-stone-200 rounded-2xl focus:border-orange-400 focus:outline-none text-sm"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Quick links */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/map" className="bg-white rounded-2xl border border-orange-100 p-4 text-center hover:border-orange-300 transition-colors">
              <div className="text-2xl mb-1">🗺️</div>
              <div className="text-sm font-semibold text-stone-700">Live Map</div>
            </Link>
            {user.role === 'donor' && (
              <Link href="/post-bhandara" className="bg-white rounded-2xl border border-orange-100 p-4 text-center hover:border-orange-300 transition-colors">
                <div className="text-2xl mb-1">🍛</div>
                <div className="text-sm font-semibold text-stone-700">Post Bhandara</div>
              </Link>
            )}
            {user.role === 'ngo' && (
              <Link href="/dashboard" className="bg-white rounded-2xl border border-orange-100 p-4 text-center hover:border-orange-300 transition-colors">
                <div className="text-2xl mb-1">🤝</div>
                <div className="text-sm font-semibold text-stone-700">NGO Dashboard</div>
              </Link>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
