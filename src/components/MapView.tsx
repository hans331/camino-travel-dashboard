'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { SCHEDULE, PHASES } from '@/lib/data';
import type { DayData } from '@/lib/types';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const MAP_ID = 'travel-dashboard-map';

// Default center: roughly center of Spain/Portugal
const DEFAULT_CENTER = { lat: 40.0, lng: -4.0 };
const DEFAULT_ZOOM = 6;

// Group schedule by phase for polylines
function getPhaseGroups() {
  const groups: { phase: string; coords: { lat: number; lng: number }[] }[] = [];
  let currentPhase = '';
  let currentCoords: { lat: number; lng: number }[] = [];

  for (const day of SCHEDULE) {
    if (day.phase !== currentPhase) {
      if (currentCoords.length > 0) {
        groups.push({ phase: currentPhase, coords: [...currentCoords] });
      }
      currentPhase = day.phase;
      // Start new group but include last point of previous for continuity
      currentCoords = currentCoords.length > 0
        ? [currentCoords[currentCoords.length - 1], { lat: day.lat, lng: day.lng }]
        : [{ lat: day.lat, lng: day.lng }];
    } else {
      currentCoords.push({ lat: day.lat, lng: day.lng });
    }
  }
  if (currentCoords.length > 0) {
    groups.push({ phase: currentPhase, coords: currentCoords });
  }
  return groups;
}

function PolylineRenderer() {
  const map = useMap();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map) return;

    // Clean up old polylines
    polylinesRef.current.forEach((pl) => pl.setMap(null));
    polylinesRef.current = [];

    const groups = getPhaseGroups();
    for (const group of groups) {
      const phaseInfo = PHASES[group.phase as keyof typeof PHASES];
      if (!phaseInfo) continue;

      const polyline = new google.maps.Polyline({
        path: group.coords,
        strokeColor: phaseInfo.color,
        strokeOpacity: 0.7,
        strokeWeight: 3,
        geodesic: true,
        map,
      });
      polylinesRef.current.push(polyline);
    }

    return () => {
      polylinesRef.current.forEach((pl) => pl.setMap(null));
      polylinesRef.current = [];
    };
  }, [map]);

  return null;
}

interface FitBoundsProps {
  selectedPhase?: string | null;
}

function FitBounds({ selectedPhase }: FitBoundsProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    const days = selectedPhase
      ? SCHEDULE.filter((day) => day.phase === selectedPhase)
      : SCHEDULE;

    if (days.length === 0) return;

    for (const day of days) {
      bounds.extend({ lat: day.lat, lng: day.lng });
    }
    map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
  }, [map, selectedPhase]);

  return null;
}

interface MapViewProps {
  selectedPhase?: string | null;
}

export default function MapView({ selectedPhase }: MapViewProps) {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  const handleMarkerClick = useCallback((day: DayData) => {
    setSelectedDay(day);
  }, []);

  return (
    <div>
      <div className="section-header">
        <h2>🗺️ 여행 지도</h2>
        <p>25일 전체 루트</p>
      </div>

      <div className="map-container">
        <APIProvider apiKey={API_KEY}>
          <Map
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={DEFAULT_ZOOM}
            mapId={MAP_ID}
            gestureHandling="greedy"
            fullscreenControl={true}
            zoomControl={true}
            streetViewControl={false}
            mapTypeControl={false}
          >
            <FitBounds selectedPhase={selectedPhase} />
            <PolylineRenderer />

            {SCHEDULE.map((day) => {
              const phaseInfo = PHASES[day.phase];
              return (
                <AdvancedMarker
                  key={day.day}
                  position={{ lat: day.lat, lng: day.lng }}
                  onClick={() => handleMarkerClick(day)}
                  title={`Day ${day.day}: ${day.title}`}
                >
                  <span className="marker-emoji">{phaseInfo.emoji}</span>
                </AdvancedMarker>
              );
            })}

            {selectedDay && (
              <InfoWindow
                position={{ lat: selectedDay.lat, lng: selectedDay.lng }}
                onCloseClick={() => setSelectedDay(null)}
                pixelOffset={[0, -30]}
              >
                <div className="map-info-window">
                  <h3>
                    Day {selectedDay.day}: {selectedDay.icon} {selectedDay.title}
                  </h3>
                  <p style={{ color: '#666', fontSize: '0.75rem' }}>
                    {selectedDay.date}
                  </p>
                  <p>{selectedDay.desc}</p>
                  <p>
                    <strong>🍽️</strong> {selectedDay.food}
                  </p>
                  <p>
                    <strong>🏠</strong> {selectedDay.stay}
                  </p>
                  {selectedDay.restaurants && selectedDay.restaurants.length > 0 && (
                    <div className="info-restaurants">
                      {selectedDay.restaurants.map((r) => (
                        <span key={r} className="restaurant-tag">
                          📍 {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
