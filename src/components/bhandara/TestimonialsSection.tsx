'use client';
import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    name: 'Ramesh Patil',
    role: 'Ganesh Mandal Organizer, Pune',
    emoji: '🐘',
    text: 'After Ganesh festival, we always had leftover prasadam. Now we post on Nam Bhandara and NGOs collect it within 30 minutes. Absolutely blessed!',
    city: 'Pune',
  },
  {
    name: 'Sunita Desai',
    role: 'Director, Asha NGO, Mumbai',
    emoji: '🤝',
    text: 'We used to struggle finding food donations. Nam Bhandara changed everything. We now feed 200 people daily using food we find on the app.',
    city: 'Mumbai',
  },
  {
    name: 'Vijay Kulkarni',
    role: 'Wedding Caterer, Nagpur',
    emoji: '💒',
    text: 'Earlier we would throw away 50kg of wedding food. Now I post it on Nam Bhandara and NGOs pick it up. Zero waste and lots of blessings!',
    city: 'Nagpur',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-semibold mb-4">
            🙏 Community Stories
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mb-4">
            Real People, <span className="gradient-text">Real Impact</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-b from-orange-50 to-white rounded-3xl p-6 border border-orange-100 card-hover"
            >
              <div className="text-4xl mb-4">{t.emoji}</div>
              <p className="text-stone-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
              <div>
                <div className="font-bold text-stone-800 text-sm">{t.name}</div>
                <div className="text-xs text-orange-600 mt-0.5">{t.role}</div>
              </div>
              <div className="flex text-orange-400 mt-3 text-sm">{'★★★★★'}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
