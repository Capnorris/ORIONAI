'use client';

import { PowerSyncProvider } from '@/providers/powersync-provider';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, CreditCard, Brain, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

const NAV_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { label: 'Transactions', icon: CreditCard, href: '/transactions' },
    { label: 'AI Coach', icon: Brain, href: '/ai-coach' },
    { label: 'Settings', icon: Settings, href: '/settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <PowerSyncProvider>
            <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
                {/* Sidebar */}
                <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-white/5 bg-black/20 backdrop-blur-xl hidden lg:flex flex-col">
                    <div className="p-8">
                        <div className="flex items-center gap-3 text-2xl font-bold tracking-tighter text-white">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
                            ORION AI
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                                        isActive
                                            ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(139,92,246,0.15)] border border-primary/20"
                                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-white/5">
                        {user ? (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-4">
                                <p className="text-xs text-muted-foreground mb-1">Signed in as</p>
                                <p className="text-sm font-medium text-white truncate">{user.email}</p>
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-4">
                                <p className="text-sm text-muted-foreground">Guest Mode</p>
                            </div>
                        )}
                        {user ? (
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-5 w-5" />
                                Sign Out
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 text-primary hover:text-primary/80 hover:bg-primary/10"
                                onClick={() => router.push('/login')}
                            >
                                <LogOut className="h-5 w-5 rotate-180" />
                                Sign In
                            </Button>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:ml-72 relative">
                    {/* Mobile Header (visible only on small screens) */}
                    <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-40">
                        <div className="font-bold text-xl">ORION AI</div>
                        {/* Mobile menu trigger could go here */}
                    </div>

                    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </main>
            </div>
        </PowerSyncProvider>
    );
}
