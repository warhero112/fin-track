import GoalModal from '../GoalModal';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

export default function GoalModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(undefined);

  const handleSave = (goal: any) => {
    console.log('Save goal:', goal);
    setIsOpen(false);
  };

  const openNewGoal = () => {
    setEditData(undefined);
    setIsOpen(true);
  };

  const openEditGoal = () => {
    setEditData({
      id: "g1",
      name: "Emergency Fund",
      target: "10000",
      color: "#34c759"
    });
    setIsOpen(true);
  };

  return (
    <div className="p-4 space-y-4">
      <Button onClick={openNewGoal}>
        Add New Goal
      </Button>
      
      <Button onClick={openEditGoal} variant="outline">
        Edit Goal
      </Button>

      <GoalModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        initialData={editData}
        title={editData ? "Edit Goal" : "Add Goal"}
      />
    </div>
  );
}