'use client';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const STATS = [
  { value: '10,000+', label: 'Meals Shared', emoji: '🍛', color: 'from-orange-400 to-red-500' },
  { value: '200+', label: 'Bhandaras Posted', emoji: '🪔', color: 'from-amber-400 to-orange-500' },
  { value: '50+', label: 'NGOs Connected', emoji: '🤝', color: 'from-green-400 to-emerald-500' },
  { value: '25+', label: 'Cities in Maharashtra', emoji: '🗺️', color: 'from-blue-400 to-cyan-500' },
];

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl mb-2">{stat.emoji}</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{stat.value}</div>
              <div className="text-orange-100 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
