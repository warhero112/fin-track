import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface GoalForm {
  id?: string;
  name: string;
  target: string;
  color: string;
}

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: GoalForm) => void;
  initialData?: GoalForm;
  title?: string;
}

const colorOptions = [
  "#007aff", "#34c759", "#ff9500", "#ff3b30", "#af52de", "#ff2d92"
];

export default function GoalModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  title = "Add Goal"
}: GoalModalProps) {
  const [form, setForm] = useState<GoalForm>({
    name: "",
    target: "",
    color: "#007aff"
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        name: "",
        target: "",
        color: "#007aff"
      });
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!form.name || !form.target) {
      alert("Please fill in all required fields");
      return;
    }

    const target = parseFloat(form.target);
    if (isNaN(target) || target <= 0) {
      alert("Please enter a valid target amount");
      return;
    }

    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center" data-testid="modal-goal">
      <Card className="w-full max-w-md mx-4 mb-4 max-h-[70vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle data-testid="text-modal-title">{title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-modal"
          >
            <X size={20} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Goal Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Emergency Fund"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              data-testid="input-goal-name"
            />
          </div>

          {/* Target Amount */}
          <div className="space-y-2">
            <Label htmlFor="target">Target Amount *</Label>
            <Input
              id="target"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={form.target}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setForm(prev => ({ ...prev, target: value }));
                }
              }}
              className="text-lg"
              data-testid="input-target-amount"
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-3 flex-wrap">
              {colorOptions.map(color => (
                <button
                  key={color}
                  onClick={() => setForm(prev => ({ ...prev, color }))}
                  className={`w-12 h-12 rounded-full border-4 transition-all ${
                    form.color === color ? 'border-foreground scale-110' : 'border-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  data-testid={`button-color-${color}`}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              data-testid="button-save"
            >
              {initialData?.id ? "Update" : "Create"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}