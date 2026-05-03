# 🚀 Full Deployment Guide: HireDx

This guide provides step-by-step instructions to deploy HireDx from scratch for free.

---

## Part 1: Supabase Setup (Database & Auth)

Supabase provides your database, authentication, and backend infrastructure.

1.  **Create a Account**: Sign up at [supabase.com](https://supabase.com/).
2.  **Create a New Project**:
    - Click **New Project**.
    - Name: `HireDx`.
    - Database Password: *Generate and save this securely.*
    - Region: Select the one closest to you.
    - Tier: **Free**.
3.  **Initialize the Database**:
    - Go to the **SQL Editor** (left sidebar).
    - Click **New Query**.
    - Paste the following SQL and click **Run**:
      ```sql
      -- Create the interviews table
      CREATE TABLE public.interviews (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          created_at TIMESTAMPTZ DEFAULT now(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          role_target TEXT,
          report_data JSONB NOT NULL
      );

      -- Enable Row Level Security (RLS)
      ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

      -- Create Security Policies
      CREATE POLICY "Users can insert their own interviews" 
      ON public.interviews FOR INSERT 
      WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can view their own interviews" 
      ON public.interviews FOR SELECT 
      USING (auth.uid() = user_id);

      CREATE POLICY "Users can delete their own interviews" 
      ON public.interviews FOR DELETE 
      USING (auth.uid() = user_id);
      ```
4.  **Configure Authentication**:
    - Go to **Authentication > Providers**.
    - Ensure **Email** is enabled.
    - (Optional) Disable "Confirm Email" for faster testing during the hackathon.
5.  **Get API Keys**:
    - Go to **Project Settings > API**.
    - Copy the `Project URL`.
    - Copy the `anon public` key.

---

## Part 2: Google Gemini Setup (AI Engine)

HireDx uses Gemini for multimodal video/audio analysis.

1.  Visit [Google AI Studio](https://aistudio.google.com/).
2.  Log in with your Google account.
3.  Click **Get API key** in the top left.
4.  Click **Create API key in new project**.
5.  Copy this key. Keep it secret!

---

## Part 3: GitHub Setup

1.  Create a new **Private** or **Public** repository on [GitHub](https://github.com/).
2.  In your local project folder (`hiredx`), run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit for deployment"
    git branch -M main
    git remote add origin YOUR_GITHUB_REPO_URL
    git push -u origin main
    ```

---

## Part 4: Vercel Setup (Hosting)

Vercel will host your Next.js application.

1.  Sign in to [Vercel](https://vercel.com/) with your GitHub account.
2.  Click **Add New > Project**.
3.  Find your `hiredx` repository and click **Import**.
4.  **Configure Environment Variables**:
    Expand the "Environment Variables" section and add the following 3 keys exactly:
    - `NEXT_PUBLIC_SUPABASE_URL`: (Paste your Supabase URL)
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Paste your Supabase Anon Key)
    - `GEMINI_API_KEY`: (Paste your Gemini API Key)
5.  **Build & Deploy**:
    - Click **Deploy**.
    - Vercel will install dependencies and build the project.
    - Once finished, you will get a unique `.vercel.app` URL.

---

## Part 5: Final Verification

1.  Open your new live URL.
2.  Go to the **Signup** page and create a test account.
3.  Go to the **Analyze** page and upload a small audio or video file (under 100MB).
4.  Wait for the analysis to finish (it may take 15-45 seconds).
5.  Verify the report appears in your **Profile** history.
6.  Test the **Action Roadmap** and **Practice Bank** tabs.

---

### Troubleshooting
- **Build Errors**: Check the Vercel logs. Ensure all environment variables are spelled correctly.
- **Analysis Fails**: Ensure your `GEMINI_API_KEY` is valid and active in Google AI Studio.
- **Data Not Saving**: Ensure you ran the SQL script in Part 1 to create the table.
