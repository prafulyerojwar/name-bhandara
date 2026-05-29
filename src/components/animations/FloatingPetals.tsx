'use client';
import { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  emoji: string;
}

const EMOJIS = ['🌸', '🌺', '🌼', '🪷', '🌻'];

export default function FloatingPetals({ count = 8 }: { count?: number }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const items: Petal[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 4,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    }));
    setPetals(items);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute text-2xl opacity-30"
          style={{
            left: `${p.left}%`,
            top: '-40px',
            animationName: 'petal-fall',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
