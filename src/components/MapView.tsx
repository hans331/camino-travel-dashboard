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

const DEFAULT_CENTER = { lat: 45.0, lng: -4.0 };
const DEFAULT_ZOOM = 5;

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

    polylinesRef.current.forEach((pl) => pl.setMap(null));
    polylinesRef.current = [];

    const groups = getPhaseGroups();
    for (const group of groups) {
      const phaseInfo = PHASES[group.phase as keyof typeof PHASES];
      if (!phaseInfo) continue;

      // Dashed line for flight/train transitions (london = SCQ→LHR flight, paris = Eurostar/flight)
      const isFlight = group.phase === 'london' || group.phase === 'paris';
      const polyline = new google.maps.Polyline({
        path: group.coords,
        strokeColor: phaseInfo.color,
        strokeOpacity: isFlight ? 0 : 0.85,
        strokeWeight: 4,
        geodesic: true,
        map,
        icons: isFlight
          ? [{
              icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 },
              offset: '0',
              repeat: '12px',
            }]
          : undefined,
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
    map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
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
        <h2><span>🗺️</span> 여행 지도</h2>
        <p>포르토 → 카미노 → 산티아고 → 런던·캠브리지 → 파리·베르사유 · 21일 전체 루트</p>
      </div>

      <div className="map-legend">
        {Object.entries(PHASES).map(([key, info]) => (
          <div key={key} className="legend-item">
            <span className="legend-dot" style={{ background: info.color }} />
            <span>{info.emoji} {info.label}</span>
          </div>
        ))}
        <div className="legend-item" style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontWeight: 500 }}>
          마커를 클릭하면 일정 상세
        </div>
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
                  <span className={`day-marker ${day.phase}`}>
                    <span className="marker-emoji">{day.icon}</span>
                    {day.day}
                  </span>
                </AdvancedMarker>
              );
            })}

            {selectedDay && (
              <InfoWindow
                position={{ lat: selectedDay.lat, lng: selectedDay.lng }}
                onCloseClick={() => setSelectedDay(null)}
                pixelOffset={[0, -36]}
              >
                <div className="map-info-window">
                  <h3>
                    Day {selectedDay.day} · {selectedDay.icon} {selectedDay.title}
                  </h3>
                  <p style={{ color: '#888', fontSize: '0.78rem', fontWeight: 600 }}>
                    {selectedDay.date} {selectedDay.dist && `· ${selectedDay.dist}`}
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
