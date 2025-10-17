import { Edit3, Trash2, Coffee, Car, ShoppingBag, CreditCard, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Transaction {
  id: string;
  date: string;
  label: string;
  amount: number;
  type: "income" | "expense";
  category: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  formatCurrency: (amount: number) => string;
}

const getCategoryIcon = (category: string) => {
  const iconMap = {
    'Food': Coffee,
    'Transportation': Car,
    'Shopping': ShoppingBag,
    'Bills': CreditCard,
    'Salary': DollarSign
  };
  return iconMap[category as keyof typeof iconMap] || DollarSign;
};

export default function TransactionCard({ 
  transaction, 
  onEdit, 
  onDelete, 
  formatCurrency 
}: TransactionCardProps) {
  const IconComponent = getCategoryIcon(transaction.category);
  const isIncome = transaction.type === "income";

  return (
    <Card className="hover-elevate" data-testid={`card-transaction-${transaction.id}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isIncome ? "bg-chart-1/10 text-chart-1" : "bg-chart-2/10 text-chart-2"
            }`}>
              <IconComponent size={16} />
            </div>
            <div>
              <div className="font-medium text-foreground" data-testid={`text-transaction-label-${transaction.id}`}>
                {transaction.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {transaction.category} • {transaction.date}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`font-semibold ${
              isIncome ? "text-chart-1" : "text-chart-2"
            }`} data-testid={`text-transaction-amount-${transaction.id}`}>
              {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(transaction)}
              data-testid={`button-edit-transaction-${transaction.id}`}
            >
              <Edit3 size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(transaction.id)}
              data-testid={`button-delete-transaction-${transaction.id}`}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}