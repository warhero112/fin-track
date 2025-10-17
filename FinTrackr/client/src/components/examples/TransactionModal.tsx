import TransactionModal from '../TransactionModal';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

export default function TransactionModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(undefined);

  const handleSave = (transaction: any) => {
    console.log('Save transaction:', transaction);
    setIsOpen(false);
  };

  const openNewTransaction = () => {
    setEditData(undefined);
    setIsOpen(true);
  };

  const openEditTransaction = () => {
    setEditData({
      id: "tx1",
      amount: "25.50",
      label: "Grocery shopping",
      category: "Food",
      type: "expense",
      date: "2025-01-15"
    });
    setIsOpen(true);
  };

  return (
    <div className="p-4 space-y-4">
      <Button onClick={openNewTransaction}>
        Add New Transaction
      </Button>
      
      <Button onClick={openEditTransaction} variant="outline">
        Edit Transaction
      </Button>

      <TransactionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        initialData={editData}
        title={editData ? "Edit Transaction" : "Add Transaction"}
      />
    </div>
  );
}