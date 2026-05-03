# HireDx - Interview Rejection Analysis System

Welcome to **HireDx** - built for DevClash 2026.

## 🚀 Overview
Candidates often finish interviews without knowing why they were rejected. **HireDx** is a multimodal debrief platform where users upload or record interview audio/video to receive detailed AI-powered analysis of exactly why they likely got rejected. 

Through native multimodal processing, we analyze pacing, filler words, structural depth, and emotional confidence to provide a "post-mortem" of the interview.

---

## 🛠️ Tech Stack & AI Tools
- **Framework**: Next.js 15 (App Router)
- **AI Integration**: Google Gemini 2.5 Flash / Lite (Native Audio/Video processing)
- **UI & Styling**: Tailwind CSS 4.0, shadcn/ui, Framer Motion
- **Visualizations**: Recharts
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel

---

## 🏃‍♂️ Evaluation Guide
For ease of evaluation, we have included two detailed guides:

1.  **[JUDGES_GUIDE.md](./JUDGES_GUIDE.md)**: Technical walkthrough to get the project running on your machine and a guide on how to evaluate the core features.
2.  **[DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)**: Detailed, step-by-step instructions to deploy the full system live for free.
3.  **[PRESENTATION_OUTLINE.md](./PRESENTATION_OUTLINE.md)**: A slide-by-slide guide for the final project presentation.

---

## 🔧 Quick Start (Local)

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    Copy `.env.example` to `.env.local` and add your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `GEMINI_API_KEY`.
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Access the Dashboard**:
    Open [http://localhost:3000](http://localhost:3000). Click "View Demo Analysis" to see a fully populated rejection report instantly.

---

## 🔐 Deployment (Free)
HireDx is designed to be deployed for free on **Vercel** and **Supabase**. See the [JUDGES_GUIDE.md](./JUDGES_GUIDE.md) for step-by-step deployment instructions.

---

## 🛡️ Privacy
HireDx follows a **Zero-Retention** policy. Raw media files are processed in-memory and deleted immediately after analysis. We store only the resulting JSON analysis in our secure database.
