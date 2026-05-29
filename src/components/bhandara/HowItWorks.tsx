'use client';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const STEPS = [
  {
    step: '01',
    emoji: '🍛',
    title: 'Donor Posts Bhandara',
    desc: 'Temple, Mandal, wedding organizer posts food details — type, quantity, location and time on the map.',
    color: 'from-orange-400 to-red-400',
    role: 'For Donors',
  },
  {
    step: '02',
    emoji: '🗺️',
    title: 'Live Map Shows Locations',
    desc: 'All public Bhandaras show on the map instantly. Festival food visible to everyone. Private food visible to NGOs only.',
    color: 'from-amber-400 to-orange-400',
    role: 'For Everyone',
  },
  {
    step: '03',
    emoji: '🤝',
    title: 'NGO Books & Collects',
    desc: 'Registered NGOs see private food posts, book available food, track location and collect before it expires.',
    color: 'from-green-400 to-teal-400',
    role: 'For NGOs',
  },
  {
    step: '04',
    emoji: '🙏',
    title: 'Needy People Benefit',
    desc: 'NGOs distribute collected food to homeless, poor families, and other people in need across the city.',
    color: 'from-purple-400 to-pink-400',
    role: 'For Community',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-semibold mb-4">
            🪔 How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mb-4">
            Simple. Fast. <span className="gradient-text">Impactful.</span>
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto">
            From Bhandara post to food collection in minutes. Zero waste, maximum seva.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative bg-gradient-to-b from-orange-50 to-white rounded-3xl p-6 border border-orange-100 card-hover"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-3xl shadow-lg mb-4`}>
                {step.emoji}
              </div>
              <div className="text-xs font-bold text-orange-400 mb-1">{step.role}</div>
              <div className="text-4xl font-black text-stone-100 absolute top-4 right-4">{step.step}</div>
              <h3 className="text-base font-bold text-stone-800 mb-2">{step.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
