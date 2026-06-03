'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { SCHEDULE, PHASES, CAMINO_VARIANTS } from '@/lib/data';
import type { DayData } from '@/lib/types';

type CaminoRouteKey = 'central' | 'coastal' | 'hybrid';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const MAP_ID = 'travel-dashboard-map';

const DEFAULT_CENTER = { lat: 45.0, lng: -4.0 };
const DEFAULT_ZOOM = 5;

function buildDisplayDays(routeKey: CaminoRouteKey): DayData[] {
  const variant = CAMINO_VARIANTS[routeKey];
  const nonCamino = SCHEDULE.filter((d) => d.phase !== 'camino');
  const caminoDays: DayData[] = variant.stages.map((s) => ({
    day: s.day,
    date: s.date,
    phase: 'camino' as const,
    title: `${s.from} → ${s.to}`,
    icon: '🐚',
    desc: `🚶 ${s.km}km · ${variant.label} 루트${s.note ? ` · ${s.note}` : ''}`,
    food: variant.key === 'coastal' ? '해산물 · 풀포 · 알바리뇨' : variant.key === 'hybrid' && s.day <= 6 ? '해산물·시골 음식 혼합' : '시골 메뉴 · 알베르게 식사',
    stay: '알베르게 / 펜션',
    lat: s.lat,
    lng: s.lng,
    dist: `${s.km}km`,
  }));
  return [...nonCamino, ...caminoDays].sort((a, b) => a.day - b.day);
}

function getPhaseGroups(days: DayData[], variantColor: string) {
  const groups: { phase: string; color: string; coords: { lat: number; lng: number }[] }[] = [];
  let currentPhase = '';
  let currentCoords: { lat: number; lng: number }[] = [];

  for (const day of days) {
    if (day.phase !== currentPhase) {
      if (currentCoords.length > 0) {
        groups.push({
          phase: currentPhase,
          color: currentPhase === 'camino' ? variantColor : PHASES[currentPhase as keyof typeof PHASES]?.color ?? '#666',
          coords: [...currentCoords],
        });
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
    groups.push({
      phase: currentPhase,
      color: currentPhase === 'camino' ? variantColor : PHASES[currentPhase as keyof typeof PHASES]?.color ?? '#666',
      coords: currentCoords,
    });
  }
  return groups;
}

function PolylineRenderer({ days, variantColor }: { days: DayData[]; variantColor: string }) {
  const map = useMap();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map) return;

    polylinesRef.current.forEach((pl) => pl.setMap(null));
    polylinesRef.current = [];

    const groups = getPhaseGroups(days, variantColor);
    for (const group of groups) {
      const isFlight = group.phase === 'london' || group.phase === 'paris';
      const polyline = new google.maps.Polyline({
        path: group.coords,
        strokeColor: group.color,
        strokeOpacity: isFlight ? 0 : 0.9,
        strokeWeight: 5,
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
  }, [map, days, variantColor]);

  return null;
}

interface FitBoundsProps {
  days: DayData[];
  selectedPhase?: string | null;
}

function FitBounds({ days, selectedPhase }: FitBoundsProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    const filtered = selectedPhase
      ? days.filter((day) => day.phase === selectedPhase)
      : days;

    if (filtered.length === 0) return;

    for (const day of filtered) {
      bounds.extend({ lat: day.lat, lng: day.lng });
    }
    map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
  }, [map, days, selectedPhase]);

  return null;
}

interface MapViewProps {
  selectedPhase?: string | null;
}

export default function MapView({ selectedPhase }: MapViewProps) {
  const [caminoRoute, setCaminoRoute] = useState<CaminoRouteKey>('central');
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  const variant = CAMINO_VARIANTS[caminoRoute];
  const displayDays = useMemo(() => buildDisplayDays(caminoRoute), [caminoRoute]);

  const handleMarkerClick = useCallback((day: DayData) => {
    setSelectedDay(day);
  }, []);

  // Close info when route changes
  useEffect(() => {
    setSelectedDay(null);
  }, [caminoRoute]);

  return (
    <div>
      <div className="section-header">
        <h2><span>🗺️</span> 여행 지도</h2>
        <p>포르토 → 카미노 → 산티아고 → 런던·캠브리지(졸업식) → 파리·베르사유 → 인천 · 23일 전체 루트</p>
      </div>

      {/* Camino route variant selector */}
      <div className="camino-route-selector">
        <div className="camino-route-label">
          🐚 <strong>카미노 루트 선택</strong> — 지도에서 직접 비교해보세요
        </div>
        <div className="camino-route-tabs">
          {(['central', 'coastal', 'hybrid'] as CaminoRouteKey[]).map((key) => {
            const v = CAMINO_VARIANTS[key];
            const isActive = caminoRoute === key;
            return (
              <button
                key={key}
                className={`camino-route-tab ${isActive ? 'active' : ''}`}
                onClick={() => setCaminoRoute(key)}
                style={isActive ? { background: v.color, borderColor: v.color, color: '#fff' } : { borderColor: v.color }}
              >
                <span className="camino-route-tab-emoji">{v.emoji}</span>
                <span className="camino-route-tab-label">{v.label}</span>
                <span className="camino-route-tab-km" style={isActive ? { color: 'rgba(255,255,255,0.9)' } : { color: v.color }}>
                  {v.totalKm}km · {v.days}일
                </span>
              </button>
            );
          })}
        </div>

        <div className="camino-route-info" style={{ borderLeftColor: variant.color }}>
          <div className="camino-route-info-desc">{variant.emoji} {variant.desc}</div>
          <ul className="camino-route-info-highlights">
            {variant.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="map-legend">
        {Object.entries(PHASES).map(([key, info]) => {
          const isCamino = key === 'camino';
          const displayColor = isCamino ? variant.color : info.color;
          const displayLabel = isCamino ? `${variant.emoji} ${variant.label}` : `${info.emoji} ${info.label}`;
          return (
            <div key={key} className="legend-item">
              <span className="legend-dot" style={{ background: displayColor }} />
              <span>{displayLabel}</span>
            </div>
          );
        })}
        <div className="legend-item" style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontWeight: 500 }}>
          마커 클릭 → 일정 상세
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
            <FitBounds days={displayDays} selectedPhase={selectedPhase} />
            <PolylineRenderer days={displayDays} variantColor={variant.color} />

            {displayDays.map((day) => {
              const isCamino = day.phase === 'camino';
              const markerColor = isCamino ? variant.color : PHASES[day.phase].color;
              return (
                <AdvancedMarker
                  key={day.day}
                  position={{ lat: day.lat, lng: day.lng }}
                  onClick={() => handleMarkerClick(day)}
                  title={`Day ${day.day}: ${day.title}`}
                >
                  <span
                    className={`day-marker ${day.phase}`}
                    style={isCamino ? { background: markerColor } : undefined}
                  >
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
                  {selectedDay.food && (
                    <p>
                      <strong>🍽️</strong> {selectedDay.food}
                    </p>
                  )}
                  {selectedDay.stay && (
                    <p>
                      <strong>🏠</strong> {selectedDay.stay}
                    </p>
                  )}
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
