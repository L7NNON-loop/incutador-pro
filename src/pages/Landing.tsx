import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { Comparison } from "@/components/Comparison";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Link2, MessageSquare, Zap, Shield, TrendingUp, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-fade-in">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">A plataforma mais completa e acessível</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in-up">
            Links curtos,<br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              grandes resultados
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
            A plataforma premium mais acessível do mercado. Encurte links, gere QR Codes,
            envie SMS em massa e tenha analytics completas por apenas <strong className="text-foreground">$1 USD/mês</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="h-14 px-8 text-base font-semibold bg-gradient-primary hover:opacity-90 transition-all shadow-elegant"
              >
                Começar Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 text-base font-semibold hover:bg-accent"
              >
                Ver Preços
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground pt-8">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Instantâneo</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Analytics em Tempo Real</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <span>Sistema de Créditos</span>
            </div>
          </div>
        </div>

        {/* Two Main Services */}
        <div className="grid md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
          <Card className="p-8 space-y-4 hover:shadow-glow transition-all border-2 hover:border-primary animate-scale-in">
            <div className="p-4 bg-gradient-primary rounded-xl w-fit shadow-elegant">
              <Link2 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Encurtador de Links</h3>
            <p className="text-muted-foreground">
              Crie links personalizados com QR Code automático, analytics detalhadas
              e controle total de expiração.
            </p>
            <div className="pt-4">
              <p className="text-3xl font-bold text-primary">$1 USD</p>
              <p className="text-sm text-muted-foreground">por mês - links ilimitados</p>
            </div>
            <Link to="/pricing" className="block">
              <Button className="w-full bg-gradient-primary hover:opacity-90">
                Saiba Mais
              </Button>
            </Link>
          </Card>

          <Card className="p-8 space-y-4 hover:shadow-glow transition-all border-2 hover:border-primary animate-scale-in bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 mb-2">
              <span className="text-xs font-medium text-primary">MAIS POPULAR</span>
            </div>
            <div className="p-4 bg-gradient-primary rounded-xl w-fit shadow-elegant">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold">SMS em Massa</h3>
            <p className="text-muted-foreground">
              Envie até 3.000 mensagens por dia para Moçambique sem banimento.
              Remetente: <strong>Placar.sms</strong>
            </p>
            <div className="pt-4">
              <p className="text-3xl font-bold text-primary">$10 USD</p>
              <p className="text-sm text-muted-foreground">por mês - 3.000 SMS/dia</p>
            </div>
            <Link to="/pricing" className="block">
              <Button className="w-full bg-gradient-primary hover:opacity-90">
                Saiba Mais
              </Button>
            </Link>
          </Card>
        </div>

        <Stats />
        <Features />
        <Comparison />

        {/* CTA Final */}
        <div className="text-center mt-20 space-y-6 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold">
            Pronto para começar?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Crie sua conta agora e ganhe créditos de bônus. Use códigos promocionais
            para ganhar ainda mais créditos gratuitamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="h-14 px-8 text-base font-semibold bg-gradient-primary hover:opacity-90 transition-all shadow-elegant"
              >
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
