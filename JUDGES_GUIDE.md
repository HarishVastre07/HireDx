# 🏥 HireDx: AI-Powered Interview Rejection Analysis

> **"Uncover the hidden signals that cost you the offer."**

HireDx is a multimodal debrief platform that analyzes interview recordings to identify specific behavioral, structural, and speech-pattern errors. Using the power of Gemini 2.5, it provides a "post-mortem" of the interview, highlighting exactly where confidence dropped or clarity was lost.

---

## 🛠️ Technology Stack & AI Tools

### Core Frameworks
- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4.0 (Modern, utility-first CSS)
- **UI Components**: Shadcn/UI (Built on Radix UI)
- **Visualizations**: Recharts (Dynamic interactive charts)
- **State Management**: React 19 Hooks

### Backend & Infrastructure
- **Database**: Supabase (PostgreSQL with JSONB for flexible reports)
- **Authentication**: Supabase Auth (Email/Password)
- **Deployment**: Vercel (Optimized for Next.js)

### AI & Analysis Architecture
- **Multimodal AI**: **Google Gemini 2.5 Flash / Lite**
    - Processes raw audio/video files directly without separate transcription steps.
    - Extracts pacing, filler word frequency, and structural scores in a single request.
- **Dynamic Reasoning**: Custom logic to generate **Targeted Practice Banks** and **Action Roadmaps** based on specific failure patterns.

---

## 🏃‍♂️ How to Run on your Machine

Follow these steps to set up the project locally for evaluation.

### 1. Requirements
- Node.js 20+ installed.
- Access to the internet (for API connection).

### 2. Initialization
```bash
git clone <your-repo-link>
cd hiredx
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```
*(If you are evaluating the **Demo Mode**, these keys are optional as the fallback data will kick in).*

### 4. Database Setup (Optional for Demo)
If you wish to test live persistence, run the SQL script found in `supabase/migrations/0000_init.sql` inside your Supabase SQL Editor.

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 How to Deploy (Free)

1.  **Hosting**: Push the repository to GitHub and link it to **Vercel**.
2.  **Database**: Provision a free instance at **Supabase**.
3.  **AI**: Generate a free API key at **Google AI Studio**.
4.  **Wiring**: Add the credentials to Vercel's "Environment Variables" settings and redeploy.

---

## 🎯 Evaluation Checklist
- [ ] **Executive Overview**: View the overall interview score and rejection probability.
- [ ] **Rejection Heatmap**: Explore the chronological "Time of Failure" log.
- [ ] **Action Roadmap**: Select a track (Intensive, Balanced, etc.) or create a **Custom 1-90 day plan**.
- [ ] **Practice Bank**: Click "Generate My Questions" to see AI-generated targeted drills based on failures.
