'use client';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';
import { Target, TrendingUp, AlertTriangle, FileAudio, Play, Sparkles, CheckCircle2, XCircle, MessageSquare, StopCircle, Gauge, Activity, Compass, Clock, BookOpen, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

// --- FALLBACK DEMO DATA WITH NEW PS6 SCHEMA ---
const defaultFillerData = [
  { name: 'umm', count: 24 },
  { name: 'like', count: 18 },
  { name: 'uh', count: 12 },
  { name: 'basically', count: 7 },
  { name: 'you know', count: 5 },
];

const defaultWeaknessData = [
  { name: 'Rambling / No Structure', value: 85, severity: 'High' },
  { name: 'Lack of Specific Examples', value: 75, severity: 'High' },
  { name: 'Defensiveness', value: 60, severity: 'Medium' },
  { name: 'Low Technical Depth', value: 40, severity: 'Medium' },
  { name: 'Pacing (Too Fast)', value: 20, severity: 'Low' },
];
const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];

const defaultSkillData = [
  { subject: 'Clarity', A: 60, fullMark: 100 },
  { subject: 'Depth', A: 85, fullMark: 100 },
  { subject: 'Structure', A: 50, fullMark: 100 },
  { subject: 'Confidence', A: 70, fullMark: 100 },
  { subject: 'Relevance', A: 90, fullMark: 100 },
  { subject: 'Delivery', A: 65, fullMark: 100 },
];

const defaultTimelineData = [
  { time: "0:00", label: "Intro", type: "success", pos: 5 },
  { time: "1:20", label: "Resume Pitch", type: "success", pos: 15 },
  { time: "2:45", label: "Ambiguity Question", type: "error", pos: 30 },
  { time: "5:10", label: "Rambling", type: "warning", pos: 50 },
  { time: "8:20", label: "System Design", type: "success", pos: 70 },
  { time: "11:45", label: "Defensive Tone", type: "error", pos: 90 },
];

const defaultQna = [
  {
    q: "Tell me about a time you had to deal with ambiguity.",
    category: "Behavioral",
    myAnswer: "Umm, yeah, so I was basically working on this feature and like, no one knew what to do. So I uh, I just started coding and umm eventually it worked out.",
    score: 40,
    confidenceScore: 35,
    wpm: 140,
    pauses: 5,
    wrong: "Extremely weak STAR structure. You failed to outline the exact Action you took or the specific Result. Overuse of filler words signals severe lack of confidence.",
    winning: "In my previous role, we were tasked with migrating a legacy service without documentation. I took the initiative to map the architecture, drafted a plan, and reduced transition time by 20%.",
    highlightWords: ["Umm,", "basically", "like,", "uh,", "umm"],
  },
  {
    q: "How do you handle scaling a database for high read traffic?",
    category: "Technical",
    myAnswer: "I would probably use a cache. Maybe Redis. And add more instances if it gets slow.",
    score: 65,
    confidenceScore: 60,
    wpm: 125,
    pauses: 2,
    wrong: "Technically correct, but lacked scalability and ownership depth expected for this role. Did not mention read replicas, indexing strategies, or cache invalidation.",
    winning: "I would implement a caching layer using Redis. If traffic grows, I'd introduce read replicas. Additionally, I'd analyze slow queries and optimize indexing, ensuring proper cache invalidation.",
    highlightWords: ["probably", "Maybe"],
  },
  {
    q: "Describe a time you received critical feedback you disagreed with.",
    category: "Behavioral",
    myAnswer: "Uh, one time someone said my code was messy. I was confused because it worked fine. I just ignored it basically and moved on.",
    score: 25,
    confidenceScore: 80,
    wpm: 150,
    pauses: 1,
    wrong: "Shows extreme defensiveness and an inability to accept constructive criticism or grow from code reviews. A major red flag for collaboration.",
    winning: "A reviewer once pointed out my code wasn't following conventions. Initially I disagreed, but after discussing it, I realized standardizing our patterns was crucial for long-term maintainability. I thanked them and refactored.",
    highlightWords: ["Uh,", "basically"],
  },
  {
    q: "What is your experience with CI/CD pipelines?",
    category: "Technical",
    myAnswer: "So essentially I push code to Github and then GitHub Actions does the rest. I don't really touch the YAML files much.",
    score: 50,
    confidenceScore: 55,
    wpm: 110,
    pauses: 3,
    wrong: "Dismissive attitude toward DevOps responsibilities. Missed opportunity to discuss testing, staging, and deployment safety.",
    winning: "I utilize GitHub Actions for our CI/CD workflows. I've configured pipelines that run our unit test suite, build docker images, and automatically deploy to our staging environment upon merge.",
    highlightWords: ["essentially", "don't really"],
  },
  {
    q: "Why do you want to work here?",
    category: "Behavioral",
    myAnswer: "I heard you guys pay well and you know, the stock is doing great. Plus I kinda need a new job right now.",
    score: 20,
    confidenceScore: 90,
    wpm: 160,
    pauses: 0,
    wrong: "Self-centered and purely transactional. Shows absolutely zero interest in the product, the mission, or the company culture.",
    winning: "I've been following your recent launch of the V2 architecture. I'm deeply passionate about scaling distributed systems, and I want to bring my background in optimization to help solve your current data challenges.",
    highlightWords: ["you know,", "kinda right now."],
  }
];

const defaultImprovementPlan = [
  {
    timeline: "Week 1",
    focus: "Eradicate Rambling (STAR Method Mastery)",
    actionableTasks: [
      "Write down 5 core career stories in strict Situation-Task-Action-Result format.",
      "Practice delivering them out loud in under 2 minutes each with a stopwatch."
    ]
  },
  {
    timeline: "Week 2",
    focus: "Technical Depth & Assertiveness",
    actionableTasks: [
      "Stop using hedging words ('probably', 'maybe'). State technical decisions as facts.",
      "Always append the 'Why' and the 'Trade-offs' to any architectural answer."
    ]
  },
  {
    timeline: "Week 3",
    focus: "Pacing and Pause Control",
    actionableTasks: [
      "Record yourself answering random behavioral questions.",
      "Force a 2-second silent pause before answering instead of immediately using 'Um' or 'Uh'."
    ]
  },
  {
    timeline: "Week 4",
    focus: "Mock Interview Marathon",
    actionableTasks: [
      "Conduct two full 45-minute mock interviews simulating real pressure.",
      "Review the recordings exclusively for tone of voice, posture, and confident delivery."
    ]
  }
];

// Helper to mathematically guarantee Heatmap positions are perfectly scaled 0-100%
const normalizePositions = (timeline: any[]) => {
  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) return [];
  const maxIdx = timeline.length > 1 ? timeline.length - 1 : 1;
  
  return timeline.map((t, idx) => {
    // Strictly force a beautiful, even distribution to prevent AI hallucination (like 225%)
    // Items will naturally step across the width of the display.
    const calculatedPos = Math.round((idx / maxIdx) * 100);
    return {
      ...t,
      pos: calculatedPos
    };
  });
};

// ─── Roadmap Plan Selector Sub-Component ────────────────────────────────────
type PlanId = 'intensive' | 'balanced' | 'gentle';

const PLANS: Record<PlanId, {
  id: PlanId; label: string; duration: string; tagline: string; icon: string;
  accentClass: string; borderClass: string; badgeClass: string; description: string;
  weeks: { week: string; focus: string; tasks: string[] }[];
}> = {
  intensive: {
    id: 'intensive', label: 'Intensive Track', duration: '12 Weeks',
    tagline: 'For scores below 45 — complete rebuild', icon: '🔥',
    accentClass: 'text-red-500', borderClass: 'border-red-500/40', badgeClass: 'bg-red-500/10 text-red-500 border-red-500/30',
    description: 'A rigorous 12-week programme with daily drills, structured coaching, and progressive challenges. Built for candidates who need a full interview skill overhaul.',
    weeks: [
      { week: 'Week 1', focus: 'Awareness & Baseline', tasks: ['Re-read every "What Went Wrong" entry in your Transcript tab and write each mistake in a journal.', 'Record a 3-minute self-introduction and watch it back — note every filler word and dead silence.'] },
      { week: 'Week 2', focus: 'Eliminating Filler Words', tasks: ['Identify your top 3 filler words from this report. Tap a counter app every time you catch yourself saying one.', 'Practice the "silent pause" — replace "Um" with 2 seconds of deliberate silence before answering.'] },
      { week: 'Week 3', focus: 'STAR Method Foundation', tasks: ['Write 5 career stories in strict Situation-Task-Action-Result format. No narrative drift allowed.', 'Deliver each story in exactly 90 seconds. Time yourself and cut ruthlessly if you go over.'] },
      { week: 'Week 4', focus: 'STAR Method Drilling', tasks: ['Expand your story bank to 10 STAR stories covering conflict, failure, leadership, and impact scenarios.', 'Practice with a partner or record yourself — check that the Result is always specific and quantifiable.'] },
      { week: 'Week 5', focus: 'Technical Depth', tasks: ['For every technical question answer, add: "I chose this because… The trade-off is…"', 'Study one system design concept per day (caching, replication, load balancing, sharding). 30-min sessions.'] },
      { week: 'Week 6', focus: 'Technical Assertiveness', tasks: ['Remove all hedging language: "I think", "maybe", "probably". State decisions as facts.', 'Practice explaining a past technical decision end-to-end: problem → options considered → decision → outcome.'] },
      { week: 'Week 7', focus: 'Pacing & Vocal Confidence', tasks: ['Record 5 behavioral answers. Listen back and verify your WPM stays between 120–150 throughout.', 'Consciously lower your pitch slightly at the end of sentences — rising intonation signals uncertainty.'] },
      { week: 'Week 8', focus: 'Role Alignment', tasks: ['For each question from your report, rewrite your answer specifically tailored to the job description you are targeting.', 'Study the company\'s engineering blog or product. Reference their actual work in your answers.'] },
      { week: 'Week 9', focus: 'Behavioral Mastery', tasks: ['Practice "Tell me about a failure" until you can deliver it with composure and a clear learning outcome.', 'Prepare a concise 60-second closing statement for "Do you have any questions?" that shows strategic thinking.'] },
      { week: 'Week 10', focus: 'First Mock Simulations', tasks: ['Complete two 45-minute mock interviews on Pramp or with a peer at full pressure — no pausing or restarting.', 'Score yourself on each dimension from this report: Clarity, Depth, Confidence, Structure, Relevance, Delivery.'] },
      { week: 'Week 11', focus: 'Review & Targeted Re-Drilling', tasks: ['Identify the 2 lowest-scoring dimensions from your mock reviews. Drill those specific skills for 3 days each.', 'Re-record your 3-minute introduction from Week 1 and compare — measure the improvement objectively.'] },
      { week: 'Week 12', focus: 'Final Polish & Readiness', tasks: ['Complete one full 60-minute interview simulation under maximum pressure with a strict timer.', 'Review the recording exclusively for tone, posture, and executive presence. You are now ready.'] },
    ]
  },
  balanced: {
    id: 'balanced', label: 'Balanced Track', duration: '8 Weeks',
    tagline: 'For scores 45–69 — sharpen specific weak points', icon: '⚡',
    accentClass: 'text-yellow-500', borderClass: 'border-yellow-500/40', badgeClass: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
    description: 'An 8-week targeted programme focused on your identified weak areas. You have a solid foundation — this track sharpens the edges that cost you the offer.',
    weeks: [
      { week: 'Week 1', focus: 'Gap Analysis & Prioritisation', tasks: ['List the 3 "High Severity" weaknesses from your Analytics tab. These are your entire focus for the next 4 weeks.', 'Re-answer every question scored below 60 using the "Winning Answer" shown in your Transcript tab as a guide.'] },
      { week: 'Week 2', focus: 'Answer Structure Overhaul', tasks: ['Force every answer to include one specific metric or data point (%, time saved, revenue impact, team size).', 'Record yourself answering 5 behavioral questions. Check that every answer has a clear Situation, Action, and Result.'] },
      { week: 'Week 3', focus: 'Confidence & Pacing', tasks: ['Practice the deliberate pause — breathe silently for 2 seconds before each answer instead of filling with "Um".', 'Verify your speaking pace is 120–150 WPM. Record yourself and use a WPM counter tool to measure it precisely.'] },
      { week: 'Week 4', focus: 'Technical Precision', tasks: ['For any technical answer, always state the trade-off alongside your decision: "I used X because Y, but the cost is Z."', 'Prepare 3 concise technical stories from your experience: one debugging win, one architecture decision, one performance optimization.'] },
      { week: 'Week 5', focus: 'Role-Specific Alignment', tasks: ['Rewrite your 3 weakest answers to explicitly connect your experience to the target role\'s responsibilities.', 'Research 2 recent technical decisions the company has made publicly and reference them naturally in your answers.'] },
      { week: 'Week 6', focus: 'Behavioural Depth', tasks: ['Expand your story bank with 5 new STAR stories covering: conflict, failure, influence without authority, ambiguity, and learning from feedback.', 'Practice delivering each story in under 2 minutes with a specific quantified result every time.'] },
      { week: 'Week 7', focus: 'Mock Interviews', tasks: ['Complete two 30-minute mock interviews on Pramp or with a peer. Use real questions — no soft-ball prompts.', 'Grade yourself on the 6 dimensions shown in your Analytics radar chart. Target above 70 on all of them.'] },
      { week: 'Week 8', focus: 'Final Review & Confidence Lock-In', tasks: ['Re-record your answers to the 3 questions you scored lowest on in your original report. Compare them side-by-side.', 'Do one final full 45-minute pressure simulation. If you score above 70 in your self-assessment, you are ready.'] },
    ]
  },
  gentle: {
    id: 'gentle', label: 'Polish Track', duration: '4 Weeks',
    tagline: 'For scores 70+ — close the final gap', icon: '✨',
    accentClass: 'text-green-500', borderClass: 'border-green-500/40', badgeClass: 'bg-green-500/10 text-green-500 border-green-500/30',
    description: "You're already performing at a high level. This 4-week track focuses on executive presence, narrative mastery, and eliminating the final performance ceiling.",
    weeks: [
      { week: 'Week 1', focus: 'Narrative Elevation', tasks: ['Elevate your 3 strongest career stories — add a turning point, an emotional stake, and a clear quantified result.', 'Record yourself and listen for any remaining hedging language ("I think", "kind of", "sort of"). Eliminate all of it.'] },
      { week: 'Week 2', focus: 'Specificity & Impact', tasks: ['Audit every answer for vague language. Replace any remaining generalities with specific names, numbers, and outcomes.', 'Prepare a 90-second "Why this company?" answer that references a specific product, decision, or engineering challenge they have publicly faced.'] },
      { week: 'Week 3', focus: 'Executive Communication', tasks: ['Practice the bottom-line-up-front (BLUF) technique: give your conclusion first, then the story. This is how senior candidates communicate.', 'Record a full mock answer and evaluate it exclusively for tone: is it calm, deliberate, and authoritative throughout?'] },
      { week: 'Week 4', focus: 'Full Simulation & Sign-Off', tasks: ['Complete one full 60-minute pressure interview simulation. Aim for zero filler words across the entire session.', 'Review only for executive presence: composure under pressure, confident pauses, and decisive language. If these feel natural, you are ready to interview.'] },
    ]
  },
};

// Task pool for dynamic custom plan generation
const CUSTOM_TASK_POOL: { focus: string; tasks: string[] }[] = [
  { focus: 'Awareness & Baseline', tasks: ['Re-read every "What Went Wrong" entry in your Transcript tab and journal each mistake.', 'Record a 3-minute self-introduction and watch it back — note every filler word.'] },
  { focus: 'Filler Word Elimination', tasks: ['Replace "Um/Uh" with a deliberate 2-second silent pause before every answer.', 'Tap a counter app each time you catch yourself using a filler word during practice.'] },
  { focus: 'STAR Method Foundation', tasks: ['Write 5 career stories in strict Situation-Task-Action-Result format.', 'Deliver each story in exactly 90 seconds. Cut ruthlessly if you go over.'] },
  { focus: 'Technical Depth', tasks: ['Append "I chose this because… the trade-off is…" to every technical answer.', 'Study one system design concept per day (caching, replication, sharding). 30 min sessions.'] },
  { focus: 'Answer Structure & Specificity', tasks: ['Force every answer to include one specific metric or data point.', 'Re-answer every question scored below 60 using the "Winning Answer" from your Transcript tab.'] },
  { focus: 'Confidence & Pacing', tasks: ['Record 5 behavioral answers — verify your WPM stays between 120–150.', 'Consciously lower your pitch at the end of sentences. Rising intonation signals uncertainty.'] },
  { focus: 'Technical Assertiveness', tasks: ['Remove all hedging: "I think", "maybe", "probably". State decisions as confident facts.', 'Practice explaining a past technical decision end-to-end: problem → options → decision → outcome.'] },
  { focus: 'Role-Specific Alignment', tasks: ["Rewrite your 3 weakest answers to connect explicitly to the target role's responsibilities.", 'Research 2 recent company engineering decisions and reference them naturally in answers.'] },
  { focus: 'Behavioural Depth', tasks: ['Add 5 new STAR stories: conflict, failure, ambiguity, influence, and learning from feedback.', 'Practice each story in under 2 minutes with a specific quantified result every time.'] },
  { focus: 'Narrative Elevation', tasks: ['Add a turning point, emotional stake, and quantified result to your 3 strongest career stories.', 'Record yourself and ensure answers sound prepared, not improvised.'] },
  { focus: 'Executive Communication', tasks: ['Practice BLUF: give your conclusion first, then the supporting story.', 'Record a mock answer and grade it: calm, deliberate, and authoritative throughout?'] },
  { focus: 'Mock Interview Simulation', tasks: ['Complete a 30-minute mock interview on Pramp or with a peer at full pressure.', 'Grade yourself on all 6 dimensions from your Analytics radar chart. Target 70+ on each.'] },
  { focus: 'Review & Re-Drilling', tasks: ['Identify your 2 lowest-scoring dimensions from mock feedback. Drill those for 3 days each.', 'Re-record your weakest answers from the original report and compare side-by-side.'] },
];

function generateCustomWeeks(days: number): { week: string; focus: string; tasks: string[] }[] {
  const numWeeks = days < 7 ? 1 : Math.ceil(days / 7);
  const useDay = days < 7; // label as "Day N" for short sprints, "Week N" for longer plans
  return Array.from({ length: numWeeks }, (_, i) => {
    const pool = CUSTOM_TASK_POOL[i % CUSTOM_TASK_POOL.length];
    const label = useDay ? `Day ${i + 1}` : `Week ${i + 1}`;
    return { week: label, focus: pool.focus, tasks: pool.tasks };
  });
}

type SelectionMode = PlanId | 'custom';

function RoadmapSelector({ score }: { score: number }) {
  const recommended: PlanId = score < 45 ? 'intensive' : score < 70 ? 'balanced' : 'gentle';
  const [selection, setSelection] = useState<SelectionMode>(recommended);
  const [customDays, setCustomDays] = useState(30);

  const isCustom = selection === 'custom';
  const customWeeks = generateCustomWeeks(customDays);
  const activeWeeks  = isCustom ? customWeeks : PLANS[selection as PlanId].weeks;
  const activeBorder = isCustom ? 'border-purple-500/40' : PLANS[selection as PlanId].borderClass;
  const activeAccent = isCustom ? 'text-purple-400'    : PLANS[selection as PlanId].accentClass;
  const activeLabel  = isCustom ? 'Custom Plan'        : PLANS[selection as PlanId].label;
  const activeIcon   = isCustom ? '🗓️'                : PLANS[selection as PlanId].icon;
  const activeDesc   = isCustom
    ? `A ${customDays}-day personalised plan (${customWeeks.length === 1 ? '1 focused week' : `${customWeeks.length} weeks`}) built around your schedule.`
    : PLANS[selection as PlanId].description;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold font-heading mb-2">Choose Your Recovery Track</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Based on your score of <span className="font-bold text-foreground">{score}/100</span>, we recommend the{' '}
          <span className={`font-bold ${PLANS[recommended].accentClass}`}>{PLANS[recommended].label}</span>.
        </p>

        {/* 4-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.values(PLANS) as typeof PLANS[PlanId][]).map((plan) => (
            <button key={plan.id} onClick={() => setSelection(plan.id)}
              className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer
                ${selection === plan.id ? `${plan.borderClass} bg-card shadow-lg scale-[1.02]` : 'border-border bg-card/40 hover:border-muted-foreground/40'}`}>
              {plan.id === recommended && (
                <span className={`absolute -top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full border ${plan.badgeClass}`}>★ Recommended</span>
              )}
              <div className="text-3xl mb-3">{plan.icon}</div>
              <h3 className={`font-bold text-sm font-heading ${selection === plan.id ? plan.accentClass : 'text-foreground'}`}>{plan.label}</h3>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{plan.duration}</p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">{plan.description}</p>
            </button>
          ))}

          {/* Custom card */}
          <button onClick={() => setSelection('custom')}
            className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer
              ${isCustom ? 'border-purple-500/40 bg-card shadow-lg scale-[1.02]' : 'border-border bg-card/40 hover:border-muted-foreground/40'}`}>
            <div className="text-3xl mb-3">🗓️</div>
            <h3 className={`font-bold text-sm font-heading ${isCustom ? 'text-purple-400' : 'text-foreground'}`}>Custom Plan</h3>
            <p className="text-xs text-muted-foreground mt-1 font-medium">8 – 90 days</p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Set your own timeline. Weekly breakdown generated automatically.</p>
          </button>
        </div>

        {/* Slider — only when custom selected */}
        {isCustom && (
          <div className="mt-6 p-5 rounded-2xl border-2 border-purple-500/30 bg-purple-500/5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Select your preparation window</span>
              <span className="text-2xl font-bold font-heading text-purple-400">{customDays} days</span>
            </div>
            <input type="range" min={1} max={90} step={1} value={customDays}
              onChange={(e) => setCustomDays(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-purple-500 bg-muted" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 day</span>
              <span className="font-medium text-purple-400">→ {customWeeks.length} week{customWeeks.length > 1 ? 's' : ''} generated</span>
              <span>90 days</span>
            </div>
          </div>
        )}
      </div>

      {/* Active plan detail */}
      <Card className={`border-2 ${activeBorder} shadow-lg bg-card/50`}>
        <CardHeader className="text-center pb-8 border-b border-border/50 bg-muted/20 rounded-t-xl">
          <div className="text-5xl mb-3">{activeIcon}</div>
          <CardTitle className={`text-3xl font-heading ${activeAccent}`}>{activeLabel}</CardTitle>
          <CardDescription className="text-base mt-2 max-w-lg mx-auto">{activeDesc}</CardDescription>
        </CardHeader>
        <CardContent className="p-8 md:p-12">
          <div className="relative">
            <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent rounded-full" />
            <div className="space-y-12">
              {activeWeeks.map((week, idx) => (
                <div key={idx} className="relative pl-16">
                  <div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-primary shadow-[0_0_15px_hsl(var(--primary))] ring-4 ring-background" />
                  <h3 className="text-sm font-bold tracking-widest text-primary uppercase mb-1">{week.week}</h3>
                  <h4 className="text-2xl font-bold font-heading mb-4 text-foreground">{week.focus}</h4>
                  <div className="space-y-3">
                    {week.tasks.map((task, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-3 bg-muted/40 p-4 rounded-xl border border-muted/50 hover:border-primary/30 hover:bg-muted/60 transition-colors">
                        <BookOpen className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-foreground/90">{task}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [practiceQuestions, setPracticeQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!params.id || typeof params.id !== 'string') return;
      
      // 1. Check if it's a UUID (Supabase persistent row)
      if (params.id.length === 36 && params.id.includes('-')) {
         try {
           const supabase = createClient();
           const { data: dbRow, error } = await supabase.from('interviews').select('report_data').eq('id', params.id).single();
           if (dbRow && !error) {
             setData(dbRow.report_data);
             return;
           }
         } catch(e) {
           console.error("Failed fetching Supabase history:", e);
         }
      }

      // 2. Check if it's a local unauthenticated analysis session
      if (params.id.startsWith("real_analysis_")) {
         const savedRaw = localStorage.getItem(`hiredx_${params.id}`);
         if (savedRaw) {
            try {
              const parsed = JSON.parse(savedRaw);
              setData(parsed);
              return;
            } catch(e) {}
         }
      }

      // Fallback
      setData({
        overallScore: 42,
        fillerData: defaultFillerData,
        weaknessData: defaultWeaknessData,
        skillData: defaultSkillData,
        timelineData: defaultTimelineData,
        qna: defaultQna,
        improvementPlan: defaultImprovementPlan
      });
    }

    loadData();
  }, [params.id]);

  if (!data) return <div className="p-20 text-center text-muted-foreground flex justify-center items-center gap-2"><Loader2 className="animate-spin w-5 h-5"/> Compiling Report...</div>;

  const { overallScore, fillerData, weaknessData, skillData, timelineData, qna, improvementPlan } = data;

  // Derive Confidence Trend with fallback to standard score if user is viewing older cached data
  const confidenceTrend = (qna || []).map((q: any, i: number) => ({
    name: `Q${i+1}`,
    score: q.confidenceScore || q.score || 0,
    category: q.category || 'Unknown'
  }));

  const normalizedTimeline = normalizePositions(timelineData);

  // Rejection Probability math (Inverse of overall score roughly)
  const rejectionProb = Math.max(0, 100 - overallScore);
  const scoreColor = overallScore >= 75 ? 'text-green-500' : overallScore >= 50 ? 'text-yellow-500' : 'text-destructive';

  return (
    <div className="flex flex-col min-h-screen bg-muted/10">
      <Navbar />
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-0">Analyzed Recording</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1"><FileAudio className="w-4 h-4"/> secure_session.mp4</span>
            </div>
            <h1 className="text-4xl font-bold font-heading mb-2">Rejection Analysis Report</h1>
            <p className="text-muted-foreground">Deep behavioral and speech analytics breakdown.</p>
          </div>
          
          <div className="flex items-center gap-6 bg-card border rounded-2xl p-4 shadow-sm">
             {/* Circular Gauge UI */}
             <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-muted" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" 
                    strokeDasharray={`${overallScore * 2.51} 251.2`} 
                    className={overallScore >= 75 ? 'text-green-500' : overallScore >= 50 ? 'text-yellow-500' : 'text-destructive'} 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-bold font-heading ${scoreColor}`}>{overallScore}</span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Score</span>
                </div>
             </div>
             
             <div className="space-y-1">
                <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Rejection Probability</div>
                <div className={`text-3xl font-bold ${rejectionProb > 50 ? 'text-destructive' : 'text-green-500'}`}>{rejectionProb}%</div>
             </div>
          </div>
        </div>

        {/* CUSTOM TABS NAVIGATION */}
        <div className="flex overflow-x-auto border-b bg-card rounded-t-xl px-2 pt-2 gap-2 hide-scrollbar">
           <button onClick={() => setActiveTab('overview')} className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
             <Gauge className="w-4 h-4"/> Executive Overview
           </button>
           <button onClick={() => setActiveTab('transcript')} className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'transcript' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
             <MessageSquare className="w-4 h-4"/> Transcript & QnA
           </button>
           <button onClick={() => setActiveTab('analytics')} className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
             <Activity className="w-4 h-4"/> Deep Analytics
           </button>
           <button onClick={() => setActiveTab('roadmap')} className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'roadmap' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
             <Compass className="w-4 h-4"/> Action Roadmap
           </button>
           <button onClick={() => setActiveTab('practice')} className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'practice' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
             <Target className="w-4 h-4"/> Practice Bank
             <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">NEW</span>
           </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="min-h-[500px]">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               
               {/* 1A. Heatmap Timeline */}
               {(!normalizedTimeline || normalizedTimeline.length === 0) ? (
                  <Card className="border-border shadow-sm flex items-center justify-center h-32 bg-muted/20">
                    <p className="text-muted-foreground text-sm font-semibold">Timeline not available for this older specific session.</p>
                  </Card>
               ) : (
                <Card className="border-primary/20 shadow-xl overflow-hidden bg-gradient-to-br from-card to-muted/10 relative">
                  {/* Subtle glass glow overlay */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <CardHeader className="bg-background/80 pb-4 border-b backdrop-blur-md">
                    <CardTitle className="flex items-center gap-2 text-xl font-heading">
                      <TrendingUp className="text-primary w-5 h-5"/> Rejection Heatmap Timeline
                    </CardTitle>
                    <CardDescription>Chronological breakdown identifying exact moments where points were lost.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 relative z-10">
                    <div className="relative">
                      <div className="absolute left-[22px] top-3 bottom-4 w-1 bg-border rounded-full" />
                      <div className="space-y-2">
                        {normalizedTimeline.map((item: any, i: number) => {
                          const dotBg   = item.type === 'error'   ? 'bg-destructive shadow-[0_0_10px_hsl(var(--destructive))]'  : item.type === 'success' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]'  : 'bg-yellow-500 shadow-[0_0_10px_#eab308]';
                          const badge   = item.type === 'error'   ? 'bg-destructive/10 text-destructive border-destructive/20'
                                        : item.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                        :                           'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
                          const icon    = item.type === 'error'   ? '✕' : item.type === 'success' ? '✓' : '~';

                          return (
                            <div key={i} className="flex items-start gap-4 group py-2 px-2 rounded-xl hover:bg-muted/50 transition-all duration-300">
                              <div className={`relative z-10 w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-[16px] shadow-sm ring-4 ring-background ${dotBg}`}>
                                {icon}
                              </div>
                              <div className="flex-1 min-w-0 pt-1.5 w-full">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-bold text-foreground text-sm tracking-wide">{item.label}</span>
                                  <span className={`text-xs font-mono border rounded px-2 py-0.5 font-bold ${badge}`}>
                                    {item.time || '--:--'}
                                  </span>
                                </div>
                                <div className="w-full mt-2 h-1.5 rounded-full bg-muted overflow-hidden relative">
                                  {/* Ensure the bar cap doesn't exceed 100% visually */}
                                  <div className={`absolute top-0 left-0 h-full rounded-full ${dotBg} opacity-80 transition-all duration-1000`} style={{ width: `${Math.min(100, Math.max(2, item.pos))}%` }} />
                                </div>
                                {i > 0 && <p className="text-[11px] text-muted-foreground mt-1 font-semibold uppercase">{item.pos}% through interview</p>}
                                {i === 0 && <p className="text-[11px] text-muted-foreground mt-1 font-semibold uppercase">Interview Start</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
               )}

               {/* 1B. Skill Breakdown Linear Progress */}
               <Card className="border-primary/10 shadow-xl bg-gradient-to-tr from-card to-muted/10">
                  <CardHeader className="bg-background/80 pb-4 border-b backdrop-blur-md">
                    <CardTitle className="flex items-center gap-2 text-xl font-heading"><Target className="text-primary w-5 h-5"/> Skill Breakdown</CardTitle>
                    <CardDescription>Core competencies evaluated against ideal role expectations.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px] flex flex-col justify-center space-y-6 px-8 py-6">
                    {(skillData || []).map((skill: any, idx: number) => {
                      const val = skill.A || 0;
                      // Determine gradient glow based on score
                      const cColor = val >= 75 ? 'bg-green-500 shadow-[0_0_12px_#22c55e88]' : val >= 50 ? 'bg-yellow-500 shadow-[0_0_12px_#eab30888]' : 'bg-destructive shadow-[0_0_12px_hsl(var(--destructive)/0.5)]';
                      return (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-semibold tracking-wide text-foreground/90">{skill.subject}</span>
                            <span className="font-mono text-muted-foreground font-bold">{val}/100</span>
                          </div>
                          <div className="w-full h-3 bg-muted/60 rounded-full overflow-hidden shadow-inner">
                             <div className={`h-full ${cColor} rounded-full transition-all duration-1000`} style={{ width: `${val}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
               </Card>

            </div>
          )}

          {/* TAB 2: TRANSCRIPT */}
          {activeTab === 'transcript' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               {(qna || []).map((item: any, index: number) => {
                 
                 // Superior Regex Highlighter that respects boundaries and punctuation
                 const renderText = (text: string) => {
                    if (!item.highlightWords || item.highlightWords.length === 0) return text;
                    
                    // Clean highlight words: strip trailing/leading punctuation from the array elements
                    const cleanWords = item.highlightWords.map((w: string) => w.replace(/^[^\w]+|[^\w]+$/g, ''));
                    if (cleanWords.length === 0) return text;
                    
                    const safeWords = cleanWords.map((sw: string) => sw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
                    // Match the words with word boundaries, capturing potential trailing punctuation inside the split so it's preserved
                    const splitRegex = new RegExp(`\\b(${safeWords.join('|')})\\b`, 'gi');
                    
                    const parts = text.split(splitRegex);
                    
                    return parts.map((part, i) => {
                      // Because we captured the word natively, we can just check if part strictly matches (case-insensitive) one of our raw words
                      const isMatch = safeWords.some((sw: string) => new RegExp(`^${sw}$`, 'i').test(part));
                      return isMatch
                        ? <span key={i} className="bg-yellow-500/20 text-yellow-500 font-bold border-b-2 border-yellow-500/50 px-0.5 rounded-sm mx-[0.5px]">{part}</span> 
                        : part;
                    });
                 };

                return (
                  <Card key={index} className="overflow-hidden border-border/50">
                    <CardHeader className="bg-card border-b p-4">
                      {/* Micro-metrics Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="bg-primary/5">{item.category || "General"}</Badge>
                        {item.wpm && <Badge variant="outline" className="bg-muted text-muted-foreground"><Clock className="w-3 h-3 mr-1"/> {item.wpm} WPM</Badge>}
                        {item.pauses !== undefined && <Badge variant="outline" className="bg-muted text-muted-foreground"><StopCircle className="w-3 h-3 mr-1"/> {item.pauses} Pauses</Badge>}
                        {item.confidenceScore && <Badge variant="outline" className={item.confidenceScore > 65 ? "text-green-500" : "text-yellow-500"}><Activity className="w-3 h-3 mr-1"/> {item.confidenceScore}% Confidence</Badge>}
                      </div>
                      <CardTitle className="text-xl">Q: {item.q}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b">
                        <div className="p-6 bg-muted/20">
                          <h4 className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2"><FileAudio className="w-4 h-4"/> Your Verbatim Answer</h4>
                          <p className="text-foreground leading-relaxed italic border-l-2 border-primary/40 pl-4">{renderText(item.myAnswer)}</p>
                        </div>
                        <div className="p-6 bg-card">
                          <h4 className="text-sm font-bold text-destructive mb-3 flex items-center gap-2"><XCircle className="w-4 h-4"/> Why You Lost Points</h4>
                          <p className="text-destructive/90 mb-6">{item.wrong}</p>
                          <h4 className="text-sm font-bold text-green-500 mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Ideal Winning Answer</h4>
                          <p className="text-muted-foreground border-l-2 border-green-500/40 pl-4 italic">{item.winning}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
               })}
            </div>
          )}

          {/* TAB 3: DEEP ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               
               <div className="grid md:grid-cols-2 gap-6">
                 {/* Ranked Weaknesses List */}
                 <Card className="border-primary/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive w-5 h-5"/> Ranked Weakness Impact</CardTitle>
                      <CardDescription>Major rejection signals ranked by severity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(weaknessData || []).sort((a:any, b:any) => b.value - a.value).map((w: any, idx: number) => (
                           <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-muted">
                             <span className="font-semibold">{w.name}</span>
                             <Badge variant="outline" className={
                               w.severity === 'High' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                               w.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                               'bg-green-500/10 text-green-500 border-green-500/20'
                             }>{w.severity || 'Medium'}</Badge>
                           </div>
                        ))}
                      </div>
                    </CardContent>
                 </Card>

                 {/* Confidence Trend Chart */}
                 <Card className="border-primary/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Activity className="text-primary w-5 h-5"/> Confidence Trend</CardTitle>
                      <CardDescription>Fluctuations in vocal confidence across questions.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={confidenceTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="name" stroke="#888" />
                          <YAxis domain={[0, 100]} stroke="#888" />
                          <RechartsTooltip contentStyle={{backgroundColor: '#111', borderColor: '#333'}} />
                          <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 4}} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                 </Card>
               </div>

               {/* Filler Words */}
               <Card className="border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageSquare className="text-yellow-500 w-5 h-5"/> Filler Word Frequency</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={fillerData || []} layout="vertical" margin={{ left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                        <XAxis type="number" stroke="#888" />
                        <YAxis dataKey="name" type="category" stroke="#888" width={80} />
                        <RechartsTooltip cursor={{fill: '#222'}} contentStyle={{backgroundColor: '#111', borderColor: '#333'}} />
                        <Bar dataKey="count" fill="#eab308" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
               </Card>
            </div>
          )}

          {/* TAB 4: ROADMAP — Plan Selector */}
          {activeTab === 'roadmap' && (
            <RoadmapSelector score={data?.overallScore ?? 50} />
          )}

          {/* TAB 5: PRACTICE BANK */}
          {activeTab === 'practice' && (
            <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">

              {/* Hero Generate Card */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-3xl">🧩</span>
                      <Badge className="bg-primary/20 text-primary border-0 text-xs font-bold">AI-GENERATED</Badge>
                    </div>
                    <h2 className="text-2xl font-bold font-heading mb-2">Your Personalised Question Bank</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      10 questions generated exclusively from your failure pattern — not generic questions, but ones
                      <span className="text-foreground font-semibold"> calibrated to expose and fix your exact weaknesses.</span>
                    </p>
                  </div>
                  <button
                    disabled={loadingQuestions}
                    onClick={async () => {
                      setLoadingQuestions(true);
                      setQuestionsError(null);
                      setPracticeQuestions([]);
                      try {
                        const res = await fetch('/api/generate-questions', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            weaknesses: data.weaknesses,
                            weaknessData: data.weaknessData,
                            role: data.role_target || 'Software Engineer',
                            qna: data.qna,
                          }),
                        });
                        const json = await res.json();
                        if (json.error) throw new Error(json.error);
                        setPracticeQuestions(json.questions || []);
                      } catch (e: any) {
                        setQuestionsError(e.message);
                      } finally {
                        setLoadingQuestions(false);
                      }
                    }}
                    className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm
                      shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 active:scale-95
                      transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {loadingQuestions ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                    ) : practiceQuestions.length > 0 ? (
                      <><Sparkles className="w-4 h-4" /> Regenerate</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> Generate My Questions</>
                    )}
                  </button>
                </CardContent>
              </Card>

              {/* Error state */}
              {questionsError && (
                <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm">
                  ⚠️ {questionsError}
                </div>
              )}

              {/* Loading skeleton */}
              {loadingQuestions && (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-28 rounded-2xl bg-muted/40 animate-pulse border border-border/40" />
                  ))}
                </div>
              )}

              {/* Question Cards */}
              {!loadingQuestions && practiceQuestions.length > 0 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground font-medium">
                    {practiceQuestions.length} targeted questions generated · sorted by difficulty
                  </p>
                  {practiceQuestions
                    .sort((a: any, b: any) => {
                      const order: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 };
                      return (order[a.difficulty] ?? 1) - (order[b.difficulty] ?? 1);
                    })
                    .map((q: any, idx: number) => {
                      const diffColor = q.difficulty === 'Hard'
                        ? 'text-red-500 bg-red-500/10 border-red-500/20'
                        : q.difficulty === 'Medium'
                        ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
                        : 'text-green-500 bg-green-500/10 border-green-500/20';
                      const catColor = q.category === 'Technical'
                        ? 'text-blue-400 bg-blue-400/10 border-blue-400/20'
                        : 'text-purple-400 bg-purple-400/10 border-purple-400/20';

                      return (
                        <Card key={idx} className="border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden group">
                          <CardContent className="p-0">
                            {/* Question header */}
                            <div className="p-5 pb-4">
                              <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <span className="text-xs font-bold text-muted-foreground w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor}`}>
                                  {q.category}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColor}`}>
                                  {q.difficulty}
                                </span>
                                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/40 ml-auto">
                                  Targets: {q.targetedWeakness}
                                </span>
                              </div>
                              <p className="font-semibold text-base text-foreground leading-snug">{q.question}</p>
                              <p className="text-xs text-muted-foreground mt-2 italic">{q.whyThisQuestion}</p>
                            </div>

                            {/* Hint section */}
                            <details className="group/details">
                              <summary className="px-5 py-3 text-xs font-bold text-primary cursor-pointer border-t border-border/40 bg-primary/5 hover:bg-primary/10 transition-colors flex items-center gap-1.5 list-none">
                                <TrendingUp className="w-3.5 h-3.5" />
                                View Answer Strategy
                                <span className="ml-auto text-muted-foreground group-open/details:rotate-180 transition-transform">▾</span>
                              </summary>
                              <div className="px-5 py-4 bg-muted/20 border-t border-border/40 space-y-2">
                                {(q.answerHint || []).map((hint: string, hIdx: number) => (
                                  <div key={hIdx} className="flex items-start gap-2 text-sm text-foreground/80">
                                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                    <span>{hint}</span>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              )}

              {/* Empty state (before first generation) */}
              {!loadingQuestions && practiceQuestions.length === 0 && !questionsError && (
                <div className="border-2 border-dashed border-muted-foreground/20 rounded-2xl p-12 text-center">
                  <div className="text-5xl mb-4">🧩</div>
                  <h3 className="font-bold text-lg mb-2">Questions not generated yet</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    Click the button above to generate 10 practice questions calibrated to your exact failure pattern.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

      </main>
      <Footer />
    </div>
  );
}
