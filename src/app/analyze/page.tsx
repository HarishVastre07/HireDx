'use client';
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadCloud, Mic, Loader2, Info, ShieldCheck, Trash2, Eye, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Progress stages shown while video is being processed
const STAGES = [
  { id: 1, label: "Uploading recording to secure pipeline",   duration: 4000  },
  { id: 2, label: "Google Gemini processing video frames",    duration: 8000  },
  { id: 3, label: "Chain-of-Thought reasoning in progress",   duration: 10000 },
  { id: 4, label: "Generating question-by-question analysis", duration: 6000  },
  { id: 5, label: "Building your rejection heatmap",          duration: 4000  },
];

export default function AnalyzePage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [errorObj, setErrorObj] = useState("");

  // Animate through progress stages while upload is in-flight
  useEffect(() => {
    if (!isUploading || !file) return;
    let stageIndex = 0;
    const advance = () => {
      if (stageIndex < STAGES.length - 1) {
        stageIndex++;
        setCurrentStage(stageIndex);
        setTimeout(advance, STAGES[stageIndex].duration);
      }
    };
    setCurrentStage(0);
    const timer = setTimeout(advance, STAGES[0].duration);
    return () => clearTimeout(timer);
  }, [isUploading, file]);

  const handleAnalyze = async () => {
    if (!role) return;
    setIsUploading(true);
    setErrorObj("");
    setCurrentStage(0);

    // No file → instant demo mode
    if (!file) {
      setTimeout(() => { router.push("/results/demo"); }, 1500);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("role", role);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      if (data.databaseId) {
        // Logged in: route directly to the persistent Database record
        router.push(`/results/${data.databaseId}`);
      } else {
        // Logged out: route to local browser cache
        const resultId = `real_analysis_${Date.now()}`;
        localStorage.setItem(`hiredx_${resultId}`, JSON.stringify(data.result));
        router.push(`/results/${resultId}`);
      }

    } catch (err: any) {
      setErrorObj(err.message || "Failed to analyze. Did you add your GEMINI_API_KEY?");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/10">
      <Navbar />
      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full flex flex-col py-10">

        {/* ── PROGRESS UI ── shown only while analyzing a real file */}
        {isUploading && file && (
          <Card className="mb-8 border-primary/20 shadow-lg overflow-hidden">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                Analyzing Your Interview...
              </CardTitle>
              <CardDescription>This may take 30–90 seconds depending on video length. Do not close this tab.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {STAGES.map((stage, i) => {
                const done    = i < currentStage;
                const active  = i === currentStage;
                const pending = i > currentStage;
                return (
                  <div key={stage.id} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500
                    ${active  ? 'bg-primary/10 border border-primary/30' : ''}
                    ${done    ? 'opacity-50' : ''}
                    ${pending ? 'opacity-30' : ''}
                  `}>
                    {done   && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                    {active  && <Loader2 className="w-5 h-5 animate-spin text-primary shrink-0" />}
                    {pending && <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />}
                    <span className={`text-sm font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <Card className="w-full shadow-lg border-primary/10">
          <CardHeader className="text-center pb-8 border-b">
            <CardTitle className="text-3xl font-heading">Start New Analysis</CardTitle>
            <CardDescription className="text-base mt-2">
              Upload an interview recording to uncover hidden rejection signals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-8 p-6 md:p-10">

            {/* Step 1: Role Selection */}
            <div className="space-y-4">
              <Label htmlFor="role" className="text-lg font-bold">1. Select Interview Target Role</Label>
              <p className="text-sm text-muted-foreground">Our AI adjusts the scoring criteria based on the standard expectations for this role.</p>
              <Select value={role} onValueChange={(val) => setRole(val ?? "")}>
                <SelectTrigger id="role" className="h-12 w-full md:w-2/3 shadow-sm border-2">
                  <SelectValue placeholder="e.g. Software Engineer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sde">Software Engineer</SelectItem>
                  <SelectItem value="frontend">Frontend Developer</SelectItem>
                  <SelectItem value="backend">Backend Developer</SelectItem>
                  <SelectItem value="pm">Product Manager</SelectItem>
                  <SelectItem value="data">Data Analyst</SelectItem>
                  <SelectItem value="sales">Sales & BD</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Step 2: Upload */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Label className="text-lg font-bold">2. Upload Recording (Optional for Demo)</Label>
                {/* Privacy Badge */}
                <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Privacy Protected
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Supported formats: MP3, WAV, MP4, MOV. Max size: 50MB.</p>

              {/* Privacy Notice */}
              <div className="flex items-start gap-2 p-3 bg-muted/40 border border-muted rounded-lg text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">How we handle your recording</p>
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1.5"><Eye className="w-3 h-3 shrink-0" /> Processed only by Google Gemini AI — no human ever views it.</span>
                    <span className="flex items-center gap-1.5"><Trash2 className="w-3 h-3 shrink-0" /> Permanently deleted from Google&apos;s servers immediately after analysis.</span>
                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 shrink-0" /> We never store your recording on our own servers.</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer relative overflow-hidden">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    accept="audio/*,video/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 ${file ? 'bg-green-500/10' : 'bg-primary/10'}`}>
                    <UploadCloud className={`h-6 w-6 ${file ? 'text-green-500' : 'text-primary'}`} />
                  </div>
                  <p className="font-medium">{file ? file.name : "Click to upload or drag & drop"}</p>
                  <p className="text-xs text-muted-foreground mt-1 text-balance">Audio or Video files only</p>
                </div>

                <div className="border-2 border-muted-foreground/10 rounded-xl p-8 flex flex-col items-center justify-center text-center opacity-50 bg-muted/20">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Mic className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium">Record live in browser</p>
                  <p className="text-xs text-muted-foreground mt-1">Feature coming soon</p>
                </div>
              </div>
            </div>

            {errorObj && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">
                <strong>Error: </strong> {errorObj}
              </div>
            )}

            {/* CTA */}
            <div className="pt-8 flex justify-end">
              <Button
                size="lg"
                className="h-12 px-8 w-full md:w-auto shadow-md"
                disabled={!role || isUploading}
                onClick={handleAnalyze}
              >
                {isUploading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {file ? "Processing with Gemini AI..." : "Loading Demo..."}</>
                ) : (
                  file ? "Start Real AI Analysis" : "View Instant Demo"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
