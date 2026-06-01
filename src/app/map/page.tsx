'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, MapPin, Search, X, RefreshCw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import BhandaraMap from '@/components/map/BhandaraMap';
import BhandaraCard from '@/components/bhandara/BhandaraCard';
import { Bhandara, MAHARASHTRA_CITIES, BhandaraType } from '@/types';
import { getPublicBhandaras, getPrivateBhandaras, updateBhandara, createBooking } from '@/lib/firestore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const TYPE_FILTERS: { value: BhandaraType | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '🍽️' },
  { value: 'festival', label: 'Festival', emoji: '🐘' },
  { value: 'temple', label: 'Temple', emoji: '🛕' },
  { value: 'wedding', label: 'Wedding', emoji: '💒' },
  { value: 'private', label: 'Private', emoji: '🏠' },
];

// Built lazily on the client — never at module load / SSR time
function buildDemo(): Bhandara[] {
  const now = Date.now();
  const h = (n: number) => now + n * 3_600_000;
  return [
    {
      id: 'd1', title: 'Ganesh Chaturthi Mahaprasad', description: 'Grand Bhandara by Kasba Ganesh Mandal',
      type: 'festival', donorId: 'demo', donorName: 'Kasba Ganesh Mandal', donorPhone: '+91 98765 43210',
      address: 'Kasba Peth', city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567,
      foodItems: [{ name: 'Modak', quantity: '500 pcs', isVeg: true }, { name: 'Kheer', quantity: '200 bowls', isVeg: true }],
      servings: 700, availableFrom: now, availableTill: h(5),
      status: 'available', isPublic: true, festivalName: 'Ganesh Chaturthi', createdAt: now, updatedAt: now,
    },
    {
      id: 'd2', title: 'Shirdi Sai Temple Prasadam', description: 'Daily prasadam distribution',
      type: 'temple', donorId: 'demo', donorName: 'Sai Mandir Trust', donorPhone: '+91 98001 23456',
      address: 'Shirdi Mandir', city: 'Shirdi', state: 'Maharashtra', lat: 19.7664, lng: 74.4776,
      foodItems: [{ name: 'Rice & Dal', quantity: '100 kg', isVeg: true }],
      servings: 400, availableFrom: now, availableTill: h(4),
      status: 'available', isPublic: true, festivalName: 'Temple Prasadam', createdAt: now, updatedAt: now,
    },
    {
      id: 'd3', title: 'Wedding Banquet Surplus', description: 'Fresh catered food from wedding reception',
      type: 'wedding', donorId: 'demo', donorName: 'Mehta Family',
      address: 'Hotel Grand, Bandra', city: 'Mumbai', state: 'Maharashtra', lat: 19.0596, lng: 72.8295,
      foodItems: [{ name: 'Biryani', quantity: '30 kg', isVeg: false }, { name: 'Paneer', quantity: '15 kg', isVeg: true }],
      servings: 150, availableFrom: now, availableTill: h(2),
      status: 'available', isPublic: false, createdAt: now, updatedAt: now,
    },
    {
      id: 'd4', title: 'Ram Navami Prasad Distribution', description: 'Ram Navami celebration food',
      type: 'festival', donorId: 'demo', donorName: 'Ram Mandir Nashik',
      address: 'Panchavati, Nashik', city: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898,
      foodItems: [{ name: 'Panchamrit', quantity: '300 cups', isVeg: true }, { name: 'Halwa', quantity: '100 kg', isVeg: true }],
      servings: 500, availableFrom: now, availableTill: h(6),
      status: 'available', isPublic: true, festivalName: 'Ram Navami', createdAt: now, updatedAt: now,
    },
    {
      id: 'd5', title: 'Pandharpur Vitthal Temple Prasad', description: 'Wari festival special prasadam',
      type: 'temple', donorId: 'demo', donorName: 'Vitthal Mandir Trust',
      address: 'Vitthal Mandir, Pandharpur', city: 'Pandharpur', state: 'Maharashtra', lat: 17.6800, lng: 75.3300,
      foodItems: [{ name: 'Varan Bhaat', quantity: '200 kg', isVeg: true }],
      servings: 1000, availableFrom: now, availableTill: h(8),
      status: 'available', isPublic: true, festivalName: 'Temple Prasadam', createdAt: now, updatedAt: now,
    },
  ];
}

export default function MapPage() {
  const { user } = useAuthStore();
  const [bhandaras, setBhandaras] = useState<Bhandara[]>([]);
  const [filtered, setFiltered] = useState<Bhandara[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [selectedBhandara, setSelectedBhandara] = useState<Bhandara | null>(null);
  const [city, setCity] = useState('');
  const [typeFilter, setTypeFilter] = useState<BhandaraType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(true);

  const loadBhandaras = useCallback(async () => {
    setLoading(true);
    try {
      const pub = await getPublicBhandaras(city || undefined);
      let all = [...pub];
      if (user?.role === 'ngo' || user?.role === 'donor') {
        const priv = await getPrivateBhandaras(city || undefined);
        all = [...pub, ...priv];
      }
      if (all.length === 0) {
        setBhandaras(buildDemo());
      } else {
        setBhandaras(all);
      }
    } catch {
      setBhandaras(buildDemo());
    }
    setLoading(false);
  }, [city, user]);

  useEffect(() => { loadBhandaras(); }, [loadBhandaras]);

  useEffect(() => {
    let result = bhandaras;
    if (typeFilter !== 'all') result = result.filter(b => b.type === typeFilter);
    if (search) result = result.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.city.toLowerCase().includes(search.toLowerCase()) ||
      b.donorName.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [bhandaras, typeFilter, search]);

  async function handleBook(id: string) {
    if (!user || user.role !== 'ngo') {
      toast.error('Only NGOs can book food');
      return;
    }
    try {
      await updateBhandara(id, { status: 'booked', bookedBy: user.uid, bookedByName: user.displayName, bookedAt: Date.now() });
      await createBooking({ bhandaraId: id, ngoId: user.uid, ngoName: user.displayName, status: 'confirmed', createdAt: Date.now() });
      toast.success('Food booked successfully! 🙏');
      loadBhandaras();
    } catch {
      toast.error('Failed to book');
    }
  }

  function handleSelect(b: Bhandara) {
    setSelectedId(b.id);
    setSelectedBhandara(b);
    setShowPanel(true);
  }

  return (
    <div className="flex flex-col h-screen bg-orange-50">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Left panel */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-80 bg-white border-r border-orange-200 flex flex-col overflow-hidden z-10 shadow-lg"
            >
              {/* Panel header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-4 text-white flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <MapPin size={18} /> Live Bhandaras
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <button onClick={loadBhandaras} className="p-1.5 rounded-full bg-orange-400 hover:bg-orange-300 transition-colors">
                      <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={() => setShowPanel(false)} className="p-1.5 rounded-full bg-orange-400 hover:bg-orange-300 transition-colors md:hidden">
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-2.5 text-orange-300" size={15} />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search bhandaras..."
                    className="w-full pl-9 pr-3 py-2 bg-orange-400 placeholder-orange-200 text-white rounded-xl text-sm focus:outline-none focus:bg-orange-300 transition-colors"
                  />
                </div>

                {/* City filter */}
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-orange-400 text-white rounded-xl text-sm focus:outline-none appearance-none"
                >
                  <option value="">All Maharashtra Cities</option>
                  {MAHARASHTRA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Type filters */}
              <div className="px-4 py-3 border-b border-orange-100 flex-shrink-0 overflow-x-auto">
                <div className="flex gap-2">
                  {TYPE_FILTERS.map(f => (
                    <button
                      key={f.value}
                      onClick={() => setTypeFilter(f.value)}
                      className={cn(
                        'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                        typeFilter === f.value
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                      )}
                    >
                      {f.emoji} {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Count */}
              <div className="px-4 py-2 text-xs text-stone-500 flex-shrink-0">
                <span className="font-semibold text-orange-600">{filtered.length}</span> bhandaras found
                {user?.role === 'ngo' && <span className="ml-1 text-blue-600">• Including NGO-only posts</span>}
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-3">
                {loading && (
                  <div className="text-center py-8">
                    <div className="text-3xl animate-float">🍛</div>
                    <p className="text-sm text-stone-500 mt-2">Loading...</p>
                  </div>
                )}
                {!loading && filtered.length === 0 && (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="text-sm font-medium text-stone-700">No bhandaras found</p>
                    <p className="text-xs text-stone-500 mt-1">Try changing filters or city</p>
                  </div>
                )}
                {!loading && filtered.map((b, i) => (
                  <div
                    key={b.id}
                    onClick={() => handleSelect(b)}
                    className={cn('cursor-pointer rounded-2xl transition-all', selectedId === b.id ? 'ring-2 ring-orange-500' : '')}
                  >
                    <BhandaraCard
                      bhandara={b}
                      index={i}
                      showBookButton={user?.role === 'ngo'}
                      onBook={handleBook}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map area */}
        <div className="flex-1 relative">
          {!showPanel && (
            <button
              onClick={() => setShowPanel(true)}
              className="absolute top-4 left-4 z-10 bg-white shadow-lg rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors border border-orange-200"
            >
              <Filter size={16} /> Show List ({filtered.length})
            </button>
          )}

          <div className="p-3 h-full">
            <BhandaraMap
              bhandaras={filtered}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
