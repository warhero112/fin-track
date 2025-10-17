import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  color?: "primary" | "success" | "warning" | "danger";
  progress?: number;
}

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  success: "bg-chart-1/10 text-chart-1",
  warning: "bg-chart-4/10 text-chart-4",
  danger: "bg-chart-2/10 text-chart-2"
};

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = "primary",
  progress 
}: StatCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-4 text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-2xl font-bold text-foreground" data-testid={`text-stat-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </div>
        <div className="text-sm text-muted-foreground" data-testid={`text-stat-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {title}
        </div>
        {subtitle && (
          <div className="text-sm text-muted-foreground mt-1">
            {subtitle}
          </div>
        )}
        {progress !== undefined && (
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                color === "success" ? "bg-chart-1" :
                color === "warning" ? "bg-chart-4" :
                color === "danger" ? "bg-chart-2" : "bg-primary"
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}