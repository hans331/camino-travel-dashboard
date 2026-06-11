'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { SCHEDULE, PHASES, MEETING_POINTS, AIRPORTS, ACCOMMODATIONS } from '@/lib/data';
import type { DayData, MeetingPoint, Airport, Accommodation } from '@/lib/types';

// 실제 카미노 트레일 GeoJSON 파일 — pilgrimdb.github.io (해안) + OSM relation 12786090 (중앙)
const CAMINO_GEOJSON_URLS = [
  '/camino-routes/coastal-porto-caminha.geojson',
  '/camino-routes/aguarda-tui-miño.geojson',
  '/camino-routes/central-tui-santiago.geojson',
];

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

const flightDashIcon = {
  icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 },
  offset: '0',
  repeat: '12px',
};

type GeoJsonFeatureCollection = {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: { type: 'LineString'; coordinates: [number, number][] };
  }>;
};

function PolylineRenderer({ days }: { days: DayData[] }) {
  const map = useMap();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map) return;

    polylinesRef.current.forEach((pl) => pl.setMap(null));
    polylinesRef.current = [];
    let cancelled = false;

    const caminoColor = PHASES.camino?.color ?? '#16A34A';

    // 1. Camino phase 외 구간 (스위스·영국·프랑스·포르토 도시) 은 기존 직선 polyline
    const groups = getPhaseGroups(days);
    for (const group of groups) {
      if (group.phase === 'camino') continue;
      const isFlight = group.phase === 'london' || group.phase === 'paris';
      const polyline = new google.maps.Polyline({
        path: group.coords,
        strokeColor: group.color,
        strokeOpacity: isFlight ? 0 : 0.9,
        strokeWeight: 5,
        geodesic: true,
        map,
        icons: isFlight ? [flightDashIcon] : undefined,
      });
      polylinesRef.current.push(polyline);
    }

    // 2. Camino 트레일은 실제 GeoJSON 데이터 (pilgrimdb + OSM) 로 렌더
    Promise.all(
      CAMINO_GEOJSON_URLS.map((url) =>
        fetch(url)
          .then((r) => r.ok ? r.json() as Promise<GeoJsonFeatureCollection> : null)
          .catch(() => null),
      ),
    ).then((collections) => {
      if (cancelled) return;
      for (const fc of collections) {
        if (!fc) continue;
        for (const feature of fc.features) {
          const coords = feature.geometry.coordinates;
          if (!coords || coords.length < 2) continue;
          const path = coords.map(([lng, lat]) => ({ lat, lng }));
          const polyline = new google.maps.Polyline({
            path,
            strokeColor: caminoColor,
            strokeOpacity: 0.85,
            strokeWeight: 4,
            map,
          });
          polylinesRef.current.push(polyline);
        }
      }
    });

    return () => {
      cancelled = true;
      polylinesRef.current.forEach((pl) => pl.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, days]);

  return null;
}

// 모바일·데스크탑 위치 추적 — 사용자가 토글 활성화 시 현재 위치 마커 + 정확도 원
function UserLocationMarker({ enabled }: { enabled: boolean }) {
  const map = useMap();
  const [position, setPosition] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);

  useEffect(() => {
    if (!enabled) {
      setPosition(null);
      return;
    }
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled]);

  useEffect(() => {
    if (!map || !position) {
      circleRef.current?.setMap(null);
      circleRef.current = null;
      return;
    }
    if (!circleRef.current) {
      circleRef.current = new google.maps.Circle({
        map,
        center: { lat: position.lat, lng: position.lng },
        radius: position.accuracy,
        strokeColor: '#1E40AF',
        strokeOpacity: 0.4,
        strokeWeight: 1,
        fillColor: '#3B82F6',
        fillOpacity: 0.15,
      });
    } else {
      circleRef.current.setCenter({ lat: position.lat, lng: position.lng });
      circleRef.current.setRadius(position.accuracy);
    }
    return () => {
      circleRef.current?.setMap(null);
      circleRef.current = null;
    };
  }, [map, position]);

  if (!position) return null;
  return (
    <AdvancedMarker position={{ lat: position.lat, lng: position.lng }} title="📍 내 위치">
      <span style={{
        display: 'inline-block',
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: '#3B82F6',
        border: '3px solid #fff',
        boxShadow: '0 0 0 2px #1E40AF, 0 2px 6px rgba(0,0,0,0.4)',
      }} />
    </AdvancedMarker>
  );
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
  const [trackLocation, setTrackLocation] = useState(false);

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
          <div className="camino-route-info-desc">🌊 해안 4일 (Porto→Caminha) + 🛥️ 페리 + 🥾 강변 1일 (A Guarda→Tui) + 🌳 중앙 5일 (Tui→Santiago) · ~250km</div>
          <ul className="camino-route-info-highlights">
            <li>🌊 Day 1-4: 대서양 해안 (Vila do Conde, Esposende, Viana, Caminha)</li>
            <li>🛥️ Day 4 오후: Caminha 페리 → A Guarda 스페인 진입 (전날 횡단)</li>
            <li>🥾 Day 5: A Guarda → Tui 30km (미뉴 강변 Senda del Miño)</li>
            <li>🌳 Day 6-10: 중앙길 (Tui → Pontevedra → Padrón → Santiago)</li>
            <li>💪 Day 6 통합일 31km (Tui→Redondela, 새벽 출발)</li>
            <li>⭐ 해안의 시원함 + 강변 풍경 + 중앙길의 그늘 = 세 가지 장점</li>
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
        <button
          type="button"
          onClick={() => setTrackLocation((v) => !v)}
          style={{
            border: `2px solid ${trackLocation ? '#1E40AF' : '#cbd5e1'}`,
            background: trackLocation ? '#3B82F6' : '#fff',
            color: trackLocation ? '#fff' : '#1e293b',
            padding: '6px 12px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
          aria-pressed={trackLocation}
        >
          📍 {trackLocation ? '내 위치 표시 중' : '내 위치 보기'}
        </button>
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
            <UserLocationMarker enabled={trackLocation} />

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
