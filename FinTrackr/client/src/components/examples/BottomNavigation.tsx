import BottomNavigation from '../BottomNavigation';
import { useState } from 'react';

export default function BottomNavigationExample() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="h-screen bg-background relative">
      <div className="p-4">
        <p className="text-center text-muted-foreground">Active tab: {activeTab}</p>
      </div>
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onQuickAdd={() => console.log('Quick add triggered')}
      />
    </div>
  );
}