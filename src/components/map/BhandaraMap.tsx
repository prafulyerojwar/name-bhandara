'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Bhandara } from '@/types';

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-orange-50 rounded-2xl">
      <div className="text-center">
        <div className="text-5xl mb-3 animate-float">🗺️</div>
        <p className="text-orange-600 font-semibold">Loading Map...</p>
      </div>
    </div>
  ),
});

interface Props {
  bhandaras: Bhandara[];
  selectedId?: string;
  onSelect?: (b: Bhandara) => void;
}

export default function BhandaraMap({ bhandaras, selectedId, onSelect }: Props) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl border border-orange-200">
      <MapInner bhandaras={bhandaras} selectedId={selectedId} onSelect={onSelect} />
    </div>
  );
}
