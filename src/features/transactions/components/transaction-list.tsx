import { Transaction } from '../types';
import { formatCurrency } from '@/lib/utils/currency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TransactionListProps {
    transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
    if (transactions.length === 0) {
        return <div className="text-center text-muted-foreground py-8">No transactions yet.</div>;
    }

    return (
        <div className="space-y-2">
            {transactions.map((tx) => (
                <Card key={tx.id}>
                    <CardContent className="flex justify-between items-center p-4">
                        <div>
                            <p className="font-medium">{tx.merchant || 'Unknown Merchant'}</p>
                            <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                        <div className="font-bold">
                            {formatCurrency(tx.amount_cents, tx.currency)}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
