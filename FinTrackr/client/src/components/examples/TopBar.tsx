import TopBar from '../TopBar';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function TopBarExample() {
  return (
    <div className="space-y-4">
      <TopBar title="Dashboard" />
      
      <TopBar 
        title="Goals" 
        showAddButton 
        onAddClick={() => console.log('Add goal clicked')} 
      />
      
      <TopBar 
        title="Settings" 
        rightContent={
          <Button variant="ghost" size="icon">
            <User size={16} />
          </Button>
        } 
      />
    </div>
  );
}