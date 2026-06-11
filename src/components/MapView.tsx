'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { SCHEDULE, PHASES, MEETING_POINTS, AIRPORTS, ACCOMMODATIONS } from '@/lib/data';
import type { DayData, MeetingPoint, Airport, Accommodation } from '@/lib/types';

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

// Camino 도보 segment 는 Google Directions API (walking mode) 로 실제 경로 fetch.
// 직선 거리 대비 walking 거리 비율이 너무 크면 (페리 등) 점선 fallback.
const WALKING_MAX_METERS = 50000;
const dashedIcon = {
  icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 2 },
  offset: '0',
  repeat: '10px',
};
const flightDashIcon = {
  icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 },
  offset: '0',
  repeat: '12px',
};

function PolylineRenderer({ days }: { days: DayData[] }) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map || !routesLib) return;

    polylinesRef.current.forEach((pl) => pl.setMap(null));
    polylinesRef.current = [];

    const directionsService = new routesLib.DirectionsService();
    let cancelled = false;

    const drawStraight = (
      path: { lat: number; lng: number }[],
      color: string,
      style: 'solid' | 'dashed' | 'flight',
    ) => {
      const polyline = new google.maps.Polyline({
        path,
        strokeColor: color,
        strokeOpacity: style === 'solid' ? 0.9 : 0,
        strokeWeight: style === 'solid' ? 5 : 3,
        geodesic: true,
        map,
        icons: style === 'flight' ? [flightDashIcon] : style === 'dashed' ? [dashedIcon] : undefined,
      });
      polylinesRef.current.push(polyline);
    };

    const drawWalkingSegment = async (
      origin: { lat: number; lng: number },
      destination: { lat: number; lng: number },
      color: string,
    ) => {
      try {
        const result = await directionsService.route({
          origin,
          destination,
          travelMode: google.maps.TravelMode.WALKING,
        });
        if (cancelled) return;
        const route = result.routes[0];
        const path = route?.overview_path;
        const distanceMeters = route?.legs?.[0]?.distance?.value ?? Infinity;
        if (path && path.length > 0 && distanceMeters < WALKING_MAX_METERS) {
          const polyline = new google.maps.Polyline({
            path,
            strokeColor: color,
            strokeOpacity: 0.9,
            strokeWeight: 5,
            map,
          });
          polylinesRef.current.push(polyline);
          return;
        }
      } catch {
        // fall through to dashed fallback
      }
      if (!cancelled) drawStraight([origin, destination], color, 'dashed');
    };

    const run = async () => {
      const groups = getPhaseGroups(days);
      for (const group of groups) {
        if (cancelled) return;
        const isFlight = group.phase === 'london' || group.phase === 'paris';
        const isWalking = group.phase === 'camino';

        if (isWalking && group.coords.length >= 2) {
          for (let i = 0; i < group.coords.length - 1; i++) {
            if (cancelled) return;
            await drawWalkingSegment(group.coords[i], group.coords[i + 1], group.color);
          }
        } else {
          drawStraight(group.coords, group.color, isFlight ? 'flight' : 'solid');
        }
      }
    };

    run();

    return () => {
      cancelled = true;
      polylinesRef.current.forEach((pl) => pl.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, routesLib, days]);

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
  const [selectedHotel, setSelectedHotel] = useState<Accommodation | null>(null);

  const displayDays = useMemo(() => buildDisplayDays(), []);
  const bookedHotels = useMemo(
    () => ACCOMMODATIONS.filter((a): a is Accommodation & { booked: NonNullable<Accommodation['booked']> } => !!a.booked),
    []
  );

  const clearAll = () => {
    setSelectedDay(null);
    setSelectedMeeting(null);
    setSelectedAirport(null);
    setSelectedHotel(null);
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

  const handleHotelClick = useCallback((h: Accommodation) => {
    clearAll();
    setSelectedHotel(h);
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
          마커 클릭 → 상세 (🏨/🛏️ = 예약 호텔, 숫자 = 일정)
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

            {/* Confirmed hotel markers — booked accommodations */}
            {bookedHotels.map((h, i) => (
              <AdvancedMarker
                key={`hotel-${i}`}
                position={{ lat: h.booked.lat, lng: h.booked.lng }}
                onClick={() => handleHotelClick(h)}
                title={`✅ ${h.name} (${h.booked.dates})`}
              >
                <span className={`hotel-marker ${h.phase}`} style={{
                  fontSize: '18px',
                  background: PHASES[h.phase]?.color ?? '#666',
                  color: '#fff',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }}>{h.emoji}</span>
              </AdvancedMarker>
            ))}

            {selectedHotel?.booked && (
              <InfoWindow
                position={{ lat: selectedHotel.booked.lat, lng: selectedHotel.booked.lng }}
                onCloseClick={() => setSelectedHotel(null)}
                pixelOffset={[0, -28]}
              >
                <div className="map-info-window">
                  <h3>✅ {selectedHotel.emoji} {selectedHotel.name}</h3>
                  <p style={{ color: '#888', fontSize: '0.78rem', fontWeight: 600 }}>
                    📅 {selectedHotel.booked.dates} · {selectedHotel.booked.nights}박 · {selectedHotel.booked.pax}명
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#333' }}>
                    📍 {selectedHotel.booked.address}
                  </p>
                  <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#16A34A' }}>
                    💰 {selectedHotel.price}
                  </p>
                  {selectedHotel.breakfast && (
                    <p style={{ fontSize: '0.85rem', color: '#444' }}>
                      🥐 {selectedHotel.breakfast.status === 'included' && <strong style={{color:'#16A34A'}}>조식 포함</strong>}
                      {selectedHotel.breakfast.status === 'paid' && <strong style={{color:'#EA580C'}}>조식 유료{selectedHotel.breakfast.price ? ` (${selectedHotel.breakfast.price})` : ''}</strong>}
                      {selectedHotel.breakfast.status === 'none' && <strong style={{color:'#888'}}>조식 미제공</strong>}
                      {selectedHotel.breakfast.note && <span style={{color:'#666'}}> · {selectedHotel.breakfast.note}</span>}
                    </p>
                  )}
                  {selectedHotel.booked.bookingRef && (
                    <p style={{ fontSize: '0.8rem', color: '#666' }}>
                      🎫 예약번호: <code>{selectedHotel.booked.bookingRef}</code>
                    </p>
                  )}
                  <p style={{ fontSize: '0.82rem', color: '#444', marginTop: 6 }}>
                    {selectedHotel.desc}
                  </p>
                </div>
              </InfoWindow>
            )}

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
