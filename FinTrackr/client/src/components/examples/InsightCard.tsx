import InsightCard from '../InsightCard';
import { useState } from 'react';

const mockInsights = [
  {
    type: 'savings',
    color: 'green',
    icon: 'TrendingUp',
    title: 'Savings Analysis',
    message: 'Excellent! You\'re saving 25.3% of your income this month.'
  },
  {
    type: 'spending',
    color: 'red',
    icon: 'ShoppingBag',
    title: 'Spending Pattern',
    message: 'Your top spending is Food: $450 this month.'
  },
  {
    type: 'goals',
    color: 'purple',
    icon: 'Target',
    title: 'Goal Progress',
    message: 'Emergency Fund is 25.0% complete - keep it up!'
  }
];

export default function InsightCardExample() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex(prev => prev === 0 ? mockInsights.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % mockInsights.length);
  };

  return (
    <div className="p-4 max-w-md">
      <InsightCard
        insight={mockInsights[currentIndex]}
        currentIndex={currentIndex}
        totalInsights={mockInsights.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
}