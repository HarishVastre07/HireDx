import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, BarChart3, Target } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-24 lg:py-32 flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          <div className="container px-4 mx-auto max-w-5xl flex flex-col items-center gap-6">
            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-balance leading-tight">
              You get the interview. <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">You don't get the offer.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-3xl mt-4">
              Stop guessing why you were rejected. Upload an audio or video recording of your last interview, and our AI will expose the exact psychological, pacing, and structural errors that lost the recruiter's interest. 
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
              <Link href="/analyze">
                <Button size="lg" className="h-14 px-10 text-lg w-full sm:w-auto shadow-[0_0_20px_hsl(var(--primary)/30)] hover:shadow-[0_0_30px_hsl(var(--primary)/50)] transition-shadow">
                  Analyze My Interview <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
                </Button>
              </Link>
              <Link href="/results/demo">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base w-full sm:w-auto bg-background/50 backdrop-blur-md border-primary/20 hover:bg-primary/5">
                  View Demo Analysis
                </Button>
              </Link>
            </div>
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 max-w-4xl text-left border-t border-border/50 pt-16 w-full">
               <div className="flex flex-col gap-3 items-center text-center">
                 <div className="w-12 h-12 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-2">1</div>
                 <h4 className="font-bold text-lg font-heading">Record or Upload</h4>
                 <p className="text-sm text-muted-foreground text-balance">Drop in your recording. We process it privately on Google supercomputers and immediately delete it.</p>
               </div>
               <div className="flex flex-col gap-3 items-center text-center mt-8 md:mt-0 relative">
                 <div className="hidden md:block absolute top-6 -left-[20%] w-[40%] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                 <div className="w-12 h-12 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-2">2</div>
                 <h4 className="font-bold text-lg font-heading">AI Brain Extracts</h4>
                 <p className="text-sm text-muted-foreground text-balance">We parse pacing, hesitation, behavioral patterns, and rank the exact moments you lost confidence.</p>
               </div>
               <div className="flex flex-col gap-3 items-center text-center mt-8 md:mt-0 relative">
                 <div className="hidden md:block absolute top-6 -left-[20%] w-[40%] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                 <div className="w-12 h-12 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-2">3</div>
                 <h4 className="font-bold text-lg font-heading">Get the Blueprint</h4>
                 <p className="text-sm text-muted-foreground text-balance">Receive a brutal, honest Rejection Heatmap and a 4-week actionable checklist to win the next one.</p>
               </div>
            </div>
          </div>
        </section>
        {/* FEATURES */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4 mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold">Uncover the Hidden Rejection Signals</h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Our AI engine detects the exact moments you lost the interviewer's interest, based on real industry hiring criteria.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 border rounded-xl shadow-sm transition-all hover:shadow-md hover:border-primary/50 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Rejection Heatmap</h3>
                <p className="text-muted-foreground">A moment-by-moment chronological timeline highlighting exactly where your answer derailed or confidence dropped.</p>
              </div>
              <div className="bg-card p-6 border rounded-xl shadow-sm transition-all hover:shadow-md hover:border-primary/50 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Role-based Standards</h3>
                <p className="text-muted-foreground">Compare your actual response to the 'Winning Answer' that top-tier companies expect for your specific role.</p>
              </div>
              <div className="bg-card p-6 border rounded-xl shadow-sm transition-all hover:shadow-md hover:border-primary/50 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Mic className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Speech Mechanics</h3>
                <p className="text-muted-foreground">Detailed tracking of umms, ahhs, pacing, and long silences that subconsciously hurt your hireability score.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
