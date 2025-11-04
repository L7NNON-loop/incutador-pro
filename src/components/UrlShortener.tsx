import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link2, Copy, CheckCheck, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ShortenedLink {
  id: string;
  short_code: string;
  original_url: string;
  clicks: number;
  created_at: string;
}

export const UrlShortener = () => {
  const [url, setUrl] = useState("");
  const [isShortening, setIsShortening] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load existing links on mount
  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error loading links:', error);
      toast.error('Erro ao carregar links');
    } finally {
      setIsLoading(false);
    }
  };

  const generateShortCode = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleShorten = async () => {
    if (!url.trim()) {
      toast.error("Por favor, insira uma URL");
      return;
    }

    if (!isValidUrl(url)) {
      toast.error("Por favor, insira uma URL válida");
      return;
    }

    setIsShortening(true);
    
    try {
      const shortCode = generateShortCode();
      
      const { data, error } = await supabase
        .from('links')
        .insert({
          short_code: shortCode,
          original_url: url,
        })
        .select()
        .single();

      if (error) throw error;

      setLinks([data, ...links]);
      setUrl("");
      toast.success("Link encurtado com sucesso!");
    } catch (error: any) {
      console.error('Error shortening URL:', error);
      if (error.code === '23505') {
        // Unique constraint violation - try again with new code
        handleShorten();
        return;
      }
      toast.error("Erro ao encurtar link. Tente novamente.");
    } finally {
      setIsShortening(false);
    }
  };

  const handleCopy = async (shortCode: string, id: string) => {
    const fullUrl = `${window.location.origin}/r/${shortCode}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    toast.success("Link copiado!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <Card className="p-6 shadow-elegant border-0 bg-card">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Cole seu link aqui..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleShorten()}
              className="text-sm h-11 border-2 focus-visible:ring-2 focus-visible:ring-primary"
            />
            <Button
              onClick={handleShorten}
              disabled={isShortening}
              size="lg"
              className="h-11 px-6 bg-gradient-primary hover:opacity-90 transition-all shadow-elegant text-sm"
            >
              <Link2 className="mr-2 h-4 w-4" />
              {isShortening ? "Encurtando..." : "Encurtar"}
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : links.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Links Recentes</h2>
          <div className="space-y-2">
            {links.map((link) => (
              <Card
                key={link.id}
                className="p-4 shadow-card hover:shadow-elegant transition-all duration-300 border-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary truncate">
                        {window.location.origin}/r/{link.short_code}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(link.short_code, link.id)}
                        className="hover:bg-primary/10 h-7 w-7 p-0"
                      >
                        {copiedId === link.id ? (
                          <CheckCheck className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ExternalLink className="h-3 w-3" />
                      <span className="truncate">{link.original_url}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{link.clicks} cliques</span>
                      <span>•</span>
                      <span>
                        {new Date(link.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
