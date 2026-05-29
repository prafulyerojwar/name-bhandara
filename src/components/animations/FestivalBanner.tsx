'use client';
import { motion } from 'framer-motion';

const FESTIVALS = [
  '🐘 Ganesh Chaturthi', '🪔 Diwali', '🌸 Ram Navami', '🌺 Hanuman Jayanti',
  '💃 Navratri', '🎊 Durga Puja', '🎋 Makar Sankranti', '🙏 Temple Prasadam',
  '💒 Wedding Feast', '🌼 Gudi Padwa',
];

export default function FestivalBanner() {
  const doubled = [...FESTIVALS, ...FESTIVALS];
  return (
    <div className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 text-white py-2.5 overflow-hidden">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="flex gap-8 whitespace-nowrap"
      >
        {doubled.map((item, i) => (
          <span key={i} className="text-sm font-medium flex items-center gap-2">
            {item}
            <span className="text-orange-300 mx-1">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
