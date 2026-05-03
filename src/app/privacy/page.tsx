import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Eye, Trash2, Lock } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
             <ShieldCheck className="w-4 h-4" /> Official Privacy Policy
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Your Data is Yours.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We built HireDx specifically for DevClash 2026 with a zero-retention privacy architecture. Here is exactly what happens to your interview recordings.
          </p>
        </div>

        <div className="space-y-12">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-b pb-2 flex items-center gap-2"><Trash2 className="text-destructive w-6 h-6" /> 1. Immediate Video Deletion</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you upload a video or audio file for analysis, it is transmitted directly to Google&apos;s Gemini 2.5 infrastructure via their secure File API. We have explicitly programmed our backend to call <code className="bg-muted px-1.5 py-0.5 rounded text-sm relative text-destructive">ai.files.delete()</code> the exact microsecond the analysis finishes.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Your file is permanently wiped from Google servers instantly.</strong> We never rely on the default 48-hour auto-expiry.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-b pb-2 flex items-center gap-2"><Eye className="text-primary w-6 h-6" /> 2. Zero Human Access</h2>
            <p className="text-muted-foreground leading-relaxed">
              No human — not our developers, not our partners, and not Google&apos;s training teams — will ever view or listen to your interview recordings. The data is processed exclusively by an automated Large Language Model to generate the rejection analysis JSON object.
            </p>
          </section>

          <section className="space-y-4">
             <h2 className="text-2xl font-bold border-b pb-2 flex items-center gap-2"><Lock className="text-green-500 w-6 h-6" /> 3. No Local Server Storage</h2>
             <p className="text-muted-foreground leading-relaxed">
               We do not store your video on our own databases. We do not use Amazon S3, Supabase Storage, or any cloud buckets. The file exists momentarily in secure memory during transmission and is then erased. The only data that persists is the text-based JSON analysis report, which is temporarily saved in your browser&apos;s local storage.
             </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
