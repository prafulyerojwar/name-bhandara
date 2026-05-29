'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bhandara } from '@/types';
import BhandaraCard from './BhandaraCard';

const DEMO_BHANDARAS: Bhandara[] = [
  {
    id: 'demo1',
    title: 'Ganesh Chaturthi Mahaprasad',
    description: 'Shree Ganesh Mandal presents grand Bhandara for Ganpati festival. Everyone welcome!',
    type: 'festival',
    donorId: 'demo',
    donorName: 'Kasba Ganesh Mandal',
    donorPhone: '+91 98765 43210',
    address: 'Kasba Peth',
    city: 'Pune',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    foodItems: [
      { name: 'Modak', quantity: '500 pcs', isVeg: true },
      { name: 'Puran Poli', quantity: '300 pcs', isVeg: true },
      { name: 'Kheer', quantity: '200 bowls', isVeg: true },
    ],
    servings: 1000,
    availableFrom: Date.now(),
    availableTill: Date.now() + 5 * 60 * 60 * 1000,
    status: 'available',
    isPublic: true,
    festivalName: 'Ganesh Chaturthi',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'demo2',
    title: 'Wedding Reception Leftover Food',
    description: 'Fresh catered food from wedding ceremony available for NGOs to collect.',
    type: 'wedding',
    donorId: 'demo',
    donorName: 'Sharma Family',
    address: 'Hotel Radisson, Andheri',
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.1136,
    lng: 72.8697,
    foodItems: [
      { name: 'Biryani', quantity: '50 kg', isVeg: false },
      { name: 'Paneer Sabzi', quantity: '20 kg', isVeg: true },
      { name: 'Dal Makhani', quantity: '15 kg', isVeg: true },
    ],
    servings: 200,
    availableFrom: Date.now(),
    availableTill: Date.now() + 3 * 60 * 60 * 1000,
    status: 'available',
    isPublic: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'demo3',
    title: 'Shirdi Sai Temple Prasadam',
    description: 'Daily Sai Baba temple prasadam distribution. Simple & nutritious.',
    type: 'temple',
    donorId: 'demo',
    donorName: 'Sai Mandir Trust',
    donorPhone: '+91 94567 89012',
    address: 'Sai Baba Mandir, Shirdi',
    city: 'Shirdi',
    state: 'Maharashtra',
    lat: 19.7664,
    lng: 74.4776,
    foodItems: [
      { name: 'Prasad Rice', quantity: '100 kg', isVeg: true },
      { name: 'Dal', quantity: '50 kg', isVeg: true },
    ],
    servings: 500,
    availableFrom: Date.now(),
    availableTill: Date.now() + 4 * 60 * 60 * 1000,
    status: 'available',
    isPublic: true,
    festivalName: 'Temple Prasadam',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export default function FeaturedBhandaras() {
  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-semibold mb-4">
            🍛 Live Bhandaras
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mb-4">
            Currently Active <span className="gradient-text">Bhandaras</span>
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto">
            Sample bhandaras across Maharashtra. Sign up to see live data in your area.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {DEMO_BHANDARAS.map((b, i) => (
            <BhandaraCard key={b.id} bhandara={b} index={i} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            🗺️ View All on Live Map
          </Link>
        </div>
      </div>
    </section>
  );
}
