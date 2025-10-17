import GoalCard from '../GoalCard';

const mockGoal = {
  id: "g1",
  name: "Emergency Fund",
  current: 2500,
  target: 10000,
  color: "#34c759"
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export default function GoalCardExample() {
  return (
    <div className="p-4 max-w-md">
      <GoalCard
        goal={mockGoal}
        onFund={(goal) => console.log('Fund goal:', goal)}
        onDelete={(id) => console.log('Delete goal:', id)}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}