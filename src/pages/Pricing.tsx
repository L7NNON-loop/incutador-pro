import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Link2, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <div className="text-center space-y-4 mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Planos Premium
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano perfeito para suas necessidades. Os preços mais competitivos do mercado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* URL Shortener Plan */}
          <Card className="p-8 space-y-6 hover:shadow-glow transition-all animate-scale-in border-2 hover:border-primary">
            <div className="space-y-2">
              <div className="p-3 bg-gradient-primary rounded-xl w-fit shadow-elegant">
                <Link2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Encurtador de Links</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$1</span>
                <span className="text-muted-foreground">USD/mês</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Links personalizados ilimitados</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Geração automática de QR Code</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Analytics detalhadas em tempo real</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Links com data de expiração</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Suporte prioritário</span>
              </div>
            </div>

            <Link to="/auth" className="block">
              <Button className="w-full bg-gradient-primary hover:opacity-90 shadow-elegant">
                Começar Agora
              </Button>
            </Link>
          </Card>

          {/* SMS Bulk Plan */}
          <Card className="p-8 space-y-6 hover:shadow-glow transition-all animate-scale-in border-2 hover:border-primary bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 mb-2">
                <span className="text-xs font-medium text-primary">MAIS POPULAR</span>
              </div>
              <div className="p-3 bg-gradient-primary rounded-xl w-fit shadow-elegant">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Envio de SMS em Massa</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$10</span>
                <span className="text-muted-foreground">USD/mês</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm"><strong>3.000 mensagens/dia</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Sem risco de banimento</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Remetente personalizado: <strong>Placar.sms</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Específico para Moçambique</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Histórico completo de envios</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Suporte prioritário 24/7</span>
              </div>
            </div>

            <Link to="/auth" className="block">
              <Button className="w-full bg-gradient-primary hover:opacity-90 shadow-elegant">
                Começar Agora
              </Button>
            </Link>
          </Card>
        </div>

        <div className="text-center mt-16 space-y-4 animate-fade-in">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Dica:</strong> Use créditos para economizar ainda mais! Resgate códigos promocionais no dashboard.
          </p>
          <p className="text-xs text-muted-foreground">
            Cada link encurtado custa 2 créditos. Adquira créditos com códigos de resgate.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
