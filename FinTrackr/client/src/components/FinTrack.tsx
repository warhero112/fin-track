import { useState, useMemo, useCallback, useEffect } from 'react';
import { Plus, Camera, Sparkles, TrendingUp, BarChart3, Bot } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Transaction, Goal, User, AiMessage } from "@shared/schema";

import TopBar from './TopBar';
import BottomNavigation from './BottomNavigation';
import TransactionCard from './TransactionCard';
import GoalCard from './GoalCard';
import StatCard from './StatCard';
import InsightCard from './InsightCard';
import AIChat from './AIChat';
import TransactionModal from './TransactionModal';
import GoalModal from './GoalModal';
import { api } from '@/lib/api';

const quickSuggestions = [
  "How can I improve my savings rate?",
  "Analyze my spending patterns", 
  "Help me optimize my budget",
  "Should I adjust my goals?",
  "Give me personalized financial tips"
];


export default function FinTrack() {
  const [activeTab, setActiveTab] = useState(0);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const { toast } = useToast();
  
  // Fetch user data
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });
  
  // Fetch transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });
  
  // Fetch goals
  const { data: goals = [], isLoading: goalsLoading } = useQuery<Goal[]>({
    queryKey: ['/api/goals'],
  });
  
  // Fetch AI messages
  const { data: aiMessages = [], isLoading: aiMessagesLoading } = useQuery<AiMessage[]>({
    queryKey: ['/api/ai/messages'],
  });

  // Mutations
  const createTransactionMutation = useMutation({
    mutationFn: (data: any) => api.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({ title: "Transaction added successfully" });
    },
    onError: () => {
      toast({ title: "Failed to add transaction", variant: "destructive" });
    }
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({ title: "Transaction updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update transaction", variant: "destructive" });
    }
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: (id: string) => api.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({ title: "Transaction deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete transaction", variant: "destructive" });
    }
  });

  const createGoalMutation = useMutation({
    mutationFn: (data: any) => api.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      toast({ title: "Goal created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create goal", variant: "destructive" });
    }
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      toast({ title: "Goal updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update goal", variant: "destructive" });
    }
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (id: string) => api.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      toast({ title: "Goal deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete goal", variant: "destructive" });
    }
  });

  const sendAiMessageMutation = useMutation({
    mutationFn: (message: string) => api.sendAiMessage(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/messages'] });
    },
    onError: () => {
      toast({ title: "Failed to send message", variant: "destructive" });
    }
  });

  const clearAiMessagesMutation = useMutation({
    mutationFn: () => api.clearAiMessages(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/messages'] });
      toast({ title: "Conversation reset successfully" });
    },
    onError: () => {
      toast({ title: "Failed to reset conversation", variant: "destructive" });
    }
  });

  const formatCurrency = useCallback((amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    const currency = user?.currency || 'USD';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(numAmount || 0);
  }, [user]);

  // Calculate financial metrics
  const currentMonth = new Date().toISOString().slice(0, 7);
  const financialMetrics = useMemo(() => {
    const monthTx = transactions.filter(t => t.date.startsWith(currentMonth));
    const income = monthTx.filter(t => t.type === "income").reduce((s, t) => s + parseFloat(t.amount), 0);
    const expenses = monthTx.filter(t => t.type === "expense").reduce((s, t) => s + parseFloat(t.amount), 0);
    const totalBudget = 2500;
    const usedPercent = totalBudget > 0 ? (expenses / totalBudget * 100) : 0;
    const remaining = totalBudget - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income * 100) : 0;
    
    return { income, expenses, totalBudget, usedPercent, remaining, savingsRate };
  }, [transactions, currentMonth]);

  // Pie chart data
  const pieChartData = useMemo(() => {
    const data = [];
    if (financialMetrics.income > 0) {
      data.push({ name: 'Income', value: financialMetrics.income, color: 'hsl(var(--chart-1))' });
    }
    if (financialMetrics.expenses > 0) {
      data.push({ name: 'Expenses', value: financialMetrics.expenses, color: 'hsl(var(--chart-2))' });
    }
    const savings = financialMetrics.income - financialMetrics.expenses;
    if (savings > 0) {
      data.push({ name: 'Savings', value: savings, color: 'hsl(var(--primary))' });
    }
    return data;
  }, [financialMetrics]);

  // Recent transactions
  const recentTransactions = useMemo(() => {
    return transactions
      .filter(t => t.date.startsWith(currentMonth))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions, currentMonth]);

  // Dynamic insights based on actual data
  const insights = useMemo(() => {
    const categoryBreakdown = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .reduce((acc: Record<string, number>, t) => {
        acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
        return acc;
      }, {});
    
    const topCategory = Object.entries(categoryBreakdown)
      .sort(([,a], [,b]) => b - a)[0];

    const topGoal = goals
      .map(g => ({
        name: g.name,
        progress: parseFloat(g.current) / parseFloat(g.target) * 100
      }))
      .sort((a, b) => b.progress - a.progress)[0];

    return [
      {
        type: 'savings',
        color: 'green',
        icon: 'TrendingUp',
        title: 'Savings Analysis',
        message: financialMetrics.savingsRate > 0
          ? `Excellent! You're saving ${financialMetrics.savingsRate.toFixed(1)}% of your income this month.`
          : 'Start tracking your income to see your savings rate.'
      },
      {
        type: 'spending',
        color: 'red',
        icon: 'ShoppingBag',
        title: 'Spending Pattern',
        message: topCategory
          ? `Your top spending is ${topCategory[0]}: ${formatCurrency(topCategory[1])} this month.`
          : 'No spending data available yet.'
      },
      {
        type: 'goals',
        color: 'purple',
        icon: 'Target',
        title: 'Goal Progress',
        message: topGoal
          ? `${topGoal.name} is ${topGoal.progress.toFixed(1)}% complete - keep it up!`
          : 'Set your first goal to start tracking progress!'
      },
      {
        type: 'habits',
        color: 'indigo',
        icon: 'Calendar',
        title: 'Spending Habits',
        message: financialMetrics.usedPercent < 80
          ? 'Great spending discipline this month!'
          : 'You\'re approaching your budget limit - watch your spending!'
      },
      {
        type: 'budget',
        color: 'green',
        icon: 'DollarSign',
        title: 'Budget Status',
        message: `Budget looking good: ${financialMetrics.usedPercent.toFixed(1)}% used`
      }
    ];
  }, [transactions, goals, currentMonth, financialMetrics, formatCurrency]);

  // Auto-rotate insights
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsightIndex(prev => (prev + 1) % insights.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [insights.length]);

  // Handlers
  const handleOpenTransaction = (transaction: any = null) => {
    setEditingTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleSaveTransaction = (transactionData: any) => {
    if (editingTransaction) {
      updateTransactionMutation.mutate({
        id: editingTransaction.id,
        data: {
          ...transactionData,
          amount: transactionData.amount
        }
      });
    } else {
      createTransactionMutation.mutate(transactionData);
    }
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransactionMutation.mutate(id);
  };

  const handleOpenGoal = (goal: any = null) => {
    setEditingGoal(goal);
    setShowGoalModal(true);
  };

  const handleSaveGoal = (goalData: any) => {
    if (editingGoal) {
      updateGoalMutation.mutate({
        id: editingGoal.id,
        data: {
          ...goalData,
          target: goalData.target
        }
      });
    } else {
      createGoalMutation.mutate(goalData);
    }
    setEditingGoal(null);
  };

  const handleDeleteGoal = (id: string) => {
    deleteGoalMutation.mutate(id);
  };

  const handleFundGoal = (goal: any) => {
    // Funding a goal means updating its current amount
    const amount = prompt(`How much would you like to add to "${goal.name}"?`);
    if (amount && !isNaN(parseFloat(amount))) {
      const newCurrent = parseFloat(goal.current) + parseFloat(amount);
      updateGoalMutation.mutate({
        id: goal.id,
        data: { current: newCurrent.toString() }
      });
    }
  };

  const handleAIMessage = async (message: string) => {
    sendAiMessageMutation.mutate(message);
  };

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background p-3 rounded-lg shadow-lg border border-border">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Render different screens based on active tab
  const renderScreen = () => {
    switch (activeTab) {
      case 0: // Dashboard
        return (
          <div className="pb-20 bg-muted/30 min-h-screen">
            <TopBar title="Dashboard" showAddButton onAddClick={() => handleOpenTransaction()} />
            <div className="px-4 space-y-6 pt-4">
              {/* Header with date and quick actions */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </h2>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <Button
                    onClick={() => handleOpenTransaction()}
                    className="flex items-center justify-center gap-2 h-12"
                    data-testid="button-quick-add"
                  >
                    <Plus size={18} />
                    Quick Add
                  </Button>
                  <Button
                    variant="outline" 
                    className="flex items-center justify-center gap-2 h-12 bg-chart-1/10 border-chart-1/20 hover:bg-chart-1/20 text-chart-1"
                    onClick={() => console.log('Scan bill')}
                    data-testid="button-scan-bill"
                  >
                    <Camera size={18} />
                    Scan Bill
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-chart-3/10 to-chart-4/10 border-chart-3/20 hover:from-chart-3/20 hover:to-chart-4/20 text-chart-3"
                    onClick={() => setActiveTab(3)}
                    data-testid="button-ask-ai"
                  >
                    <Sparkles size={18} />
                    Ask AI
                  </Button>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <StatCard
                    title="Monthly Spending"
                    value={formatCurrency(financialMetrics.expenses)}
                    subtitle="+8.7%"
                    icon={TrendingUp}
                    color="primary"
                  />
                  <StatCard
                    title="Budget Used"
                    value={`${financialMetrics.usedPercent.toFixed(1)}%`}
                    subtitle={`${formatCurrency(financialMetrics.remaining)} left`}
                    icon={BarChart3}
                    color="warning"
                    progress={financialMetrics.usedPercent}
                  />
                </div>
              </div>

              {/* AI Quick Insight */}
              <Card className="bg-gradient-to-r from-chart-3 to-chart-4 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot size={16} />
                    <span className="text-sm font-medium">AI Insight</span>
                  </div>
                  <p className="text-sm opacity-90">
                    {financialMetrics.savingsRate > 20 
                      ? "Great financial discipline! You're saving well above average. Consider increasing your emergency fund goal."
                      : financialMetrics.savingsRate > 10 
                        ? "You're staying within budget. Consider setting up automatic transfers to boost your savings rate."
                        : "Your expenses are high this month. I can help you find areas to optimize - just ask!"}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-white/90 hover:text-white hover:bg-white/20"
                    onClick={() => setActiveTab(3)}
                  >
                    Get Detailed Analysis →
                  </Button>
                </CardContent>
              </Card>

              {/* Monthly Overview Chart */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
                  {pieChartData.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={40}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-2 text-muted" />
                        <p>No financial data available yet</p>
                        <p className="text-sm">Add some transactions to see your overview</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                  <div className="space-y-3">
                    {recentTransactions.map(transaction => (
                      <TransactionCard
                        key={transaction.id}
                        transaction={transaction}
                        onEdit={handleOpenTransaction}
                        onDelete={handleDeleteTransaction}
                        formatCurrency={formatCurrency}
                      />
                    ))}
                    {recentTransactions.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No transactions this month</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handleOpenTransaction()}
                        >
                          Add Your First Transaction
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 1: // Goals
        return (
          <div className="pb-20 bg-muted/30 min-h-screen">
            <TopBar 
              title="Goals" 
              showAddButton 
              onAddClick={() => handleOpenGoal()}
            />
            <div className="px-4 pt-4 space-y-4">
              {goals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onFund={handleFundGoal}
                  onDelete={handleDeleteGoal}
                  formatCurrency={formatCurrency}
                />
              ))}

              {goals.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">No goals yet</p>
                    <Button onClick={() => handleOpenGoal()}>
                      Create Your First Goal
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case 2: // Insights
        return (
          <div className="pb-20 bg-muted/30 min-h-screen">
            <TopBar title="Insights" />
            <div className="px-4 pt-4 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  title="Savings Rate"
                  value={`${financialMetrics.savingsRate.toFixed(1)}%`}
                  icon={TrendingUp}
                  color="success"
                />
                <StatCard
                  title="Total Transactions"
                  value={transactions.length.toString()}
                  icon={BarChart3}
                  color="primary"
                />
              </div>

              {/* Smart Insights */}
              <InsightCard
                insight={insights[currentInsightIndex]}
                currentIndex={currentInsightIndex}
                totalInsights={insights.length}
                onPrevious={() => setCurrentInsightIndex(prev => 
                  prev === 0 ? insights.length - 1 : prev - 1
                )}
                onNext={() => setCurrentInsightIndex(prev => 
                  (prev + 1) % insights.length
                )}
              />

              {/* AI Integration Promo */}
              <Card className="bg-gradient-to-r from-chart-3 to-chart-4 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot size={16} />
                    <span className="font-medium">Get AI Analysis</span>
                  </div>
                  <p className="text-sm opacity-90 mb-3">
                    Want deeper insights? Ask our AI advisor about your spending patterns, goal optimization, or financial recommendations.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/90 hover:text-white hover:bg-white/20"
                    onClick={() => setActiveTab(3)}
                  >
                    Talk to AI Advisor →
                  </Button>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-3">Category Breakdown</h3>
                  <div className="space-y-2">
                    {Object.entries(
                      transactions
                        .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
                        .reduce((acc: Record<string, number>, t) => {
                          acc[t.category] = (acc[t.category] || 0) + t.amount;
                          return acc;
                        }, {})
                    )
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 4)
                      .map(([category, amount]) => {
                        const percentage = financialMetrics.expenses > 0 ? (amount / financialMetrics.expenses * 100) : 0;
                        return (
                          <div key={category} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-primary"></div>
                              <span className="text-sm">{category}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{formatCurrency(amount)}</div>
                              <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 3: // AI Advisor
        return (
          <div className="pb-20 bg-muted/30 h-screen flex flex-col">
            <TopBar title="AI Advisor" />
            <div className="flex-1 overflow-hidden">
              <AIChat
                messages={aiMessages}
                onSendMessage={handleAIMessage}
                isLoading={sendAiMessageMutation.isPending}
                quickSuggestions={quickSuggestions}
              />
            </div>
          </div>
        );

      case 4: // Settings
        return (
          <div className="pb-20 bg-muted/30 min-h-screen">
            <TopBar title="Settings" />
            <div className="px-4 pt-4 space-y-4">
              {/* Regional Settings */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Regional Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Currency</label>
                      <select 
                        className="w-full border border-border rounded-lg px-3 py-2 bg-background"
                        value={user?.currency || 'USD'}
                        onChange={(e) => {
                          api.updateUser({ currency: e.target.value }).then(() => {
                            queryClient.invalidateQueries({ queryKey: ['/api/user'] });
                            toast({ title: "Currency updated successfully" });
                          });
                        }}
                      >
                        <option value="USD">$ US Dollar (USD)</option>
                        <option value="EUR">€ Euro (EUR)</option>
                        <option value="GBP">£ British Pound (GBP)</option>
                        <option value="JPY">¥ Japanese Yen (JPY)</option>
                        <option value="CAD">C$ Canadian Dollar (CAD)</option>
                        <option value="LKR">Rs Sri Lankan Rupee (LKR)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Language</label>
                      <select 
                        className="w-full border border-border rounded-lg px-3 py-2 bg-background"
                        value={user?.language || 'en'}
                        onChange={(e) => {
                          api.updateUser({ language: e.target.value }).then(() => {
                            queryClient.invalidateQueries({ queryKey: ['/api/user'] });
                            toast({ title: "Language updated successfully" });
                          });
                        }}
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="it">Italiano</option>
                        <option value="ja">日本語</option>
                        <option value="si">සිංහල</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Settings */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Bot size={20} />
                    AI Assistant
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Smart Insights</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Spending Alerts</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => clearAiMessagesMutation.mutate()}
                      className="w-full"
                      disabled={clearAiMessagesMutation.isPending}
                    >
                      {clearAiMessagesMutation.isPending ? "Resetting..." : "Reset AI Conversation"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">About FinTrack</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Version 1.0.0
                  </p>
                  <p className="text-sm text-muted-foreground">
                    A comprehensive personal finance application with AI-powered insights.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen relative">
      {renderScreen()}
      
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onQuickAdd={() => handleOpenTransaction()}
      />

      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        initialData={editingTransaction}
        title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
      />

      <GoalModal
        isOpen={showGoalModal}
        onClose={() => {
          setShowGoalModal(false);
          setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
        initialData={editingGoal}
        title={editingGoal ? "Edit Goal" : "Add Goal"}
      />
    </div>
  );
}