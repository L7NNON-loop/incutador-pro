import { Check, X } from "lucide-react";
import { Card } from "./ui/card";

const competitors = [
  { name: "Bitly", price: "$29/mês", customLinks: true, analytics: "Básico", qrCode: false, expiration: false, ads: true },
  { name: "TinyURL", price: "Grátis", customLinks: false, analytics: "Não", qrCode: false, expiration: false, ads: true },
  { name: "Rebrandly", price: "$34/mês", customLinks: true, analytics: "Médio", qrCode: true, expiration: false, ads: false },
];

const ourFeatures = {
  name: "Nossa Plataforma",
  price: "Grátis",
  customLinks: true,
  analytics: "Completo",
  qrCode: true,
  expiration: true,
  ads: false,
};

export const Comparison = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Por Que Somos a Melhor Escolha?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Compare e veja porque estamos muito além da concorrência
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-5 gap-4 mb-4 text-sm font-semibold">
              <div className="text-muted-foreground">Plataforma</div>
              <div className="text-center text-muted-foreground">Preço</div>
              <div className="text-center text-muted-foreground">Links Personalizados</div>
              <div className="text-center text-muted-foreground">Analytics</div>
              <div className="text-center text-muted-foreground">QR Code</div>
            </div>

            {/* Our Platform - Highlighted */}
            <Card className="grid grid-cols-5 gap-4 p-4 mb-2 border-2 border-primary bg-gradient-primary/5 animate-fade-in">
              <div className="font-bold text-primary flex items-center">
                {ourFeatures.name}
                <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  MELHOR
                </span>
              </div>
              <div className="text-center font-bold text-success flex items-center justify-center">
                {ourFeatures.price}
              </div>
              <div className="flex items-center justify-center">
                <Check className="h-5 w-5 text-success" />
              </div>
              <div className="flex items-center justify-center font-semibold text-success">
                {ourFeatures.analytics}
              </div>
              <div className="flex items-center justify-center">
                <Check className="h-5 w-5 text-success" />
              </div>
            </Card>

            {/* Competitors */}
            {competitors.map((competitor, index) => (
              <Card
                key={index}
                className="grid grid-cols-5 gap-4 p-4 mb-2 border-0 bg-card/50 animate-fade-in"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="flex items-center text-muted-foreground">{competitor.name}</div>
                <div className="text-center flex items-center justify-center text-muted-foreground">
                  {competitor.price}
                </div>
                <div className="flex items-center justify-center">
                  {competitor.customLinks ? (
                    <Check className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <X className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <div className="flex items-center justify-center text-muted-foreground">
                  {competitor.analytics}
                </div>
                <div className="flex items-center justify-center">
                  {competitor.qrCode ? (
                    <Check className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <X className="h-5 w-5 text-destructive" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Card className="inline-block p-6 border-0 bg-gradient-primary shadow-elegant">
            <p className="text-primary-foreground font-semibold text-lg mb-2">
              100% Gratuito. Sem Limites. Sem Anúncios.
            </p>
            <p className="text-primary-foreground/80">
              Criado com amor pela nossa incubadora de startups 🚀
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};
