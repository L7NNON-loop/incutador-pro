import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link2, Copy, CheckCheck, ExternalLink, Loader2, QrCode, BarChart3, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import QRCode from "qrcode";
import { QRCodeModal } from "./QRCodeModal";
import { LinkAnalytics } from "./LinkAnalytics";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface ShortenedLink {
  id: string;
  short_code: string;
  original_url: string;
  clicks: number;
  created_at: string;
  custom_code: boolean;
  expires_at: string | null;
  qr_code: string | null;
}

export const UrlShortener = () => {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [expiresIn, setExpiresIn] = useState("");
  const [isShortening, setIsShortening] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);
  const [selectedShortUrl, setSelectedShortUrl] = useState("");
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [selectedShortCode, setSelectedShortCode] = useState("");

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

  const generateQRCode = async (url: string) => {
    try {
      return await QRCode.toDataURL(url, {
        width: 512,
        margin: 2,
        color: {
          dark: '#6366F1',
          light: '#FFFFFF',
        },
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
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

    if (useCustom && !customCode.trim()) {
      toast.error("Por favor, defina um código personalizado");
      return;
    }

    if (useCustom && customCode.length < 3) {
      toast.error("O código personalizado deve ter pelo menos 3 caracteres");
      return;
    }

    setIsShortening(true);
    
    try {
      const shortCode = useCustom ? customCode.trim() : generateShortCode();
      
      // Check if custom code already exists
      if (useCustom) {
        const { data: existing } = await supabase
          .from('links')
          .select('id')
          .eq('short_code', shortCode)
          .single();
        
        if (existing) {
          toast.error("Este código personalizado já está em uso");
          setIsShortening(false);
          return;
        }
      }

      // Generate QR code
      const fullUrl = `${window.location.origin}/${shortCode}`;
      const qrCodeData = await generateQRCode(fullUrl);

      // Calculate expiration date if set
      let expiresAt = null;
      if (expiresIn) {
        const days = parseInt(expiresIn);
        if (!isNaN(days) && days > 0) {
          const date = new Date();
          date.setDate(date.getDate() + days);
          expiresAt = date.toISOString();
        }
      }
      
      const { data, error } = await supabase
        .from('links')
        .insert({
          short_code: shortCode,
          original_url: url,
          custom_code: useCustom,
          expires_at: expiresAt,
          qr_code: qrCodeData,
        })
        .select()
        .single();

      if (error) throw error;

      setLinks([data, ...links]);
      setUrl("");
      setCustomCode("");
      setExpiresIn("");
      setUseCustom(false);
      toast.success("Link encurtado com sucesso!");
    } catch (error: any) {
      console.error('Error shortening URL:', error);
      if (error.code === '23505') {
        handleShorten();
        return;
      }
      toast.error("Erro ao encurtar link. Tente novamente.");
    } finally {
      setIsShortening(false);
    }
  };

  const handleCopy = async (shortCode: string, id: string) => {
    const fullUrl = `${window.location.origin}/${shortCode}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    toast.success("Link copiado!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShowQR = (qrCode: string | null, shortCode: string) => {
    setSelectedQrCode(qrCode);
    setSelectedShortUrl(`${window.location.origin}/${shortCode}`);
    setQrModalOpen(true);
  };

  const handleShowAnalytics = (linkId: string, shortCode: string) => {
    setSelectedLinkId(linkId);
    setSelectedShortCode(shortCode);
    setAnalyticsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLinks(links.filter(link => link.id !== id));
      toast.success("Link excluído com sucesso!");
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error("Erro ao excluir link");
    }
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <Card className="p-8 shadow-elegant border-0 bg-gradient-card animate-fade-in">
          <div className="space-y-6">
            <div className="space-y-3">
              <Input
                type="url"
                placeholder="Cole seu link aqui..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleShorten()}
                className="text-base h-12 border-2 focus-visible:ring-2 focus-visible:ring-primary"
              />

              <div className="flex items-center space-x-2">
                <Switch
                  id="custom-mode"
                  checked={useCustom}
                  onCheckedChange={setUseCustom}
                />
                <Label htmlFor="custom-mode" className="cursor-pointer">
                  Usar código personalizado
                </Label>
              </div>

              {useCustom && (
                <Input
                  type="text"
                  placeholder="seu-codigo-personalizado"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="h-12 border-2 animate-fade-in"
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expires" className="text-sm text-muted-foreground mb-1.5 block">
                    Expira em (dias) - opcional
                  </Label>
                  <Input
                    id="expires"
                    type="number"
                    placeholder="Ex: 7, 30, 90..."
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                    min="1"
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleShorten}
              disabled={isShortening}
              size="lg"
              className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-all shadow-elegant text-base font-semibold"
            >
              <Link2 className="mr-2 h-5 w-5" />
              {isShortening ? "Encurtando..." : "Encurtar Link"}
            </Button>
          </div>
        </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : links.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Links Recentes</h2>
            <div className="space-y-3">
              {links.map((link, index) => (
                <Card
                  key={link.id}
                  className="p-5 shadow-card hover:shadow-elegant transition-all duration-300 border-0 bg-gradient-card animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm md:text-base font-bold text-primary break-all">
                            {window.location.origin}/{link.short_code}
                          </span>
                          {link.custom_code && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              Personalizado
                            </span>
                          )}
                          {link.expires_at && (
                            <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full flex items-center gap-1">
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              <span className="hidden sm:inline">Expira em </span>
                              {new Date(link.expires_at).toLocaleDateString("pt-BR")}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                          <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate break-all">{link.original_url}</span>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground flex-wrap">
                          <span className="font-semibold">{link.clicks} cliques</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="text-xs">
                            {new Date(link.created_at).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(link.short_code, link.id)}
                        className="h-8 md:h-9 text-xs md:text-sm"
                      >
                        {copiedId === link.id ? (
                          <>
                            <CheckCheck className="mr-1 md:mr-2 h-3.5 md:h-4 w-3.5 md:w-4" />
                            <span className="hidden sm:inline">Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1 md:mr-2 h-3.5 md:h-4 w-3.5 md:w-4" />
                            <span className="hidden sm:inline">Copiar</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShowQR(link.qr_code, link.short_code)}
                        className="h-8 md:h-9 text-xs md:text-sm"
                      >
                        <QrCode className="mr-1 md:mr-2 h-3.5 md:h-4 w-3.5 md:w-4" />
                        <span className="hidden sm:inline">QR Code</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShowAnalytics(link.id, link.short_code)}
                        className="h-8 md:h-9 text-xs md:text-sm"
                      >
                        <BarChart3 className="mr-1 md:mr-2 h-3.5 md:h-4 w-3.5 md:w-4" />
                        <span className="hidden sm:inline">Analytics</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(link.id)}
                        className="h-8 md:h-9 text-xs md:text-sm text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="mr-1 md:mr-2 h-3.5 md:h-4 w-3.5 md:w-4" />
                        <span className="hidden sm:inline">Excluir</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <QRCodeModal
        open={qrModalOpen}
        onOpenChange={setQrModalOpen}
        qrCode={selectedQrCode}
        shortUrl={selectedShortUrl}
      />

      <LinkAnalytics
        open={analyticsOpen}
        onOpenChange={setAnalyticsOpen}
        linkId={selectedLinkId}
        shortCode={selectedShortCode}
      />
    </>
  );
};
