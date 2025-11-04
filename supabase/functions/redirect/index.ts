import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const url = new URL(req.url);
    const shortCode = url.searchParams.get('code');

    if (!shortCode) {
      return new Response(
        JSON.stringify({ error: 'Short code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Redirect] Looking up short code: ${shortCode}`);

    // Get the link from database
    const { data: link, error: fetchError } = await supabase
      .from('links')
      .select('*')
      .eq('short_code', shortCode)
      .single();

    if (fetchError || !link) {
      console.error(`[Redirect] Link not found: ${shortCode}`, fetchError);
      return new Response(
        JSON.stringify({ error: 'Link not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Redirect] Found link: ${link.original_url}`);

    // Increment click count
    const { error: updateError } = await supabase
      .from('links')
      .update({ clicks: link.clicks + 1 })
      .eq('id', link.id);

    if (updateError) {
      console.error('[Redirect] Failed to update click count:', updateError);
    }

    // Return the original URL for client-side redirect
    return new Response(
      JSON.stringify({ url: link.original_url }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('[Redirect] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
