'use client';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Phone, CheckCircle, Lock } from 'lucide-react';
import { Bhandara } from '@/types';
import { formatDateTime, getTimeRemaining } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const TYPE_CONFIG: Record<string, { emoji: string; label: string; color: string }> = {
  festival: { emoji: '🐘', label: 'Festival', color: 'bg-orange-100 text-orange-700' },
  temple: { emoji: '🛕', label: 'Temple', color: 'bg-yellow-100 text-yellow-700' },
  wedding: { emoji: '💒', label: 'Wedding', color: 'bg-pink-100 text-pink-700' },
  private: { emoji: '🏠', label: 'Private', color: 'bg-blue-100 text-blue-700' },
  other: { emoji: '🎉', label: 'Other', color: 'bg-purple-100 text-purple-700' },
};

interface Props {
  bhandara: Bhandara;
  onBook?: (id: string) => void;
  showBookButton?: boolean;
  index?: number;
}

export default function BhandaraCard({ bhandara, onBook, showBookButton, index = 0 }: Props) {
  const cfg = TYPE_CONFIG[bhandara.type] || TYPE_CONFIG.other;
  const timeLeft = getTimeRemaining(bhandara.availableTill);
  const isBooked = bhandara.status === 'booked';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white rounded-3xl border border-orange-100 shadow-md overflow-hidden card-hover"
    >
      {/* Top stripe */}
      <div className={cn(
        'h-2',
        isBooked ? 'bg-stone-300' : 'bg-gradient-to-r from-orange-400 to-red-500'
      )} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{cfg.emoji}</span>
            <div>
              <h3 className="font-bold text-stone-800 text-base leading-tight">{bhandara.title}</h3>
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', cfg.color)}>
                {cfg.label}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {bhandara.isPublic ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium flex items-center gap-1">
                <CheckCircle size={10} /> Public
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium flex items-center gap-1">
                <Lock size={10} /> NGO Only
              </span>
            )}
            {isBooked && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                Booked
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {bhandara.description && (
          <p className="text-xs text-stone-500 mb-3 line-clamp-2">{bhandara.description}</p>
        )}

        {/* Food items */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {bhandara.foodItems.slice(0, 3).map((item) => (
            <span key={item.name} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 font-medium border border-orange-100">
              {item.isVeg ? '🟢' : '🔴'} {item.name} ({item.quantity})
            </span>
          ))}
          {bhandara.foodItems.length > 3 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-500">
              +{bhandara.foodItems.length - 3} more
            </span>
          )}
        </div>

        {/* Info row */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <MapPin size={12} className="text-orange-500 flex-shrink-0" />
            <span className="truncate">{bhandara.address}, {bhandara.city}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Clock size={12} className="text-orange-500 flex-shrink-0" />
            <span>Till {formatDateTime(bhandara.availableTill)}</span>
            <span className={cn(
              'ml-1 px-1.5 py-0.5 rounded text-xs font-medium',
              timeLeft === 'Expired' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
            )}>
              {timeLeft}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Users size={12} className="text-orange-500 flex-shrink-0" />
            <span>{bhandara.servings} servings • by {bhandara.donorName}</span>
          </div>
          {bhandara.donorPhone && (
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Phone size={12} className="text-orange-500 flex-shrink-0" />
              <span>{bhandara.donorPhone}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/map?id=${bhandara.id}`}
            className="flex-1 text-center py-2.5 rounded-xl bg-orange-50 text-orange-600 text-sm font-semibold hover:bg-orange-100 transition-colors"
          >
            📍 View on Map
          </Link>
          {showBookButton && !isBooked && onBook && (
            <button
              onClick={() => onBook(bhandara.id)}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              🤝 Book Now
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
