'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { SCHEDULE, PHASES, MEETING_POINTS, AIRPORTS } from '@/lib/data';
import type { DayData, MeetingPoint, Airport } from '@/lib/types';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const MAP_ID = 'travel-dashboard-map';

const DEFAULT_CENTER = { lat: 45.0, lng: -4.0 };
const DEFAULT_ZOOM = 5;

// SCHEDULE에서 모든 일자 직접 사용 (CAMINO/SWISS variants 토글 제거됨)
function buildDisplayDays(): DayData[] {
  return SCHEDULE;
}

function getPhaseGroups(days: DayData[]) {
  const groups: { phase: string; color: string; coords: { lat: number; lng: number }[] }[] = [];
  let currentPhase = '';
  let currentCoords: { lat: number; lng: number }[] = [];

  const colorFor = (phase: string) => {
    return PHASES[phase as keyof typeof PHASES]?.color ?? '#666';
  };

  for (const day of days) {
    if (day.phase !== currentPhase) {
      if (currentCoords.length > 0) {
        groups.push({
          phase: currentPhase,
          color: colorFor(currentPhase),
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
      color: colorFor(currentPhase),
      coords: currentCoords,
    });
  }
  return groups;
}

function PolylineRenderer({ days }: { days: DayData[] }) {
  const map = useMap();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map) return;

    polylinesRef.current.forEach((pl) => pl.setMap(null));
    polylinesRef.current = [];

    const groups = getPhaseGroups(days);
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
  }, [map, days]);

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
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingPoint | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);

  const displayDays = useMemo(() => buildDisplayDays(), []);

  const clearAll = () => {
    setSelectedDay(null);
    setSelectedMeeting(null);
    setSelectedAirport(null);
  };

  const handleMarkerClick = useCallback((day: DayData) => {
    clearAll();
    setSelectedDay(day);
  }, []);

  const handleMeetingClick = useCallback((mp: MeetingPoint) => {
    clearAll();
    setSelectedMeeting(mp);
  }, []);

  const handleAirportClick = useCallback((ap: Airport) => {
    clearAll();
    setSelectedAirport(ap);
  }, []);

  return (
    <div>
      <div className="section-header">
        <h2><span>🗺️</span> 여행 지도</h2>
        <p>포르토(2일) → 카미노(10일) → 🇨🇭 스위스 6일 (🏔️ Lucerne + ⛰️ Matterhorn + 융프라우요호) → 캠브리지 → 파리(8일·MSM) → 인천 · 28일 (6/12~7/9)</p>
      </div>

      {/* Camino route info (Hybrid 확정) */}
      <div className="camino-route-selector">
        <div className="camino-route-label">
          🐚 <strong>카미노 10일 — 하이브리드 루트 (확정)</strong>
        </div>
        <div className="camino-route-info" style={{ borderLeftColor: PHASES.camino.color }}>
          <div className="camino-route-info-desc">🌊+🌳 해안 4일 (Porto→Caminha) + 🛥️ 페리 전환 + 🌳 중앙 5일 (Tui→Santiago) · 228km</div>
          <ul className="camino-route-info-highlights">
            <li>🌊 Day 1-4: 대서양 해안 (Vila do Conde, Esposende, Viana, Caminha)</li>
            <li>🛥️ Day 5: Caminha 페리 → A Guarda 스페인 진입 + 버스 → Tui</li>
            <li>🌳 Day 6-10: 중앙길 (Tui → Pontevedra → Padrón → Santiago)</li>
            <li>💪 Day 6 통합일 31km (Tui→Redondela, 새벽 출발)</li>
            <li>⭐ 해안의 시원함 + 중앙길의 그늘 = 양쪽 장점</li>
          </ul>
        </div>
      </div>

      {/* Swiss route info banner (single optimal route) */}
      <div className="camino-route-selector">
        <div className="camino-route-label">
          🇨🇭 <strong>스위스 6일 — 최적 통합 루트</strong>
        </div>
        <div className="camino-route-info" style={{ borderLeftColor: PHASES.swiss.color }}>
          <div className="camino-route-info-desc">⛰️ Lucerne · Pilatus · Zermatt · Matterhorn · Interlaken · 융프라우요호 — 스위스 알프스 핵심 모두 (Day 13-18)</div>
          <ul className="camino-route-info-highlights">
            <li>🏔️ Day 13-14 Lucerne: Mt. Pilatus Golden Round + 호수 + 카펠교</li>
            <li>⛰️ Day 15-16 Zermatt: Matterhorn (Gornergrat 3,089m) + Stellisee 호수 반영</li>
            <li>⛰️ Day 17-18 Interlaken: 융프라우요호 Top of Europe (3,454m) + Harder Kulm</li>
            <li>🚂 GoldenPass·파노라마 열차로 알프스 횡단</li>
          </ul>
        </div>
      </div>

      <div className="map-legend">
        {Object.entries(PHASES).map(([key, info]) => (
          <div key={key} className="legend-item">
            <span className="legend-dot" style={{ background: info.color }} />
            <span>{info.emoji} {info.label}</span>
          </div>
        ))}
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
            <PolylineRenderer days={displayDays} />

            {displayDays.map((day) => (
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
            ))}

            {/* Airport markers (excluding ZRH which uses meeting marker) */}
            {AIRPORTS.filter((ap) => ap.code !== 'ZRH').map((ap) => (
              <AdvancedMarker
                key={ap.code}
                position={{ lat: ap.lat, lng: ap.lng }}
                onClick={() => handleAirportClick(ap)}
                title={`${ap.code} · ${ap.name}`}
              >
                <span className={`airport-marker ${ap.isLayover ? 'layover' : ''}`}>
                  <span className="airport-emoji">✈</span>
                  <span className="airport-code">{ap.code}</span>
                </span>
              </AdvancedMarker>
            ))}

            {MEETING_POINTS.map((mp) => (
              <AdvancedMarker
                key={mp.id}
                position={{ lat: mp.lat, lng: mp.lng }}
                onClick={() => handleMeetingClick(mp)}
                title={mp.label}
              >
                <span className="meeting-marker">{mp.emoji}</span>
              </AdvancedMarker>
            ))}

            {selectedMeeting && (
              <InfoWindow
                position={{ lat: selectedMeeting.lat, lng: selectedMeeting.lng }}
                onCloseClick={() => setSelectedMeeting(null)}
                pixelOffset={[0, -28]}
              >
                <div className="map-info-window">
                  <h3>{selectedMeeting.label}</h3>
                  <p style={{ whiteSpace: 'pre-line', fontSize: '0.92rem', color: '#333' }}>
                    {selectedMeeting.desc}
                  </p>
                </div>
              </InfoWindow>
            )}

            {selectedAirport && (
              <InfoWindow
                position={{ lat: selectedAirport.lat, lng: selectedAirport.lng }}
                onCloseClick={() => setSelectedAirport(null)}
                pixelOffset={[0, -20]}
              >
                <div className="map-info-window">
                  <h3>✈️ {selectedAirport.code} · {selectedAirport.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>
                    📍 {selectedAirport.city} {selectedAirport.isLayover ? '(환승 공항)' : '(도착/출발)'}
                  </p>
                  <p style={{ fontSize: '0.88rem', color: '#333' }}>
                    {selectedAirport.role}
                  </p>
                </div>
              </InfoWindow>
            )}

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
