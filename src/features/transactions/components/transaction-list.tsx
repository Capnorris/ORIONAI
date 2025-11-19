import { Transaction } from '../types';
import { formatCurrency } from '@/lib/utils/currency';
import { Button } from '@/components/ui/button';
import { useTransactions } from '../hooks/use-transactions';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TransactionForm } from './transaction-form';
import { Edit2, Trash2, ShoppingBag } from 'lucide-react';

interface TransactionListProps {
    transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
    const { deleteTransaction } = useTransactions();
    const [editingTx, setEditingTx] = useState<Transaction | null>(null);

    if (transactions.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-12">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No transactions yet.</p>
                <p className="text-sm mt-1">Add your first transaction to get started.</p>
            </div>
        );
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            await deleteTransaction(id);
        }
    };

    return (
        <>
            <div className="space-y-1 p-2">
                {transactions.map((tx) => (
                    <div
                        key={tx.id}
                        className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all duration-300"
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <ShoppingBag className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-white">{tx.merchant || 'Unknown Merchant'}</p>
                                <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="font-bold text-white text-lg">
                                    {formatCurrency(tx.amount_cents, tx.currency)}
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingTx(tx)}
                                    className="h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(tx.id)}
                                    className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={!!editingTx} onOpenChange={(open) => !open && setEditingTx(null)}>
                <DialogContent className="sm:max-w-[425px] bg-black/80 backdrop-blur-xl border-white/10">
                    <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                    </DialogHeader>
                    {editingTx && (
                        <TransactionForm
                            initialData={editingTx}
                            onSuccess={() => setEditingTx(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
