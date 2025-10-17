import { Home, Target, BarChart3, Bot, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
  onQuickAdd: () => void;
}

const tabs = [
  { id: 0, icon: Home, label: "Dashboard" },
  { id: 1, icon: Target, label: "Goals" },
  { id: 2, icon: BarChart3, label: "Insights" },
  { id: 3, icon: Bot, label: "AI Advisor" },
  { id: 4, icon: Settings, label: "Settings" },
];

export default function BottomNavigation({ activeTab, onTabChange, onQuickAdd }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="mx-auto max-w-md flex justify-around items-center py-2 relative">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 py-2 px-3 h-auto ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground"
            }`}
            data-testid={`button-tab-${tab.label.toLowerCase().replace(' ', '-')}`}
          >
            <tab.icon size={16} />
            <span className="text-xs">{tab.label}</span>
          </Button>
        ))}

        <Button
          onClick={onQuickAdd}
          size="icon"
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full shadow-lg"
          data-testid="button-quick-add"
        >
          <Plus size={24} />
        </Button>
      </div>
    </div>
  );
}