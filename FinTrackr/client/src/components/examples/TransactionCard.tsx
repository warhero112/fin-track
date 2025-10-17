import TransactionCard from '../TransactionCard';

const mockTransaction = {
  id: "tx1",
  date: "2025-01-15",
  label: "Starbucks Coffee",
  amount: 5.45,
  type: "expense" as const,
  category: "Food"
};

const mockIncomeTransaction = {
  id: "tx2",
  date: "2025-01-01",
  label: "Salary",
  amount: 5000,
  type: "income" as const,
  category: "Salary"
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export default function TransactionCardExample() {
  return (
    <div className="space-y-4 p-4 max-w-md">
      <TransactionCard
        transaction={mockTransaction}
        onEdit={(tx) => console.log('Edit transaction:', tx)}
        onDelete={(id) => console.log('Delete transaction:', id)}
        formatCurrency={formatCurrency}
      />
      
      <TransactionCard
        transaction={mockIncomeTransaction}
        onEdit={(tx) => console.log('Edit transaction:', tx)}
        onDelete={(id) => console.log('Delete transaction:', id)}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}