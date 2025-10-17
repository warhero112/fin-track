import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { CATEGORIES } from "@shared/schema";

interface TransactionForm {
  id?: string;
  amount: string;
  label: string;
  category: string;
  type: "income" | "expense";
  date: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: TransactionForm) => void;
  initialData?: TransactionForm;
  title?: string;
}

export default function TransactionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  title = "Add Transaction"
}: TransactionModalProps) {
  const [form, setForm] = useState<TransactionForm>({
    amount: "",
    label: "",
    category: "Food",
    type: "expense",
    date: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        amount: "",
        label: "",
        category: "Food",
        type: "expense",
        date: new Date().toISOString().slice(0, 10)
      });
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!form.amount || !form.label) {
      alert("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center" data-testid="modal-transaction">
      <Card className="w-full max-w-md mx-4 mb-4 max-h-[90vh] overflow-y-auto">
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
          {/* Transaction Type Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-muted rounded-lg p-1">
            <Button
              variant={form.type === "expense" ? "default" : "ghost"}
              size="sm"
              onClick={() => setForm(prev => ({ ...prev, type: "expense" }))}
              className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground"
              data-testid="button-expense-type"
            >
              Expense
            </Button>
            <Button
              variant={form.type === "income" ? "default" : "ghost"}
              size="sm"
              onClick={() => setForm(prev => ({ ...prev, type: "income" }))}
              className="data-[state=active]:bg-chart-1 data-[state=active]:text-white"
              data-testid="button-income-type"
            >
              Income
            </Button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setForm(prev => ({ ...prev, amount: value }));
                }
              }}
              className="text-lg"
              data-testid="input-amount"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="label">Description *</Label>
            <Input
              id="label"
              placeholder="e.g., Coffee at Starbucks"
              value={form.label}
              onChange={(e) => setForm(prev => ({ ...prev, label: e.target.value }))}
              data-testid="input-description"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={form.category}
              onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger data-testid="select-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
              data-testid="input-date"
            />
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
              {initialData?.id ? "Update" : "Add"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}