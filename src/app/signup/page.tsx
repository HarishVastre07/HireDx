"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Target, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      if (data?.session) {
         router.push("/analyze");
         router.refresh();
      } else {
         setSuccessMsg("Check your inbox to verify your account!");
         setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Abstract Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />

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
          
          <h1 className="text-3xl font-heading font-bold text-center mb-2">Join HireDx</h1>
          <p className="text-center text-muted-foreground mb-8">Your interview roadmap awaits.</p>

          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-lg flex items-center gap-2 mb-6 text-sm border border-destructive/20 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-green-500/15 text-green-500 p-3 rounded-lg flex flex-col items-center justify-center gap-2 mb-6 text-sm border border-green-500/20 font-medium text-center">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {!successMsg && (
             <form onSubmit={handleSignup} className="space-y-4">
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
                 <label className="text-sm font-medium px-1">Password</label>
                 <Input 
                   type="password" 
                   placeholder="••••••••" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   minLength={6}
                   className="bg-background/50 h-12 rounded-xl"
                 />
                 <p className="text-xs text-muted-foreground px-1 pt-1 opacity-70">Must be at least 6 characters long.</p>
               </div>
               
               <Button disabled={loading} type="submit" className="w-full h-12 rounded-xl mt-4 font-semibold text-base tracking-wide shadow-[0_0_15px_hsl(var(--primary)/20)] transition-all">
                 {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : "Create Account"}
               </Button>
             </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account? <Link href="/login" className="text-primary hover:underline font-semibold tracking-wide">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
