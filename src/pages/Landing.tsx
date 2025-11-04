import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { Comparison } from "@/components/Comparison";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <Hero />
        
        <div className="flex justify-center mb-16 animate-fade-in-up">
          <Link to="/dashboard">
            <Button 
              size="lg" 
              className="h-14 px-8 text-base font-semibold bg-gradient-primary hover:opacity-90 transition-all shadow-elegant"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <Stats />
        <Features />
        <Comparison />

        <div className="text-center mt-16 space-y-6 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold">
            Pronto para começar?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já estão encurtando seus links com a melhor plataforma do mercado.
          </p>
          <Link to="/dashboard">
            <Button 
              size="lg" 
              className="h-14 px-8 text-base font-semibold bg-gradient-primary hover:opacity-90 transition-all shadow-elegant"
            >
              Criar Meu Primeiro Link
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
