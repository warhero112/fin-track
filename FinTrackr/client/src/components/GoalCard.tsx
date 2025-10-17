import { Target, Trash2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  color: string;
}

interface GoalCardProps {
  goal: Goal;
  onFund: (goal: Goal) => void;
  onDelete: (id: string) => void;
  formatCurrency: (amount: number) => string;
}

export default function GoalCard({ goal, onFund, onDelete, formatCurrency }: GoalCardProps) {
  const progress = (goal.current / goal.target) * 100;

  return (
    <Card className="hover-elevate" data-testid={`card-goal-${goal.id}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: goal.color + '20' }}
            >
              <Target className="w-6 h-6" style={{ color: goal.color }} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground" data-testid={`text-goal-name-${goal.id}`}>
                {goal.name}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid={`text-goal-progress-${goal.id}`}>
                {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-chart-1/10 border-chart-1/20 hover:bg-chart-1/20 text-chart-1"
              onClick={() => onFund(goal)}
              data-testid={`button-fund-goal-${goal.id}`}
            >
              <DollarSign size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(goal.id)}
              data-testid={`button-delete-goal-${goal.id}`}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={Math.min(progress, 100)} className="h-3" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{progress.toFixed(1)}% complete</span>
            <span className="font-medium" style={{ color: goal.color }}>
              {formatCurrency(goal.target - goal.current)} to go
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}