'use client';

import { TransactionList } from '@/features/transactions/components/transaction-list';
import { useTransactions } from '@/features/transactions/hooks/use-transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TransactionsPage() {
    const { transactions } = useTransactions();

    return (
        <div className="p-8">
            <Card>
                <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <TransactionList transactions={transactions} />
                </CardContent>
            </Card>
        </div>
    );
}
