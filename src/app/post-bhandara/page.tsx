'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, MapPin, Clock, Users, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useAuthStore } from '@/store/authStore';
import { createBhandara } from '@/lib/firestore';
import { MAHARASHTRA_CITIES, FESTIVAL_NAMES, BhandaraType, FoodItem } from '@/types';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Maharashtra city coordinates
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Nagpur: { lat: 21.1458, lng: 79.0882 },
  Nashik: { lat: 19.9975, lng: 73.7898 },
  Aurangabad: { lat: 19.8762, lng: 75.3433 },
  Solapur: { lat: 17.6599, lng: 75.9064 },
  Kolhapur: { lat: 16.7050, lng: 74.2433 },
  Thane: { lat: 19.2183, lng: 72.9781 },
  'Navi Mumbai': { lat: 19.0330, lng: 73.0297 },
  Shirdi: { lat: 19.7664, lng: 74.4776 },
  Pandharpur: { lat: 17.6800, lng: 75.3300 },
  Sangli: { lat: 16.8524, lng: 74.5815 },
  Satara: { lat: 17.6868, lng: 74.0183 },
  Ahmednagar: { lat: 19.0952, lng: 74.7496 },
};

const FOOD_SUGGESTIONS = [
  'Rice', 'Dal', 'Sabzi', 'Roti', 'Puri', 'Khichdi', 'Biryani', 'Pulao',
  'Modak', 'Puran Poli', 'Kheer', 'Halwa', 'Shira', 'Panchamrit',
  'Poha', 'Upma', 'Idli', 'Dosa', 'Sambar', 'Chutney',
];

export default function PostBhandaraPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'festival' as BhandaraType,
    festivalName: '',
    isPublic: true,
    address: '',
    city: '',
    servings: 100,
    availableFrom: '',
    availableTill: '',
    donorPhone: '',
  });

  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    { name: '', quantity: '', isVeg: true },
  ]);

  function updateForm(k: keyof typeof form, v: unknown) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function addFood() {
    setFoodItems(f => [...f, { name: '', quantity: '', isVeg: true }]);
  }

  function removeFood(i: number) {
    setFoodItems(f => f.filter((_, idx) => idx !== i));
  }

  function updateFood(i: number, k: keyof FoodItem, v: string | boolean) {
    setFoodItems(f => f.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    if (foodItems.some(f => !f.name || !f.quantity)) {
      toast.error('Please fill all food items');
      return;
    }

    setLoading(true);
    try {
      const coords = CITY_COORDS[form.city] || { lat: 19.0760, lng: 72.8777 };
      const id = await createBhandara({
        title: form.title,
        description: form.description,
        type: form.type,
        donorId: user.uid,
        donorName: user.organizationName || user.displayName,
        donorPhone: form.donorPhone || user.phone,
        address: form.address,
        city: form.city,
        state: 'Maharashtra',
        lat: coords.lat,
        lng: coords.lng,
        foodItems,
        servings: form.servings,
        availableFrom: form.availableFrom ? new Date(form.availableFrom).getTime() : Date.now(),
        availableTill: form.availableTill ? new Date(form.availableTill).getTime() : Date.now() + 6 * 3600000,
        status: 'available',
        isPublic: form.isPublic,
        festivalName: form.festivalName || undefined,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      toast.success('Bhandara posted successfully! 🙏');
      router.push('/map');
    } catch (err) {
      console.error(err);
      toast.error('Failed to post. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-orange-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-float">🍛</div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Login Required</h2>
            <p className="text-stone-600 mb-6">Please login as a Food Donor to post a Bhandara</p>
            <Link href="/auth/login" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl">
              Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== 'donor') {
    return (
      <div className="min-h-screen bg-orange-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Donors Only</h2>
            <p className="text-stone-600 mb-6">Only Food Donors can post Bhandaras. Your role: <span className="font-semibold capitalize">{user.role}</span></p>
            <Link href="/" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-2 animate-float">🍛</div>
            <h1 className="text-3xl font-extrabold text-stone-900 mb-1">Post a Bhandara</h1>
            <p className="text-stone-600">Share food, spread blessings 🙏</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step > s ? 'bg-green-500 text-white' :
                  step === s ? 'bg-orange-500 text-white ring-4 ring-orange-200' :
                  'bg-stone-200 text-stone-500'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && <div className={`h-0.5 w-12 ${step > s ? 'bg-green-400' : 'bg-stone-200'}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-3xl shadow-lg p-6 border border-orange-100 space-y-5"
                >
                  <h2 className="text-lg font-bold text-stone-800 border-b border-orange-100 pb-3">
                    📋 Basic Details
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Bhandara Title *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => updateForm('title', e.target.value)}
                      required
                      placeholder="e.g. Ganesh Chaturthi Mahaprasad"
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-2xl focus:border-orange-400 focus:outline-none text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
                    <textarea
                      value={form.description}
                      onChange={e => updateForm('description', e.target.value)}
                      rows={3}
                      placeholder="Brief description of the Bhandara..."
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-2xl focus:border-orange-400 focus:outline-none text-sm transition-colors resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Type *</label>
                      <select
                        value={form.type}
                        onChange={e => updateForm('type', e.target.value as BhandaraType)}
                        className="w-full px-4 py-3 border-2 border-stone-200 rounded-2xl focus:border-orange-400 focus:outline-none text-sm bg-white appearance-none"
                      >
                        <option value="festival">🐘 Festival</option>
                        <option value="temple">🛕 Temple</option>
                        <option value="wedding">💒 Wedding</option>
                        <option value="private">🏠 Private</option>
                        <option value="other">🎉 Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Festival Name</label>
                      <select
                        value={form.festivalName}
                        onChange={e => updateForm('festivalName', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-stone-200 rounded-2xl focus:border-orange-400 focus:outline-none text-sm bg-white appearance-none"
                      >
                        <option value="">Select...</option>
                        {FESTIVAL_NAMES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Visibility toggle */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Visibility *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => updateForm('isPublic', true)}
                        className={`p-3 rounded-2xl border-2 transition-all text-left ${form.isPublic ? 'border-green-400 bg-green-50' : 'border-stone-200 hover:border-green-200'}`}
                      >
                        <div className="font-semibold text-sm text-stone-800 mb-0.5">✅ Public</div>
                        <div className="text-xs text-stone-500">Visible to all users on the map</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateForm('isPublic', false)}
                        className={`p-3 rounded-2xl border-2 transition-all text-left ${!form.isPublic ? 'border-blue-400 bg-blue-50' : 'border-stone-200 hover:border-blue-200'}`}
                      >
                        <div className="font-semibold text-sm text-stone-800 mb-0.5">🔒 NGO Only</div>
                        <div className="text-xs text-stone-500">Only NGOs & social orgs can see</div>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!form.title}
                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Next: Food Details →
                  </button>
                </motion.div>
              )}

              {/* Step 2: Food Items */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-3xl shadow-lg p-6 border border-orange-100 space-y-5"
                >
                  <h2 className="text-lg font-bold text-stone-800 border-b border-orange-100 pb-3">
                    🍛 Food Items
                  </h2>

                  <div className="space-y-3">
                    {foodItems.map((item, i) => (
                      <div key={i} className="flex gap-2 items-start p-3 bg-orange-50 rounded-2xl border border-orange-100">
                        <div className="flex-1 space-y-2">
                          <div className="flex gap-2">
                            <div className="flex-1 relative">
                              <input
                                list={`food-suggest-${i}`}
                                type="text"
                                value={item.name}
                                onChange={e => updateFood(i, 'name', e.target.value)}
                                required
                                placeholder="Food item name"
                                className="w-full px-3 py-2 border-2 border-stone-200 rounded-xl focus:border-orange-400 focus:outline-none text-sm bg-white"
                              />
                              <datalist id={`food-suggest-${i}`}>
                                {FOOD_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                              </datalist>
                            </div>
                            <input
                              type="text"
                              value={item.quantity}
                              onChange={e => updateFood(i, 'quantity', e.target.value)}
                              required
                              placeholder="Qty (e.g. 50 kg)"
                              className="w-28 px-3 py-2 border-2 border-stone-200 rounded-xl focus:border-orange-400 focus:outline-none text-sm bg-white"
                            />
                          </div>
                          <div className="flex gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" checked={item.isVeg} onChange={() => updateFood(i, 'isVeg', true)} className="accent-green-500" />
                              <span className="text-xs font-medium text-stone-700">🟢 Veg</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" checked={!item.isVeg} onChange={() => updateFood(i, 'isVeg', false)} className="accent-red-500" />
                              <span className="text-xs font-medium text-stone-700">🔴 Non-Veg</span>
                            </label>
                          </div>
                        </div>
                        {foodItems.length > 1 && (
                          <button type="button" onClick={() => removeFood(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors mt-1">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addFood}
                    className="w-full py-2.5 border-2 border-dashed border-orange-300 text-orange-600 rounded-2xl text-sm font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add More Food Item
                  </button>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1">
                      <Users size={14} /> Expected Servings *
                    </label>
                    <input
                      type="number"
                      value={form.servings}
                      onChange={e => updateForm('servings', parseInt(e.target.value) || 0)}
                      required
                      min={1}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-2xl focus:border-orange-400 focus:outline-none text-sm"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="px-5 py-3 rounded-2xl border-2 border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50">
                      ← Back
                    </button>
                    <button type="button" onClick={() => setStep(3)} disabled={foodItems.some(f => !f.name || !f.quantity)}
                      className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl disabled:opacity-50 hover:scale-[1.02] transition-all"
                    >
                      Next: Location & Time →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Location & Time */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-3xl shadow-lg p-6 border border-orange-100 space-y-5"
                >
                  <h2 className="text-lg font-bold text-stone-800 border-b border-orange-100 pb-3">
                    📍 Location & Timing
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1">
                      <MapPin size={14} /> Full Address *
                    </label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={e => updateForm('address', e.target.value)}
                      required
                      placeholder="Street, area, landmark..."
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-2xl focus:border-orange-400 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">City (Maharashtra) *</label>
                    <select
                      value={form.city}
                      onChange={e => updateForm('city', e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-2xl focus:border-orange-400 focus:outline-none text-sm bg-white appearance-none"
                    >
                      <option value="">Select city</option>
                      {MAHARASHTRA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1">
                        <Clock size={14} /> Available From
                      </label>
                      <input
                        type="datetime-local"
                        value={form.availableFrom}
                        onChange={e => updateForm('availableFrom', e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-stone-200 rounded-2xl focus:border-orange-400 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1">
                        <Clock size={14} /> Available Till *
                      </label>
                      <input
                        type="datetime-local"
                        value={form.availableTill}
                        onChange={e => updateForm('availableTill', e.target.value)}
                        required
                        className="w-full px-3 py-2.5 border-2 border-stone-200 rounded-2xl focus:border-orange-400 focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Contact Phone</label>
                    <input
                      type="tel"
                      value={form.donorPhone}
                      onChange={e => updateForm('donorPhone', e.target.value)}
                      placeholder="+91 9999 999999"
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-2xl focus:border-orange-400 focus:outline-none text-sm"
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200">
                    <h3 className="text-sm font-bold text-orange-700 mb-2">📋 Summary</h3>
                    <div className="text-xs text-stone-600 space-y-1">
                      <div>🏷️ <span className="font-medium">{form.title}</span></div>
                      <div>🍽️ {foodItems.filter(f => f.name).length} food items • {form.servings} servings</div>
                      <div>{form.isPublic ? '✅ Public Bhandara' : '🔒 NGO-only post'}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="px-5 py-3 rounded-2xl border-2 border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50">
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !form.address || !form.city || !form.availableTill}
                      className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] hover:shadow-lg transition-all"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : '🙏'}
                      {loading ? 'Posting...' : 'Post Bhandara'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
