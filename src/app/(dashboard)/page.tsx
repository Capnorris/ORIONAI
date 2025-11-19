'use client';

import { TransactionForm } from '@/features/transactions/components/transaction-form';
import { TransactionList } from '@/features/transactions/components/transaction-list';
import { useTransactions } from '@/features/transactions/hooks/use-transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { formatCurrency } from '@/lib/utils/currency';
import { Plus, TrendingUp, Wallet, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Dashboard() {
  const { transactions } = useTransactions();
  const [user, setUser] = useState<User | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Calculate stats
  const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount_cents, 0);
  const transactionCount = transactions.length;

  // Mock budget for now
  const budget = 500000; // $5,000.00
  const remaining = budget - totalSpent;
  const progress = Math.min((totalSpent / budget) * 100, 100);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Good Evening, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">{user?.email?.split('@')[0] || 'Guest'}</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Here's your financial overview for today.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:scale-105">
              <Plus className="mr-2 h-5 w-5" /> Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-black/80 backdrop-blur-xl border-white/10">
            <DialogHeader>
              <DialogTitle>New Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm onSuccess={() => setIsAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Spent Card */}
        <Card className="border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-red-400" />
              <span className="text-red-400">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        {/* Budget Card */}
        <Card className="border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget Remaining</CardTitle>
            <div className="h-4 w-4 rounded-full border-2 border-blue-500/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatCurrency(remaining)}</div>
            <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{progress.toFixed(1)}% of budget used</p>
          </CardContent>
        </Card>

        {/* Transactions Count */}
        <Card className="border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
            <div className="h-4 w-4 rounded-full border-2 border-purple-500/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{transactionCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Recorded this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View All</Button>
          </div>

          {/* Transaction List Component */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/5 p-1">
            <TransactionList transactions={transactions} />
          </div>
        </div>

        {/* AI Insights / Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">AI Insights</h2>
          <Card className="border-primary/20 bg-gradient-to-b from-primary/10 to-transparent backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Brain className="h-5 w-5" />
                Orion Coach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your spending on <strong>Coffee</strong> is 15% higher than usual this week. Consider brewing at home to save ~$25.
              </p>
              <Button className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white border border-white/10">
                View Analysis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
