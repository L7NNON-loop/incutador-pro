-- Fix function search path security warning
CREATE OR REPLACE FUNCTION delete_expired_links()
RETURNS void AS $$
BEGIN
  DELETE FROM public.links
  WHERE expires_at IS NOT NULL AND expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;