import { Zap, QrCode, BarChart3, Lock, Globe, Smartphone } from "lucide-react";
import { Card } from "./ui/card";

const features = [
  {
    icon: Zap,
    title: "Personalização Total",
    description: "Crie links personalizados com o nome que você escolher",
  },
  {
    icon: QrCode,
    title: "QR Code Automático",
    description: "Gere QR codes instantaneamente para seus links",
  },
  {
    icon: BarChart3,
    title: "Analytics Avançado",
    description: "Acompanhe cliques, dispositivos e localização em tempo real",
  },
  {
    icon: Lock,
    title: "Links com Expiração",
    description: "Defina quando seus links devem expirar automaticamente",
  },
  {
    icon: Globe,
    title: "Sem Limites",
    description: "Encurte quantos links quiser, completamente grátis",
  },
  {
    icon: Smartphone,
    title: "Totalmente Responsivo",
    description: "Funciona perfeitamente em todos os dispositivos",
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Recursos Poderosos
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tudo que você precisa para gerenciar seus links de forma profissional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-elegant transition-all duration-300 border-0 bg-gradient-card animate-fade-in group hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 inline-flex p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
