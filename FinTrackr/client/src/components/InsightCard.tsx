import { TrendingUp, ShoppingBag, Target, Calendar, DollarSign, BarChart3, Lightbulb, ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Insight {
  type: string;
  color: string;
  icon: string;
  title: string;
  message: string;
}

interface InsightCardProps {
  insight: Insight;
  currentIndex: number;
  totalInsights: number;
  onPrevious: () => void;
  onNext: () => void;
}

const getIconComponent = (iconName: string) => {
  const icons = { TrendingUp, ShoppingBag, Target, Calendar, DollarSign, BarChart3, Lightbulb };
  return icons[iconName as keyof typeof icons] || Lightbulb;
};

const getColorClasses = (color: string) => {
  const colorMap = {
    green: 'bg-chart-1/10 text-chart-1',
    blue: 'bg-primary/10 text-primary',
    red: 'bg-chart-2/10 text-chart-2',
    orange: 'bg-chart-4/10 text-chart-4',
    purple: 'bg-chart-3/10 text-chart-3',
    indigo: 'bg-chart-5/10 text-chart-5'
  };
  return colorMap[color as keyof typeof colorMap] || 'bg-muted text-muted-foreground';
};

export default function InsightCard({ 
  insight, 
  currentIndex, 
  totalInsights, 
  onPrevious, 
  onNext 
}: InsightCardProps) {
  const IconComponent = getIconComponent(insight.icon);

  return (
    <Card data-testid="card-insight">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-chart-4" />
            <h3 className="text-lg font-semibold">Smart Insights</h3>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalInsights }, (_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className={`p-4 rounded-lg ${getColorClasses(insight.color)}`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <IconComponent size={20} />
              </div>
              <div>
                <h4 className="font-semibold mb-1" data-testid="text-insight-title">{insight.title}</h4>
                <p className="text-sm opacity-90" data-testid="text-insight-message">{insight.message}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              className="h-8 w-8"
              data-testid="button-insight-previous"
            >
              <ChevronLeft size={20} />
            </Button>
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} of {totalInsights}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              className="h-8 w-8"
              data-testid="button-insight-next"
            >
              <ChevronLeft size={20} className="rotate-180" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}