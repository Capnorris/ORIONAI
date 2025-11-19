'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { generateInsight } from '../actions';
import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';

export function AiGate() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUserId(session.user.id);
                // Check if user has opted in? For now, just check if they are logged in (synced).
                // PRD says "Trigger: User clicks Enable AI Coach".
            }
        });
    }, []);

    const handleEnable = () => {
        if (!userId) {
            alert('Please log in to enable Cloud Sync and AI features.');
            return;
        }
        setIsEnabled(true);
    };

    const handleAsk = async () => {
        if (!query || !userId) return;
        setLoading(true);
        try {
            const result = await generateInsight(query, userId);
            setResponse(result);
        } catch (e: any) {
            setResponse(`Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isEnabled) {
        return (
            <Card className="w-full max-w-2xl mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Orion AI Coach</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">
                        Unlock deep insights into your spending habits.
                        AI processing requires secure cloud synchronization.
                    </p>
                    <Button onClick={handleEnable} size="lg">
                        Enable AI Coach
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>AI Financial Coach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Ask about your finances..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                    />
                    <Button onClick={handleAsk} disabled={loading}>
                        {loading ? 'Thinking...' : 'Ask'}
                    </Button>
                </div>

                {response && (
                    <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">
                        {response}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
