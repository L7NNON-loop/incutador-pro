import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageSquare, Send, Loader2, History, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SMSMessage {
  id: string;
  phone_number: string;
  message: string;
  status: string;
  sent_at: string | null;
  created_at: string;
}

const SMS = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<SMSMessage[]>([]);
  const [stats, setStats] = useState({ sent: 0, pending: 0, failed: 0 });

  useEffect(() => {
    checkAuth();
    loadMessages();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    } else {
      setUser(user);
    }
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("sms_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setMessages(data);
      
      const sent = data.filter(m => m.status === 'sent').length;
      const pending = data.filter(m => m.status === 'pending').length;
      const failed = data.filter(m => m.status === 'failed').length;
      setStats({ sent, pending, failed });
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate phone number for Mozambique
      if (!phoneNumber.match(/^(\+258|258)?[8][2-7]\d{7}$/)) {
        toast.error("Número inválido. Use formato: +258XXXXXXXXX ou 258XXXXXXXXX");
        return;
      }

      // Save to database (actual SMS sending would be done via edge function with external API)
      const { error } = await supabase
        .from("sms_messages")
        .insert([{
          phone_number: phoneNumber,
          message: message,
          sender_name: "Placar.sms",
          status: "pending",
          user_id: user.id,
        }]);

      if (error) throw error;

      toast.success("SMS enviado para processamento! (Demo - integração externa necessária)");
      setPhoneNumber("");
      setMessage("");
      loadMessages();

      // In production, this would trigger an edge function to send via SMS API
      // await supabase.functions.invoke('send-sms', { body: { phoneNumber, message } })

    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar SMS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <div className="text-center space-y-4 mb-12 animate-fade-in">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-elegant">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Envio de SMS em Massa
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Envie até 3.000 mensagens por dia para Moçambique sem risco de banimento
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{stats.sent}</div>
            <div className="text-xs text-muted-foreground">Enviadas</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            <div className="text-xs text-muted-foreground">Pendentes</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
            <div className="text-xs text-muted-foreground">Falhadas</div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Send SMS Form */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <Send className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Enviar Nova Mensagem</h2>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Número de Telefone (Moçambique)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+258XXXXXXXXX"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Formato: +258 seguido de 9 dígitos
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem aqui..."
                  required
                  rows={5}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {message.length}/160 caracteres
                </p>
              </div>

              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  <strong>Remetente:</strong> Placar.sms
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  A mensagem será recebida como enviada por Placar.sms
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar SMS
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Message History */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Histórico Recente</h2>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhuma mensagem enviada ainda
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3 border rounded-lg space-y-2 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{msg.phone_number}</span>
                      <Badge
                        variant={
                          msg.status === "sent"
                            ? "default"
                            : msg.status === "failed"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {msg.status === "sent"
                          ? "Enviada"
                          : msg.status === "failed"
                          ? "Falhada"
                          : "Pendente"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {msg.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleString("pt-MZ")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Info Banner */}
        <Card className="mt-8 p-6 max-w-3xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-start gap-4">
            <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold">Plano SMS Premium - $10/mês</h3>
              <p className="text-sm text-muted-foreground">
                Com nosso plano premium você pode enviar até 3.000 mensagens por dia para Moçambique
                sem risco de banimento. Todas as mensagens são enviadas com o remetente "Placar.sms"
                para garantir alta taxa de entrega.
              </p>
              <p className="text-xs text-muted-foreground">
                💡 <strong>Nota:</strong> A integração com API de SMS externa será configurada em breve.
                Esta é uma demonstração funcional da interface.
              </p>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default SMS;
