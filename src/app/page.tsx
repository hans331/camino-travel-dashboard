'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import Schedule from '@/components/Schedule';
import CaminoGuide from '@/components/CaminoGuide';
import TasteGrid from '@/components/TasteGrid';
import AccommodationList from '@/components/AccommodationList';
import BudgetTable from '@/components/BudgetTable';
import FlightsTransport from '@/components/FlightsTransport';
import Checklist from '@/components/Checklist';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const VALID_TABS = ['schedule', 'map', 'camino', 'taste', 'accommodation', 'budget', 'transport', 'checklist'];
const ACTIVE_TAB_KEY = 'camino-active-tab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  // Restore tab from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(ACTIVE_TAB_KEY);
    if (saved && VALID_TABS.includes(saved)) {
      setActiveTab(saved);
    }
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    localStorage.setItem(ACTIVE_TAB_KEY, tab);
    if (tab !== 'map') setSelectedPhase(null);
  }, []);

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'map':
        return <MapView selectedPhase={selectedPhase} />;
      case 'schedule':
        return <Schedule />;
      case 'camino':
        return <CaminoGuide />;
      case 'taste':
        return <TasteGrid />;
      case 'accommodation':
        return <AccommodationList />;
      case 'budget':
        return <BudgetTable />;
      case 'transport':
        return <FlightsTransport />;
      case 'checklist':
        return <Checklist />;
      default:
        return <MapView selectedPhase={selectedPhase} />;
    }
  }, [activeTab, selectedPhase]);

  return (
    <div className="app-layout">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onCollapsedChange={setSidebarCollapsed}
        onPhaseSelect={setSelectedPhase}
      />
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {renderContent()}
      </main>
    </div>
  );
}
