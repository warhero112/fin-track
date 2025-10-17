import { Button } from "@/components/ui/button";

interface TopBarProps {
  title: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
  rightContent?: React.ReactNode;
}

export default function TopBar({ title, showAddButton = false, onAddClick, rightContent }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4 bg-background border-b border-border sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-foreground" data-testid="text-page-title">{title}</h1>
      <div className="flex items-center gap-2">
        {showAddButton && (
          <Button
            onClick={onAddClick}
            size="sm"
            data-testid="button-add"
          >
            + Add
          </Button>
        )}
        {rightContent}
      </div>
    </div>
  );
}