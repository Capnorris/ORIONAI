'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Sparkles, ArrowRight, Lock, Mail, User, Zap } from 'lucide-react';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

                {/* Floating Orbs */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

                {/* Success Content */}
                <div className="relative z-10 w-full max-w-md text-center">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 shadow-[0_0_50px_rgba(139,92,246,0.1)] animate-in fade-in zoom-in duration-500">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-purple-500 shadow-[0_0_40px_rgba(139,92,246,0.6)] flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-700 delay-200">
                            <Zap className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Check Your Email!</h2>
                        <p className="text-muted-foreground text-lg mb-8">
                            We've sent you a confirmation link to <strong className="text-white">{email}</strong>
                        </p>
                        <p className="text-sm text-muted-foreground mb-8">
                            Click the link in the email to activate your account and start your journey with Orion AI.
                        </p>
                        <Link href="/login">
                            <Button className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] h-12 px-8">
                                Go to Login
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

            {/* Floating Orbs */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="inline-flex items-center justify-center gap-3 mb-6">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-primary to-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.6)] flex items-center justify-center">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">ORION AI</h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Join the future of personal finance
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
                        <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">AI Powered</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
                        <Lock className="h-6 w-6 text-primary mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Secure</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
                        <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Premium</p>
                    </div>
                </div>

                {/* Signup Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(139,92,246,0.1)] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <form onSubmit={handleSignup} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                Email Address
                            </label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 h-12 text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white flex items-center gap-2">
                                <Lock className="h-4 w-4 text-primary" />
                                Password
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 h-12 text-base"
                            />
                            <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] group"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Create Account
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-transparent px-2 text-muted-foreground">
                                Already have an account?
                            </span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <Link href="/login">
                        <Button
                            variant="ghost"
                            className="w-full h-12 border border-white/10 hover:bg-white/5 hover:border-primary/30 text-white transition-all group"
                        >
                            Sign In Instead
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                {/* Footer */}
                <p className="text-center text-muted-foreground text-sm mt-8 animate-in fade-in duration-1000 delay-500">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
