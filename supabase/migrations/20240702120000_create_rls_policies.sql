-- Enable RLS for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile access policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE 
USING (id = auth.uid());

-- Enable RLS for posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Posts access policies
CREATE POLICY "Public read access" 
ON public.posts FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Users can create posts"
ON public.posts FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authors can update their posts"
ON public.posts FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Authors can delete their posts"
ON public.posts FOR DELETE 
USING (user_id = auth.uid());

-- Enable RLS for comments table
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Authors can manage their comments"
ON public.comments
FOR ALL
USING (user_id = auth.uid());

-- Enable RLS for likes table
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Likes policies
CREATE POLICY "Users can manage their likes"
ON public.likes
FOR ALL
USING (user_id = auth.uid());

-- Enable Realtime for posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;