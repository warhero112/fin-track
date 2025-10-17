import StatCard from '../StatCard';
import { TrendingUp, BarChart3, Target, DollarSign } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 max-w-md">
      <StatCard
        title="Savings Rate"
        value="25.3%"
        icon={TrendingUp}
        color="success"
      />
      
      <StatCard
        title="Total Transactions"
        value="47"
        icon={BarChart3}
        color="primary"
      />
      
      <StatCard
        title="Budget Used"
        value="68.5%"
        subtitle="$1,250 left"
        icon={DollarSign}
        color="warning"
        progress={68.5}
      />
      
      <StatCard
        title="Goals"
        value="3"
        subtitle="2 on track"
        icon={Target}
        color="success"
      />
    </div>
  );
}