'use client';

import { useState, useCallback } from 'react';
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

export default function Home() {
  const [activeTab, setActiveTab] = useState('map');

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'map':
        return <MapView />;
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
        return <MapView />;
    }
  }, [activeTab]);

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}
