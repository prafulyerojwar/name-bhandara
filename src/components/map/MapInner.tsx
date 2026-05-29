'use client';
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bhandara } from '@/types';
import { formatDateTime, getTimeRemaining } from '@/lib/utils';
import Link from 'next/link';

// Fix leaflet default icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const TYPE_EMOJI: Record<string, string> = {
  festival: '🐘', temple: '🛕', wedding: '💒', private: '🏠', other: '🎉',
};

function createBhandaraIcon(type: string, isPublic: boolean) {
  const emoji = TYPE_EMOJI[type] || '🍛';
  const bg = isPublic ? '#f97316' : '#3b82f6';
  return L.divIcon({
    html: `
      <div style="
        width:48px; height:52px;
        display:flex; flex-direction:column;
        align-items:center; justify-content:center;
        position:relative;
      ">
        <div style="
          width:42px; height:42px;
          background:${bg};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          display:flex; align-items:center; justify-content:center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 3px solid white;
        ">
          <span style="transform:rotate(45deg); font-size:20px; line-height:1;">${emoji}</span>
        </div>
      </div>
    `,
    className: '',
    iconSize: [48, 52],
    iconAnchor: [24, 52],
    popupAnchor: [0, -54],
  });
}

function FlyToSelected({ bhandaras, selectedId }: { bhandaras: Bhandara[]; selectedId?: string }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const b = bhandaras.find(b => b.id === selectedId);
    if (b) map.flyTo([b.lat, b.lng], 15, { duration: 1 });
  }, [selectedId, bhandaras, map]);
  return null;
}

interface Props {
  bhandaras: Bhandara[];
  selectedId?: string;
  onSelect?: (b: Bhandara) => void;
}

// Maharashtra center
const MH_CENTER: [number, number] = [19.7515, 75.7139];

export default function MapInner({ bhandaras, selectedId, onSelect }: Props) {
  return (
    <MapContainer
      center={MH_CENTER}
      zoom={7}
      style={{ height: '100%', width: '100%' }}
      className="rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected bhandaras={bhandaras} selectedId={selectedId} />
      {bhandaras.map((b) => (
        <Marker
          key={b.id}
          position={[b.lat, b.lng]}
          icon={createBhandaraIcon(b.type, b.isPublic)}
          eventHandlers={{ click: () => onSelect?.(b) }}
        >
          <Popup maxWidth={280} className="bhandara-popup">
            <div className="font-sans p-1">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-2xl">{TYPE_EMOJI[b.type] || '🍛'}</span>
                <div>
                  <h3 className="font-bold text-sm text-gray-800 leading-tight">{b.title}</h3>
                  <p className="text-xs text-gray-500">{b.donorName}</p>
                </div>
              </div>
              <div className="text-xs text-gray-600 mb-1">
                📍 {b.address}, {b.city}
              </div>
              <div className="text-xs text-gray-600 mb-2">
                ⏰ Till {formatDateTime(b.availableTill)}
                <span className="ml-1 text-green-600 font-medium">({getTimeRemaining(b.availableTill)})</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {b.foodItems.slice(0, 2).map(f => (
                  <span key={f.name} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-100">
                    {f.isVeg ? '🟢' : '🔴'} {f.name}
                  </span>
                ))}
              </div>
              <div className="text-xs font-semibold text-orange-600 mt-1">
                👥 {b.servings} servings • {b.isPublic ? '✅ Open to all' : '🔒 NGO only'}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
