import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Redirect = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const redirect = async () => {
      if (!code) {
        setError(true);
        return;
      }

      try {
        // Get the link from database
        const { data: link, error: fetchError } = await supabase
          .from('links')
          .select('*')
          .eq('short_code', code)
          .single();

        if (fetchError || !link) {
          setError(true);
          return;
        }

        // Increment click count
        await supabase
          .from('links')
          .update({ clicks: link.clicks + 1 })
          .eq('id', link.id);

        // Redirect to original URL
        window.location.href = link.original_url;
      } catch (err) {
        console.error('Redirect error:', err);
        setError(true);
      }
    };

    redirect();
  }, [code]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold">Link não encontrado</h1>
          <p className="text-muted-foreground">
            Este link não existe ou expirou.
          </p>
          <Button onClick={() => navigate('/')}>
            Voltar para página inicial
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <Card className="p-8 text-center space-y-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
        <p className="text-xl text-muted-foreground">Redirecionando...</p>
      </Card>
    </div>
  );
};

export default Redirect;
