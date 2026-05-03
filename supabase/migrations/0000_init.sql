-- Supabase Database Schema for HireDx

-- 1. Users Table (extends default Supabase auth struct)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name text,
  email text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Interviews Table
CREATE TABLE public.interviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL,
  file_url text, -- Storage bucket URL
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  status text DEFAULT 'analyzing'
);

-- 3. Analysis Results Table
CREATE TABLE public.analysis_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id uuid REFERENCES public.interviews(id) ON DELETE CASCADE,
  overall_score integer,
  weakness_summary text,
  filler_data jsonb,
  weakness_data jsonb,
  skill_data jsonb,
  timeline_data jsonb,
  qna jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own interviews" ON public.interviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interviews" ON public.interviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('interviews', 'interviews', false);
