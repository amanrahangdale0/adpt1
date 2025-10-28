-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'premium');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  course TEXT,
  about TEXT,
  study_days TEXT[] DEFAULT '{}',
  study_hours_start TEXT,
  study_hours_end TEXT,
  time_preference TEXT DEFAULT 'morning',
  onboarding_complete BOOLEAN DEFAULT FALSE,
  setup_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  exam_date DATE,
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create progress table
CREATE TABLE public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  daily_minutes INTEGER DEFAULT 0,
  weekly_minutes INTEGER DEFAULT 0,
  completed_sessions INTEGER DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id)
);

-- Create schedules table
CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  schedule_data JSONB NOT NULL,
  week_start DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_conversations table
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'New Conversation',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create study_sessions table
CREATE TABLE public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  duration_minutes INTEGER NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for subjects
CREATE POLICY "Users can view own subjects"
  ON public.subjects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subjects"
  ON public.subjects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subjects"
  ON public.subjects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subjects"
  ON public.subjects FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for progress
CREATE POLICY "Users can view own progress"
  ON public.progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for schedules
CREATE POLICY "Users can view own schedules"
  ON public.schedules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedules"
  ON public.schedules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules"
  ON public.schedules FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules"
  ON public.schedules FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for chat_conversations
CREATE POLICY "Users can view own conversations"
  ON public.chat_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON public.chat_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON public.chat_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON public.chat_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view own messages"
  ON public.chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for study_sessions
CREATE POLICY "Users can view own sessions"
  ON public.study_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.study_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON public.study_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON public.study_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.subjects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to create profile and default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, onboarding_complete)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Student'),
    FALSE
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  INSERT INTO public.progress (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_subjects_user_id ON public.subjects(user_id);
CREATE INDEX idx_progress_user_id ON public.progress(user_id);
CREATE INDEX idx_schedules_user_id ON public.schedules(user_id);
CREATE INDEX idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX idx_study_sessions_date ON public.study_sessions(date);