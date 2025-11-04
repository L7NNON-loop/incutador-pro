-- Add custom_code column to allow user-defined short codes
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS custom_code BOOLEAN DEFAULT false;

-- Add expiration date
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Add user_id for authenticated users
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add analytics columns
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS last_clicked_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS qr_code TEXT;

-- Create detailed analytics table
CREATE TABLE IF NOT EXISTS public.link_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  referer TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT
);

-- Enable RLS on analytics table
ALTER TABLE public.link_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on links if they exist
DROP POLICY IF EXISTS "Users can update their own links" ON public.links;
DROP POLICY IF EXISTS "Users can delete their own links" ON public.links;

-- Users can update their own links
CREATE POLICY "Users can update their own links" 
ON public.links 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can delete their own links
CREATE POLICY "Users can delete their own links" 
ON public.links 
FOR DELETE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Anyone can view analytics
CREATE POLICY "Anyone can view analytics" 
ON public.link_analytics 
FOR SELECT 
USING (true);

-- Anyone can insert analytics
CREATE POLICY "Anyone can insert analytics" 
ON public.link_analytics 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_links_short_code ON public.links(short_code);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_link_id ON public.link_analytics(link_id);

-- Create function to clean expired links
CREATE OR REPLACE FUNCTION delete_expired_links()
RETURNS void AS $$
BEGIN
  DELETE FROM public.links
  WHERE expires_at IS NOT NULL AND expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;