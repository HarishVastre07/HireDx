import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Plus, FileAudio, Clock, Target, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const mockInterviews = [
    {
      id: "demo",
      role: "Software Engineer",
      date: "Oct 24, 2026",
      score: 72,
      duration: "14:20",
      status: "Analyzed"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Your Analyses</h1>
          <p className="text-muted-foreground mt-1">Review your AI rejection analysis reports.</p>
        </div>
        <Link href="/analyze">
          <Button size="lg" className="h-12 shadow-md">
            <Plus className="mr-2 h-5 w-5" /> New Analysis
          </Button>
        </Link>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/10 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-muted-foreground">Interviews Analyzed</p>
              <FileAudio className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold mt-2">1</div>
          </CardContent>
        </Card>
        <Card className="border-primary/10 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-muted-foreground">Avg Hireability Score</p>
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary mt-2">72<span className="text-base text-muted-foreground font-normal">/100</span></div>
          </CardContent>
        </Card>
        <Card className="border-primary/10 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-muted-foreground">Biggest Weakness</p>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <div className="text-lg font-bold mt-2 text-balance leading-tight">STAR Structure & Rambling</div>
          </CardContent>
        </Card>
        <Card className="border-primary/10 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-muted-foreground">Improvement Trend</p>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-500 mt-2">+12%</div>
            <p className="text-xs text-muted-foreground mt-1">confidence boost</p>
          </CardContent>
        </Card>
      </div>

      {/* INTERVIEW LIST */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-heading">Recent Reports</h2>
        <div className="grid gap-4">
          {mockInterviews.map((interview) => (
            <Card key={interview.id} className="overflow-hidden transition-all hover:border-primary/50 hover:shadow-md cursor-default">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <FileAudio className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{interview.role} Interview</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {interview.date}</span>
                      <span>•</span>
                      <span>{interview.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-4 sm:mt-0">
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-muted-foreground font-medium">Score</span>
                    <span className="text-2xl font-bold text-primary">{interview.score}%</span>
                  </div>
                  <Link href={`/results/${interview.id}`} className="w-full sm:w-auto">
                    <Button variant="default" className="w-full sm:w-auto shadow-sm">View Report</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}

          {/* Empty state for demo */}
          <Card className="border-dashed bg-transparent border-2 border-muted-foreground/30 mt-4 max-w-3xl mx-auto w-full">
            <CardContent className="flex flex-col items-center justify-center p-10 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">Analyze another interview</h3>
              <p className="text-muted-foreground text-sm max-w-sm mb-6">Upload your latest audio or video to see if you improved on your weaknesses.</p>
              <Link href="/analyze">
                <Button variant="secondary" className="border shadow-sm">Upload Recording</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
