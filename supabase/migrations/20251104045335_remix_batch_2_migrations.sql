
-- Migration: 20251104041120
-- Create links table
CREATE TABLE public.links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  short_code text NOT NULL UNIQUE,
  original_url text NOT NULL,
  clicks integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create index for fast lookups by short code
CREATE INDEX idx_links_short_code ON public.links(short_code);

-- Enable Row Level Security
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read links (needed for redirection)
CREATE POLICY "Anyone can read links"
  ON public.links
  FOR SELECT
  USING (true);

-- Allow anyone to create links (public shortener)
CREATE POLICY "Anyone can create links"
  ON public.links
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update click counts
CREATE POLICY "Anyone can update clicks"
  ON public.links
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_links_updated_at
  BEFORE UPDATE ON public.links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Migration: 20251104041138
-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
