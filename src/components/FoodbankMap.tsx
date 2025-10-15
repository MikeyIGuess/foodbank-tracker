"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Foodbank } from '@/types/foodbank';

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface FoodbankMapProps {
  foodbanks: Foodbank[];
  userLocation?: { lat: number; lng: number };
  selectedId?: string;
  onSelectFoodbank: (id: string) => void;
}

export default function FoodbankMap({
  foodbanks,
  userLocation,
  selectedId,
  onSelectFoodbank,
}: FoodbankMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current).setView([37.7749, -122.4194], 12);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add user location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: '<div style="background: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapRef.current)
        .bindPopup('Your location');
    }

    // Add foodbank markers
    foodbanks.forEach((foodbank) => {
      const isSelected = foodbank.id === selectedId;
      
      const icon = L.divIcon({
        className: 'foodbank-marker',
        html: `<div style="background: ${isSelected ? '#ef4444' : '#10b981'}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 12px; color: white; font-weight: bold;">${foodbank.score || '?'}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      const marker = L.marker([foodbank.lat, foodbank.lng], { icon })
        .addTo(mapRef.current!)
        .bindPopup(`<strong>${foodbank.name}</strong><br/>${foodbank.address}`)
        .on('click', () => onSelectFoodbank(foodbank.id));

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (foodbanks.length > 0) {
      const bounds = L.latLngBounds(
        foodbanks.map((fb) => [fb.lat, fb.lng])
      );
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [foodbanks, userLocation, selectedId, onSelectFoodbank]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-border"
      role="application"
      aria-label="Map showing nearby foodbanks"
    />
  );
}