"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, Sun, Moon, User, LogOut, FileAudio } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { createClient } from '@/utils/supabase/client';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch initial user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Listen to changes (login/logout events)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      authListener.subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 mx-auto">
        <Link href="/" className="mr-6 flex items-center space-x-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-primary/5 p-1 group-hover:bg-primary/10 transition-all border border-primary/10 group-hover:border-primary/20 shadow-inner">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
               src="/logo.png" 
               alt="HireDx Logo" 
               className="h-full w-full object-contain"
             />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight hidden sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-emerald-400">
            HireDx
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2 relative">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 mr-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link href="/results/demo">
              <Button variant="ghost" className="text-sm font-semibold rounded-full px-5">Demo</Button>
            </Link>

            {user ? (
               <div className="relative" ref={dropdownRef}>
                 <button 
                   onClick={() => setDropdownOpen(!dropdownOpen)}
                   className="flex items-center gap-2 bg-muted/50 hover:bg-muted border border-border/50 rounded-full pl-2 pr-4 py-1.5 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                 >
                   <div className="bg-primary/20 w-7 h-7 rounded-full flex items-center justify-center text-primary">
                     <User className="w-4 h-4" />
                   </div>
                   <span className="text-sm font-medium truncate max-w-[120px]">{user.email}</span>
                 </button>

                 {/* Custom Dropdown UI */}
                 {dropdownOpen && (
                   <div className="absolute right-0 mt-3 w-56 bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden py-1 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                     <div className="px-4 py-3 border-b border-border/50 bg-muted/20">
                       <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Signed in as</p>
                       <p className="text-sm font-medium truncate">{user.email}</p>
                     </div>
                     <div className="p-1">
                       <Link href="/analyze" onClick={() => setDropdownOpen(false)}>
                         <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm hover:bg-primary/10 hover:text-primary rounded-md transition-colors">
                           <FileAudio className="w-4 h-4" /> Analyze Recording
                         </button>
                       </Link>
                       <Link href="/profile" onClick={() => setDropdownOpen(false)}>
                         <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-muted-foreground rounded-md transition-colors">
                           <User className="w-4 h-4" /> My Profile
                         </button>
                       </Link>
                     </div>
                     <div className="p-1 border-t border-border/50 mt-1">
                       <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors font-medium">
                         <LogOut className="w-4 h-4" /> Log out
                       </button>
                     </div>
                   </div>
                 )}
               </div>
            ) : (
              // Logged out state
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-sm rounded-full px-5">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button className="text-sm rounded-full px-6 shadow-md shadow-primary/20">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
