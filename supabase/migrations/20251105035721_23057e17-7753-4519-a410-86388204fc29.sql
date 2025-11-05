-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create credits table
CREATE TABLE public.user_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credits"
  ON public.user_credits FOR SELECT
  USING (auth.uid() = user_id);

-- Create redeem codes table
CREATE TABLE public.redeem_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  credits INTEGER NOT NULL,
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.redeem_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active codes"
  ON public.redeem_codes FOR SELECT
  USING (active = true);

-- Insert predefined codes
INSERT INTO public.redeem_codes (code, credits, max_uses) VALUES
  ('Madara', 10, 999999),
  ('EllonMusk', 50, 999999),
  ('CarlitosM', 1000, 999999),
  ('INC', 2, 999999);

-- Create code redemptions history
CREATE TABLE public.code_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code_id UUID NOT NULL REFERENCES public.redeem_codes(id) ON DELETE CASCADE,
  credits_received INTEGER NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, code_id)
);

ALTER TABLE public.code_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own redemptions"
  ON public.code_redemptions FOR SELECT
  USING (auth.uid() = user_id);

-- Create subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('url_shortener', 'sms_bulk', 'both')),
  price_usd DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Create SMS messages table (for history)
CREATE TABLE public.sms_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  sender_name TEXT DEFAULT 'Placar.sms',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  credits_used INTEGER DEFAULT 1,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sms_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON public.sms_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON public.sms_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to redeem code
CREATE OR REPLACE FUNCTION public.redeem_code(code_text TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code_id UUID;
  v_credits INTEGER;
  v_max_uses INTEGER;
  v_current_uses INTEGER;
  v_user_id UUID;
  v_existing_credits INTEGER;
BEGIN
  v_user_id := auth.uid();
  
  -- Check if code exists and is active
  SELECT id, credits, max_uses, current_uses
  INTO v_code_id, v_credits, v_max_uses, v_current_uses
  FROM public.redeem_codes
  WHERE code = code_text AND active = true;
  
  IF v_code_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Código inválido ou expirado');
  END IF;
  
  -- Check if max uses reached
  IF v_current_uses >= v_max_uses THEN
    RETURN json_build_object('success', false, 'message', 'Código já foi usado o máximo de vezes');
  END IF;
  
  -- Check if user already redeemed this code
  IF EXISTS (
    SELECT 1 FROM public.code_redemptions
    WHERE user_id = v_user_id AND code_id = v_code_id
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Você já resgatou este código');
  END IF;
  
  -- Insert redemption record
  INSERT INTO public.code_redemptions (user_id, code_id, credits_received)
  VALUES (v_user_id, v_code_id, v_credits);
  
  -- Update code usage
  UPDATE public.redeem_codes
  SET current_uses = current_uses + 1
  WHERE id = v_code_id;
  
  -- Add credits to user (insert or update)
  INSERT INTO public.user_credits (user_id, credits)
  VALUES (v_user_id, v_credits)
  ON CONFLICT (user_id) DO UPDATE
  SET credits = user_credits.credits + v_credits,
      updated_at = now();
  
  -- Get new total
  SELECT credits INTO v_existing_credits
  FROM public.user_credits
  WHERE user_id = v_user_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Código resgatado com sucesso!',
    'credits_received', v_credits,
    'total_credits', v_existing_credits
  );
END;
$$;

-- Function to use credits (for link shortening)
CREATE OR REPLACE FUNCTION public.use_credits(amount INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_current_credits INTEGER;
BEGIN
  v_user_id := auth.uid();
  
  -- Get current credits
  SELECT credits INTO v_current_credits
  FROM public.user_credits
  WHERE user_id = v_user_id;
  
  -- If no record, user has 0 credits
  IF v_current_credits IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if enough credits
  IF v_current_credits < amount THEN
    RETURN false;
  END IF;
  
  -- Deduct credits
  UPDATE public.user_credits
  SET credits = credits - amount,
      updated_at = now()
  WHERE user_id = v_user_id;
  
  RETURN true;
END;
$$;

-- Update links table to track credit usage
ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS credits_used INTEGER DEFAULT 2;

-- Update trigger for updated_at on various tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();