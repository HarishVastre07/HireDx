"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Target, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/analyze");
      router.refresh(); // refresh the layout and navbar bounds
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Abstract Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10 backdrop-blur-xl bg-card/60 p-8 rounded-3xl border shadow-2xl border-white/5">
          <div className="flex justify-center mb-6">
             <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-primary/5 p-2 border border-primary/10 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/logo.png" 
                  alt="HireDx Logo" 
                  className="h-full w-full object-contain"
                />
             </div>
          </div>
          
          <h1 className="text-3xl font-heading font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-center text-muted-foreground mb-8">Sign in to decode your failures.</p>

          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-lg flex items-center gap-2 mb-6 text-sm border border-destructive/20 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium px-1">Email</label>
              <Input 
                type="email" 
                placeholder="you@domain.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 h-12 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between px-1">
                 <label className="text-sm font-medium">Password</label>
                 <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50 h-12 rounded-xl"
              />
            </div>
            
            <Button disabled={loading} type="submit" className="w-full h-12 rounded-xl mt-4 font-semibold text-base tracking-wide shadow-[0_0_15px_hsl(var(--primary)/20)] transition-all">
              {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account? <Link href="/signup" className="text-primary hover:underline font-semibold tracking-wide">Create one</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
